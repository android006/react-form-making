import React, {Component} from 'react';
import {Row, Col, Form, Radio, Input, Checkbox, InputNumber, Tabs} from 'antd';
import moment from "moment";
import Box from "./Drap/Box";
import Dustbin from "./Drap/Dustbin";
import ReactJson from 'react-json-view';
import {DragDropContext} from 'react-dnd';
import MyModal from "../lib/components/MyModal";
import MyIcon from "../lib/components/MyIcon/index";
import WidgetForm from "../lib/components/WidgetForm";
import BasicForm from "../lib/components/BasicForm/index";
import MobileWidgetForm from "../lib/components/MobileWidgetForm";
import FormItem from "../lib/components/WidgetForm/FormItem/index";
import HTML5Backend, {NativeTypes} from 'react-dnd-html5-backend';
import {basicComponents, advanceComponents, layoutComponents} from "./componentsConfig";

import './index.less';

class IndexPage extends Component {
  state = {
    activeType: "field",
    isDown: false,
    activeWidget: {},

    formHistory: [],
    formHistoryIndex: -1,
    _formHistoryIndex: -1,
    formConfig: {
      list: [],
      key: `formConfig_${moment().format("x")}`,
      config: {
        layout: "horizontal",
        labelAlign: "right",
        colon: true, // 冒号:
        hideRequiredMark: false, // 隐藏必填标志
        labelCol: 4,
        wrapperCol: 20,
      }
    },
  };

  // 渲染左侧
  renderLeft = () => {
    const t = this;
    const {formConfig} = t.state;
    const list = [
      {
        title: "基础字段",
        list: basicComponents
      }, {
        title: "高级字段",
        list: advanceComponents
      }, {
        title: "布局字段",
        list: layoutComponents
      }
    ];
    return (
      <div className="IndexPage-Left">
        {
          list.map((item, index) => (
            <div key={index}>
              <div className="IndexPage-Left-Title">{item.title}</div>
              <div className="IndexPage-Left-List">
                {
                  item.list.map((subItem, subIndex) => (
                    <Box
                      index={formConfig.list.length}
                      onClick={t.widgetCopy.bind(t, subItem, formConfig.list.length)}
                      formItem={subItem}
                      key={index + "-" + subIndex}
                      className="IndexPage-Left-List-Item"
                      type={'wrap'}
                      isDropped={false}>
                      <MyIcon type={subItem.icon}/> <span>{subItem.label}</span>
                    </Box>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  };

  // 以下位中间空间区

  // 渲染中间
  renderCenter = () => {
    const t = this;
    const {formConfig, formHistory, _formHistoryIndex} = t.state;
    let {config = {}, list} = formConfig;

    const getBtnStyle = (type) => {
      return {
        color: type ? "#1682e6" : "#c0c4cc",
        cursor: type ? "pointer" : "not-allowed",
      }
    };

    let _revoke = _formHistoryIndex >= 0;
    let _recovery = _formHistoryIndex < formHistory.length - 1;
    let _clear = formConfig && formConfig.list && formConfig.list.length > 0;

    const btnList = [
      {title: "撤销", icon: "iconchexiao", onClick: _revoke && t.onRevoke, style: {...getBtnStyle(_revoke)}},
      {title: "恢复", icon: "iconhuifu", onClick: _recovery && t.onRecovery, style: {...getBtnStyle(_recovery)}},
      {title: "清空", icon: "iconqingkong", onClick: _clear && t.onClear, style: {...getBtnStyle(_clear)}},
      {title: "PC端预览", icon: "iconyulan", onClick: t.onPreview},
      {title: "移动端预览", icon: "iconyulan", onClick: t.onPreviewMobile},
      {title: "生成JSON", icon: "iconshengcheng", onClick: t.createJSON},
    ];

    return (
      <div className="IndexPage-Center">
        <Form {...config} className="IndexPage-Center-Form">
          <div className="IndexPage-Center-Header">
            {
              btnList.map((item, index) => (
                <div key={index} className="IndexPage-Center-Header-Item" onClick={item.onClick} style={item.style}>
                  <MyIcon type={item.icon}/> <span>{item.title}</span>
                </div>
              ))
            }
          </div>
          <div className="IndexPage-Center-Content">
            <div className="IndexPage-Center-Content-Wrap">
              {t.renderDustbin(list, 0, formConfig.key, true)}
            </div>
          </div>
        </Form>
      </div>
    )
  };

  // 移动
  onMove = (dragIndex, hoverIndex) => {
    const t = this;
    const {formConfig} = t.state;
    const {list} = formConfig;
    formConfig.list[dragIndex] = formConfig.list.splice(hoverIndex, 1, list[dragIndex])[0];
    this.setState({formConfig})
  };

  // 放置
  onDrop = (item) => {
    const t = this;
    const {formItem = {}, wrapKey, index} = item;
    if (formItem && formItem.paramName) {
      return
    }

    let {formConfig} = t.state;
    let {config} = formConfig;
    let key = t.createParamName(formItem);
    let newItem = {...JSON.parse(JSON.stringify(formItem)), key, paramName: key};

    if (Object.keys(newItem).includes("labelCol")) {
      newItem.labelCol = config.labelCol;
    }
    if (Object.keys(newItem).includes("wrapperCol")) {
      newItem.wrapperCol = config.wrapperCol;
    }

    const loopData = (data) => {
      data.map(i => {
        if (i.columns && i.columns.length) {
          if (i.key === wrapKey) {
            i.columns[index].list.push(newItem)
          } else {
            i.columns.map(c => {
              if (c.list && c.list.length) {
                loopData(c.list)
              }
            })
          }
        }
      })
    };

    if (formConfig.key === wrapKey) {
      formConfig.list.push(newItem)
    } else {
      loopData(formConfig.list);
    }

    this.onHistory(formConfig, newItem);
  };

  // 历史操作
  onHistory = (formConfig, activeWidget) => {
    const t = this;
    // 更新历史记录
    let {formHistory, formHistoryIndex, _formHistoryIndex} = t.state;
    if (formHistoryIndex !== _formHistoryIndex) {
      let _formHistory = formHistory.slice(0, _formHistoryIndex + 1); // 通过下标截取
      formHistory = JSON.parse(JSON.stringify(_formHistory));
    }

    let _history = JSON.parse(JSON.stringify({formConfig, activeWidget}));
    formHistory.push(_history);

    this.setState({
      formConfig,
      activeWidget,
      formHistory,
      _formHistoryIndex: formHistory.length - 1,
      formHistoryIndex: formHistory.length - 1,
    })
  };

  // 生成表单字段名
  createParamName = (item) => {
    let {type} = item;
    return `${type}_${moment().format("x")}`;
  };

  // 清空
  onClear = () => {
    const t = this;
    let {formConfig} = t.state;
    if (formConfig && formConfig.list && formConfig.list.length) {
      this.onHistory({
        list: [],
        key: `formConfig_${moment().format("x")}`,
        config: {
          layout: "horizontal",
          labelAlign: "right",
          colon: true, // 冒号:
          hideRequiredMark: false, // 隐藏必填标志
          labelCol: 4,
          wrapperCol: 20,
        }
      }, {});
    }
  };

  // PC端预览
  onPreview = () => {
    const t = this;
    this.setState({
      preview: true
    })
  };

  // 移动端预览
  onPreviewMobile = () => {
    const t = this;
    this.setState({
      previewMobile: true
    })
  };

  // 生成json代码
  createJSON = () => {
    const t = this;
    this.setState({
      previewJson: true
    })
  };

  // 撤销/恢复
  onRevoke = () => {
    const t = this;
    let {formHistory, formConfig, _formHistoryIndex} = t.state;
    if (_formHistoryIndex < 1) {
      formConfig.list = [];
      this.setState({_formHistoryIndex: -1, formConfig, activeWidget: {}});
      return
    }

    _formHistoryIndex = _formHistoryIndex - 1;
    if (formHistory[_formHistoryIndex]) {
      let formHistoryItem = formHistory[_formHistoryIndex];
      formConfig.list = JSON.parse(JSON.stringify(formHistoryItem.formConfig.list));
      this.setState({_formHistoryIndex, formConfig, activeWidget: formHistoryItem.activeWidget});
    }
  };

  // 撤销/恢复
  onRecovery = () => {
    const t = this;
    let {formHistory, formConfig, _formHistoryIndex} = t.state;

    _formHistoryIndex = _formHistoryIndex + 1;
    if (formHistory[_formHistoryIndex]) {
      let formHistoryItem = formHistory[_formHistoryIndex];
      formConfig.list = JSON.parse(JSON.stringify(formHistoryItem.formConfig.list));
      this.setState({_formHistoryIndex, formConfig, activeWidget: formHistoryItem.activeWidget});
    }
  };

  // 渲染垃圾箱
  renderDustbin = (list, index, wrapKey, showHint) => {
    const t = this;
    return (
      <Dustbin
        index={index}
        wrapKey={wrapKey}
        accepts={['wrap']}
        onDrop={t.onDrop}>
        <div className="widget-form-container">
          {
            list && list.length ?
              <div className="widget-form-wrap">
                {t.renderFormItem(list)}
              </div>
              :
              (showHint && <div className="empty">从左侧拖拽或点击来添加字段</div>)
          }
        </div>
      </Dustbin>
    )
  };

  // 渲染单项
  renderFormItem = val => val.map((item, index) => {
    const t = this;
    let {formConfig} = t.state;
    let {form} = t.props;
    let {config = {}} = formConfig;
    const formItemLayout = config.layout === 'horizontal' ? {
      labelCol: {span: item.labelCol},
      wrapperCol: {span: item.wrapperCol}
    } : null;

    // 特殊渲染
    const extra = {
      "grid": t.renderGrid,
      "tabs": t.renderTabs,
    };
    if (extra[item.type]) {
      return (extra[item.type](item, index));
    }

    return (
      t.renderWidgetItem(item, index, (
        <div className="configItem"><FormItem data={item} form={form} formItemLayout={formItemLayout}/></div>
      ))
    )
  });

  // 渲染栅格
  renderGrid = (item, index) => {
    const t = this;
    let rowCon = {gutter: item.gutter};
    if (item.flex) {
      rowCon = {
        ...rowCon,
        type: "flex",
        gutter: item.gutter,
        justify: item.justify,
        align: item.align,
      }
    }
    return (
      <div className="widget-form-row" key={item.paramName}>
        {
          t.renderWidgetItem(item, index,
            <div className="widget-form-row-wrap">
              <Row {...rowCon}>
                {
                  item.columns && item.columns.length > 0 &&
                  item.columns.map((col, colIndex) => (
                    <Col span={col.span} key={item.key + "-" + colIndex}>
                      <div className="widget-form-col-wrap">
                        {t.renderDustbin(col.list, colIndex, item.key, false)}
                      </div>
                    </Col>
                  ))
                }
              </Row>
            </div>
          )
        }
      </div>
    )
  };

  // 渲染页签
  renderTabs = (item, index) => {
    const t = this;
    let tabCon = {
      animated: item.animated,
      tabBarGutter: item.tabBarGutter,
      tabPosition: item.tabPosition,
      type: item.tabType,
    };
    return (
      <div className="widget-form-row" key={item.paramName}>
        {
          t.renderWidgetItem(item, index,
            <div className="widget-form-row-wrap">
              <Tabs {...tabCon}>
                {
                  item.columns && item.columns.length > 0 &&
                  item.columns.map((col, colIndex) => (
                    <Tabs.TabPane tab={col.tab} key={item.key + "-" + colIndex}>
                      <div className="widget-form-col-wrap">
                        {t.renderDustbin(col.list, colIndex, item.key, false)}
                      </div>
                    </Tabs.TabPane>
                  ))
                }
              </Tabs>
            </div>
          )
        }
      </div>
    )
  };

  // 渲染垃圾
  renderWidgetItem = (item, index, content) => {
    const t = this;
    let {activeWidget = {}, isDown} = t.state;
    return (
      <Box
        key={item.key}
        index={index}
        // onMove={t.onMove}
        className={`widget-form-item ${activeWidget.paramName === item.paramName && "active"}`}
        formItem={item}
        onClick={t.widgetClick.bind(t, item, index)}
        type={(activeWidget.paramName === item.paramName && isDown) ? "wrap" : "noDrop"}
        isDropped={false}>
        {
          activeWidget.paramName === item.paramName &&
          <div>
            {/*<div*/}
            {/*className="item-icon-move"*/}
            {/*onMouseDown={() => this.setState({isDown: true})}*/}
            {/*onMouseUp={() => this.setState({isDown: false})}>*/}
            {/*<MyIcon type={"iconmove"}/>*/}
            {/*</div>*/}
            <div className="item-icon-btn">
              <MyIcon type={"iconfuzhi"} onClick={t.widgetCopy.bind(t, item, index)}/>
              <MyIcon type={"iconshanchu"} onClick={t.widgetDelete.bind(t, item, index)}/>
            </div>
          </div>
        }
        <div className="item-paramName-text">{item.paramName}</div>
        {content}
      </Box>
    )
  };

  // 控件点击
  widgetClick = (item, index, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    const t = this;
    t.setState({activeWidget: item})
  };

  // 复制操作
  widgetCopy = (item, index, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    const t = this;
    let key = t.createParamName(item);
    let newItem = {...(JSON.parse(JSON.stringify(item))), key, paramName: key};

    let {formConfig, activeWidget} = t.state;

    if (formConfig.list && formConfig.list.length && activeWidget && activeWidget.key) {
      const loopData = (data) => {
        data.map((i, I) => {
          if (i.key === activeWidget.key) {
            data.splice(I + 1, 0, newItem);
          } else if (i.columns && i.columns.length) {
            i.columns.map(c => {
              if (c.list && c.list.length) {
                loopData(c.list)
              }
            })
          }
        })
      };
      loopData(formConfig.list);
    } else {
      formConfig.list.push(newItem);
    }

    this.onHistory(formConfig, newItem);
  };

  // 删除操作
  widgetDelete = (item, index, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    const t = this;
    let {formConfig = {}} = t.state;

    let activeWidget = {};
    const loopData = (data) => {
      data.map((i, I) => {
        if (i.key === item.key) {
          data.splice(I, 1);
          if (index >= data.length - 1 || data.length === 1) {
            activeWidget = data[data.length - 1];
          } else {
            activeWidget = data[index];
          }
        } else if (i.columns && i.columns.length) {
          i.columns.map(c => {
            if (c.list && c.list.length) {
              loopData(c.list)
            }
          })
        }
      })
    };
    loopData(formConfig.list);

    this.onHistory(formConfig, activeWidget);
  };

  // 以下为右侧表单配置区

  // 渲染右侧
  renderRight = () => {
    const t = this;
    const {activeType} = t.state;
    const list = [
      {title: "字段属性", type: "field"},
      {title: "表单属性", type: "form"},
    ];
    return (
      <div className="IndexPage-Right">
        <div className="IndexPage-Right-Header">
          {
            list.map((item, index) => (
              <div key={index} className={`IndexPage-Right-Header-Item ${activeType === item.type && "active-item"}`}
                   onClick={() => t.setState({activeType: item.type})}>{item.title}</div>
            ))
          }
        </div>
        {activeType === "field" && t.renderWidgetConfig()}
        {activeType === "form" && t.renderFormConfig()}
      </div>
    )
  };

  // 渲染表单部件配置
  renderWidgetConfig = () => {
    const t = this;
    const {activeWidget} = t.state;
    let items = t.getWidgetConfigItems();
    return (
      <div className="IndexPage-Right-Content">
        {
          items && items.length > 0 ?
            <div style={{padding: 10}}>
              <BasicForm key={activeWidget.key} items={items} column={1}/>
            </div>
            :
            <div className="empty">请添加字段</div>
        }
      </div>
    )
  };

  // 更改配置
  onChangeConfig = (paramName, val) => {
    const t = this;
    let {formConfig, activeWidget} = t.state;

    const loopData = (data) => {
      data.map(i => {
        if (i.key === activeWidget.key) {
          i[paramName] = val;
        } else if (i.columns && i.columns.length) {
          i.columns.map(c => {
            if (c.list && c.list.length) {
              loopData(c.list)
            }
          })
        }
      })
    };
    loopData(formConfig.list);
    t.setState({
      formConfig,
    })
  };

  // 获取配置项
  getWidgetConfigItems = () => {
    const t = this;
    const {activeWidget} = t.state;

    let items = [];
    const extra = {
      "grid": t.renderGridConfig,
      "tabs": t.renderTabsConfig,
    };
    if (extra[activeWidget.type]) {
      items = extra[activeWidget.type]();
    } else {
      items = t.renderDefaultConfig();
    }

    items.map(item => {
      let {paramName, type, onChange, changeVal} = item;
      if (paramName) {
        item.onChange = (val) => {
          if (["input", "textArea", "radio"].includes(type)) {
            val = val.target.value;
          } else if (["checkBox"].includes(type)) {
            val = val.target.checked;
          }

          // 表单设置
          if (changeVal) {
            t.onChangeConfig(paramName, val)
          }

          onChange && onChange(val);
        }
      }
    });
    return items;
  };

  // 渲染栅格配置
  renderGridConfig = () => {
    const t = this;
    const {activeWidget} = t.state;
    let {columns, gutter, justify, align, flex} = activeWidget;
    const changeOption = (i, type, value) => {
      columns[i][type] = value;
      t.onChangeConfig("columns", columns);
    };

    const deleteOption = (i) => {
      columns.splice(i, 1);
      t.onChangeConfig("columns", columns);
    };

    const addOption = () => {
      columns.push({label: "新列", span: 12, list: []});
      t.onChangeConfig("columns", columns);
    };

    return [
      {type: 'inputNumber', label: '栅格间隔', paramName: 'gutter', initialValue: gutter, changeVal: true},
      {type: 'switch', label: '响应式布局', paramName: 'flex', initialValue: flex, changeVal: true},
      ...(flex ? [
        {
          type: 'select',
          label: '水平排列方式',
          paramName: 'justify',
          initialValue: justify,
          changeVal: true,
          options: [
            {text: "左对齐", value: "start"},
            {text: "右对齐", value: "end"},
            {text: "居中", value: "center"},
            {text: "两侧间隔相等", value: "space-around"},
            {text: "两端对齐", value: "space-between"},
          ],
        }, {
          type: 'select',
          label: '垂直排列方式',
          paramName: 'align',
          initialValue: align,
          changeVal: true,
          options: [
            {text: "顶部对齐", value: "top"},
            {text: "居中", value: "middle"},
            {text: "底部对齐", value: "bottom"},
          ],
        },
      ] : []),
      {
        type: "black",
        span: 24,
        text: <span>列配置<span style={{fontSize: 12, color: "#CCC"}}>(一行最大值为24,超过换行展示)</span></span>,
        content: (
          <div className="optionsConfig">
            <div className="configOptions">
              {
                columns && columns.length > 0 &&
                columns.map((o, i) => (
                  <div key={i} className="optionData">
                    <Input className="option" defaultValue={o.label} placeholder={"列名称"}
                           onChange={e => changeOption.bind(t, i, "label", e.target.value)}/>
                    <InputNumber max={24} min={0} className="option" defaultValue={o.span} placeholder={"列大小"}
                                 onChange={changeOption.bind(t, i, "span")}/>
                    <MyIcon type={"iconjianshao"} className="delOption" onClick={deleteOption.bind(t, i)}/>
                  </div>
                ))
              }
              <div className="addOption"><a onClick={addOption}>添加列</a></div>
            </div>
          </div>
        )
      }
    ];
  };

  // 渲染页签配置
  renderTabsConfig = () => {
    const t = this;
    const {activeWidget} = t.state;
    let {columns, tabType, tabPosition, tabBarGutter, animated} = activeWidget;
    const changeOption = (i, type, e) => {
      columns[i][type] = e.target.value;
      t.onChangeConfig("columns", columns);
    };

    const deleteOption = (i) => {
      columns.splice(i, 1);
      t.onChangeConfig("columns", columns);
    };

    const addOption = () => {
      columns.push({tab: "新页签", list: []});
      t.onChangeConfig("columns", columns);
    };
    return [
      {
        type: 'radio',
        label: '风格类型',
        paramName: 'tabType',
        buttonStyle: "solid",
        initialValue: tabType,
        changeVal: true,
        options: [
          {label: "默认", value: "line"},
          {label: "卡片化", value: "card"},
        ]
      },
      {
        type: 'radio',
        label: '页签位置',
        paramName: 'tabPosition',
        buttonStyle: "solid",
        initialValue: tabPosition,
        changeVal: true,
        options: [
          {label: "顶部", value: "top"},
          {label: "左侧", value: "left"},
          {label: "右侧", value: "right"},
          {label: "底部", value: "bottom"},
        ]
      },
      {
        type: 'inputNumber',
        label: '页签间距',
        paramName: 'tabBarGutter',
        initialValue: tabBarGutter,
        changeVal: true,
      },
      {
        type: 'switch',
        label: '标签切换动画',
        paramName: 'animated',
        initialValue: animated,
        changeVal: true,
      },
      {
        type: "black",
        span: 24,
        text: "标签配置",
        content: (
          <div className="optionsConfig">
            <div className="configOptions">
              {
                columns && columns.length > 0 &&
                columns.map((o, i) => (
                  <div key={i} className="optionData">
                    <Input className="option" defaultValue={o.tab} onChange={changeOption.bind(t, i, "tab")}/>
                    <MyIcon type={"iconjianshao"} className="delOption" onClick={deleteOption.bind(t, i)}/>
                  </div>
                ))
              }
              <div className="addOption"><a onClick={addOption}>添加标签</a></div>
            </div>
          </div>
        )
      }
    ]
  };

  // 渲染默认配置
  renderDefaultConfig = () => {
    const t = this;
    const {activeWidget} = t.state;
    let aV = Object.keys(activeWidget);
    let items = [];
    if (aV.includes("paramName")) {
      let initialValue = activeWidget.paramName;
      items.push({type: 'input', label: '字段标识', paramName: 'paramName', initialValue, changeVal: true});
    }

    if (aV.includes("label")) {
      let initialValue = activeWidget.label;
      items.push({type: 'input', label: '标题', paramName: 'label', initialValue, changeVal: true});
    }

    if (aV.includes("placeholder")) {
      let initialValue = activeWidget.placeholder;
      let type = activeWidget.type === 'textArea' ? 'textArea' : 'input';
      items.push({type, label: '占位内容', paramName: 'placeholder', initialValue, changeVal: true});
    }

    if (aV.includes("startPlaceholder")) {
      let initialValue = activeWidget.startPlaceholder;
      items.push({type: 'input', label: '开始占位内容', paramName: 'startPlaceholder', initialValue, changeVal: true});
    }

    if (aV.includes("endPlaceholder")) {
      let initialValue = activeWidget.endPlaceholder;
      items.push({type: 'input', label: '结束占位内容', paramName: 'endPlaceholder', initialValue, changeVal: true});
    }

    if (aV.includes("initialValue")) {
      let initialValue = activeWidget.initialValue;
      if (["input", "textArea", "inputNumber"].includes(activeWidget.type)) {
        items.push({type: 'input', label: '默认内容', paramName: 'initialValue', initialValue, changeVal: true});
      }

      if (["timePicker", "datePicker", "yearPicker", "monthPicker", "rangePicker"].includes(activeWidget.type)) {
        items.push({
          type: activeWidget.type,
          label: '默认' + activeWidget.label,
          paramName: 'initialValue',
          initialValue,
          changeVal: true
        });
      }
    }

    if (aV.includes("inline")) {
      let initialValue = activeWidget.inline;
      items.push({
        type: 'radio',
        label: '布局方式',
        paramName: 'inline',
        buttonStyle: "solid",
        initialValue,
        changeVal: true,
        options: [
          {label: "块级", value: "inline"},
          {label: "行内", value: "block"},
        ]
      })
    }

    if (aV.includes("labelCol")) {
      let initialValue = activeWidget.labelCol;
      items.push({type: 'inputNumber', label: '标签宽度', paramName: 'labelCol', initialValue, changeVal: true})
    }

    if (aV.includes("wrapperCol")) {
      let initialValue = activeWidget.wrapperCol;
      items.push({type: 'inputNumber', label: '控件宽度', paramName: 'wrapperCol', initialValue, changeVal: true})
    }

    if (aV.includes("showSearch")) {
      let initialValue = activeWidget.showSearch;
      items.push({type: 'switch', label: '是否可搜索', paramName: 'showSearch', initialValue, changeVal: true})
    }

    if (aV.includes("multiple")) {
      let initialValue = activeWidget.multiple;
      items.push({type: 'switch', label: '是否多选', paramName: 'multiple', initialValue, changeVal: true})
    }

    if (aV.includes("upMaxLength")) {
      let initialValue = activeWidget.upMaxLength;
      items.push({type: 'inputNumber', label: '最大上传数量', paramName: 'upMaxLength', initialValue, changeVal: true})
    }

    if (aV.includes("action")) {
      let initialValue = activeWidget.action;
      items.push({type: 'input', label: '上传地址', paramName: 'action', initialValue, changeVal: true})
    }

    if (aV.includes("name")) {
      let initialValue = activeWidget.name;
      items.push({type: 'input', label: '发到后台的文件参数名', paramName: 'name', initialValue, changeVal: true})
    }

    if (aV.includes("mode")) {
      let initialValue = activeWidget.mode;
      items.push({
        type: 'radio',
        label: '下拉模式',
        paramName: 'mode',
        buttonStyle: "solid",
        initialValue,
        changeVal: true,
        options: [
          {label: "单选", value: ""},
          {label: "多选", value: "multiple"},
        ]
      })
    }

    if (aV.includes("options")) {
      let {initialValue, dataType, options, remoteUrl, remoteValue, remoteLabel} = activeWidget;
      const changeOption = (i, type, e) => {
        options[i][type] = e.target.value;
        t.onChangeConfig("options", options);
      };

      const deleteOption = (i) => {
        options.splice(i, 1);
        t.onChangeConfig("options", options);
      };

      const addOption = () => {
        options.push({label: "新选项", value: "新选项"});
        t.onChangeConfig("options", options);
      };

      const typeList = [
        {label: "静态数据", value: "static"},
        {label: "动态数据", value: "remote"},
      ];

      let item = {
        type: "black",
        span: 24,
        text: "选项",
        content: (
          <div className="optionsConfig">
            <Radio.Group buttonStyle="solid" onChange={e => t.onChangeConfig("dataType", e.target.value)}
                         defaultValue={dataType}>
              {
                typeList.map((o, i) => (
                  <Radio.Button value={o.value} key={i}>{o.label}</Radio.Button>
                ))
              }
            </Radio.Group>

            {
              dataType === "static" &&
              <div className="configOptions">
                {
                  (activeWidget.type === "checkbox" || activeWidget.mode === "multiple") ?
                    <Checkbox.Group onChange={t.onChangeConfig.bind(t, "initialValue")} defaultValue={initialValue}>
                      {
                        options && options.length > 0 &&
                        options.map((o, i) => (
                          <div key={i + "-" + o.value} className="optionData">
                            <Checkbox value={o.value} style={{marginRight: 8}}/>
                            <Input className="option" defaultValue={o.label}
                                   onChange={changeOption.bind(t, i, "label")}/>
                            <Input className="option" defaultValue={o.value}
                                   onChange={changeOption.bind(t, i, "value")}/>
                            <MyIcon type={"iconjianshao"} className="delOption" onClick={deleteOption.bind(t, i)}/>
                          </div>
                        ))
                      }
                    </Checkbox.Group>
                    :
                    <Radio.Group onChange={e => t.onChangeConfig("initialValue", e.target.value)}
                                 defaultValue={initialValue}>
                      {
                        options && options.length > 0 &&
                        options.map((o, i) => (
                          <div key={i + "-" + o.value} className="optionData">
                            <Radio value={o.value}/>
                            <Input className="option" defaultValue={o.label}
                                   onChange={changeOption.bind(t, i, "label")}/>
                            <Input className="option" defaultValue={o.value}
                                   onChange={changeOption.bind(t, i, "value")}/>
                            <MyIcon type={"iconjianshao"} className="delOption" onClick={deleteOption.bind(t, i)}/>
                          </div>
                        ))
                      }
                    </Radio.Group>
                }

                <div className="addOption"><a onClick={addOption}>添加选项</a></div>
              </div>
            }

            {
              dataType === "remote" &&
              <div className="configRemote">
                <Input className="remoteItem" defaultValue={remoteUrl} placeholder={"请输入接口地址"}
                       onChange={e => t.onChangeConfig("remoteUrl", e.target.value)}/>
                <Input className="remoteItem" defaultValue={remoteValue} addonBefore={"值"}
                       onChange={e => t.onChangeConfig("remoteValue", e.target.value)}/>
                <Input className="remoteItem" defaultValue={remoteLabel} addonBefore={"标签"}
                       onChange={e => t.onChangeConfig("remoteLabel", e.target.value)}/>
              </div>
            }
          </div>
        )
      };
      items.push(item);
    }

    if (aV.includes("disabled")) {
      let initialValue = activeWidget.disabled;
      items.push({type: 'checkBox', label: '是否禁用', paramName: 'disabled', initialValue});
    }

    if (aV.includes("rules")) {
      let {rules} = activeWidget;

      const changeOption = (i, type, value) => {
        rules[i][type] = value;
        t.onChangeConfig("rules", rules);
      };

      items.push({
        type: 'black',
        text: '校验',
        span: 24,
        content: (
          <div className="optionsConfig">
            {
              rules && rules.length > 0 &&
              <div className="configOptions">
                {
                  rules[0] &&
                  <div className="optionData">
                    <Checkbox defaultChecked={rules[0].required}
                              onChange={e => changeOption(0, "required", e.target.checked)}>必填</Checkbox>
                    {
                      rules[0].required &&
                      <Input className="optionMessage" defaultValue={rules[0].message} placeholder={"自定义提示"}
                             onChange={e => changeOption(0, "message", e.target.value)}/>

                    }
                  </div>
                }
              </div>
            }
          </div>
        )
      });
    }

    return items;
  };

  // 渲染表单属性配置
  renderFormConfig = () => {
    const t = this;
    let {config = {}} = t.state.formConfig;
    const onFormChange = (type, val) => {
      let {formConfig} = t.state;
      formConfig.config[type] = val;
      this.setState({
        formConfig: formConfig
      })
    };
    const items = [
      {
        type: 'radio',
        label: '表单布局方式',
        paramName: 'formLayout',
        buttonStyle: "solid",
        initialValue: config.layout,
        onChange: e => onFormChange("layout", e.target.value),
        options: [
          {label: "水平", value: "horizontal"},
          {label: "垂直", value: "vertical"},
        ]
      }, {
        type: 'radio',
        label: '标签对齐方式',
        paramName: 'labelLayout',
        buttonStyle: "solid",
        initialValue: config.labelAlign,
        onChange: e => onFormChange("labelAlign", e.target.value),
        options: [
          {label: "左对齐", value: "left"},
          {label: "右对齐", value: "right"},
        ]
      }, {
        type: 'inputNumber',
        label: '标签默认宽度',
        paramName: 'labelCol',
        initialValue: config.labelCol,
        max: 24,
        onChange: val => {
          let {formConfig} = t.state;
          formConfig.config.labelCol = val;
          formConfig.config.wrapperCol = 24 - val;
          this.setState({
            formConfig: formConfig
          })
        }
      }, {
        type: 'checkBox',
        label: '显示冒号',
        paramName: 'colon',
        initialValue: config.colon,
        onChange: e => onFormChange("colon", e.target.checked),
      }, {
        type: 'checkBox',
        label: '隐藏必填符号',
        paramName: 'hideRequiredMark',
        initialValue: config.hideRequiredMark,
        onChange: e => onFormChange("hideRequiredMark", e.target.checked),
      }
    ];

    return (
      <div style={{padding: 10}}>
        <BasicForm items={items} column={1}/>
      </div>
    )
  };

  // 以下位模态框

  // 模态框保存
  onModalSave = () => {
    const t = this;
    let {validateFields} = t.modalForm.props.form;
    validateFields((err, val) => {
      if (!err) {
        this.setState({
          previewFormData: true,
          formData: val
        });
      }
    })
  };

  // 模态框重置
  onModalReset = () => {
    const t = this;
    let {resetFields} = t.modalForm.props.form;
    resetFields();
  };

  // 渲染预览页面
  renderPreview = () => {
    const t = this;
    const {preview, formConfig} = t.state;
    if (preview) {
      return (
        <MyModal
          title={"预览"}
          visible={preview}
          width={1000}
          footerShow={true}
          footerTitle={"获取数据"}
          onModalSave={t.onModalSave}
          returnBtn={true}
          returnTitle={"重置"}
          returnBack={t.onModalReset}
          onCancel={() => t.setState({preview: false})}>
          <WidgetForm formConfig={formConfig} wrappedComponentRef={form => t.modalForm = form}/>
        </MyModal>
      )
    }
  };

  // 渲染移动端页面
  renderMobilePreview = () => {
    const t = this;
    const {previewMobile, formConfig} = t.state;
    if (previewMobile) {
      return (
        <MyModal
          width={400}
          visible={previewMobile}
          onCancel={() => t.setState({previewMobile: false})}
          className="mobileModalWrap">
          <MobileWidgetForm formConfig={formConfig}/>
        </MyModal>
      )
    }
  };

  // 渲染表单数据json
  renderModalFormData = () => {
    const t = this;
    const {previewFormData, formData} = t.state;
    if (previewFormData) {
      return (
        <MyModal
          title={"生成JSON"}
          visible={previewFormData}
          width={1000}
          onCancel={() => t.setState({previewFormData: false})}>
          <ReactJson src={formData}/>
        </MyModal>
      )
    }
  };

  // 渲染json配置页面
  renderPreviewJSON = () => {
    const t = this;
    const {previewJson, formConfig} = t.state;
    if (previewJson) {
      return (
        <MyModal
          title={"生成JSON"}
          visible={previewJson}
          width={1000}
          onCancel={() => t.setState({previewJson: false})}>
          <ReactJson src={formConfig}/>
        </MyModal>
      )
    }
  };

  render() {
    const t = this;
    return (
      <div className="IndexPage-Container">
        {t.renderLeft()}
        {t.renderCenter()}
        {t.renderRight()}

        {t.renderPreview()}
        {t.renderMobilePreview()}
        {t.renderPreviewJSON()}
        {t.renderModalFormData()}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Form.create()(IndexPage));
