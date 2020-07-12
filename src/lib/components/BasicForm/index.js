/**
 * Created by GYL on 2018/8/14
 */
import React, {Component} from 'react';
import {
  Form, Row, Col, Divider, Button, Select, Input, Checkbox, DatePicker, Typography, TreeSelect,
  Radio, Upload, Icon, InputNumber, message, Modal, Switch, TimePicker
} from 'antd';
import moment from "moment";
import MyCollapse from "../MyCollapse";
import ModalPictureGallery from "../ModalPictureGallery";
import PublicService from "../../../services/PublicService";
import './index.less';
import request from "../../../utils/request";
import config from "../../../config";

const {RangePicker, MonthPicker, WeekPicker} = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Paragraph} = Typography;

class BasicForm extends Component {
  state = {
    modalPictureVisible: false,
    upList: [],
    currentIndex: 0,

    previewUrl: null,
    previewVisible: false,

    treeExpandedKeys: []
  };

  componentDidMount() {
    const t = this;
    t.autoClick();
  }

  // 针对树下拉选初始化点击标题无法展开的问题
  autoClick = () => {
    const t = this;
    const {items = []} = t.props;
    let I = items.findIndex(item => item.type === "treeSelect");
    if (I !== -1) {
      t.THMER = window.setInterval(() => {
        let TREE_NODE = document.getElementById("TREE_NODE");
        if (TREE_NODE) {
          TREE_NODE.click();
          TREE_NODE.click();
          window.clearInterval(t.THMER);
        }
      }, 500)
    }
  };

  componentWillUnmount() {
    const t = this;
    window.clearInterval(t.THMER);
  };

  // 渲染年
  renderYearPicker = (item, disabled) => {
    const {openPicker} = this.state;
    const onOpenChange = (status) => {
      this.setState({
        openPicker: status
      });
    };

    const onDateChange = (type, value) => {
      const {setFieldsValue} = this.props.form;
      setFieldsValue({
        [type]: moment(value)
      }, () => {
        this.setState({
          openPicker: false
        });
        item.onChange && item.onChange(value)
      })
    };

    return (
      <DatePicker
        mode={"year"}
        onOpenChange={onOpenChange}
        open={openPicker}
        onPanelChange={value => onDateChange(item.paramName, value)}
        format="YYYY"
        placeholder={item.placeholder || '请选择'}
        disabled={item.disabled || disabled}/>
    )
  };

  // 上传按钮渲染
  upBtnRender = (item) => {
    const t = this;
    let {disabled} = t.props;
    let {upText, bindPicHide, accept} = item;
    let acc = '.png, .jpg, .jpeg';
    if (accept) {
      acc = accept === "all" ? "" : accept;
    }
    const props = {
      name: 'multipartFile',
      action: '/zuul/dfs/file/upload?curPath=/xihu',
      accept: acc,
      showUploadList: false,
      headers: {'token': `${PublicService.getCookie('token')}`},
      multiple: true,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
      onSuccess(info) {
        t.uploading && t.uploading();
        if (info.rc === 0) {
          if (item.onSuccess) {
            item.onSuccess(info.ret)
          }
          message.success('文件上传成功', 1);
        } else {
          message.error(info.err);
        }
      }
    };
    return (
      <div onClick={e => e.stopPropagation()}>
        {
          (item.show || !(disabled || item.disabled)) &&
          <span style={{fontSize: 14, paddingLeft: 10}}>
            <Upload {...props}>
              <Button type="primary" size="small"><span><Icon type="upload"/> {upText || "上传"}</span></Button>
            </Upload>
            {
              !bindPicHide &&
              [
                <Divider key={"a"} type="vertical"/>,
                <a key={"b"} onClick={item.onBindPicture} className='binding-pictures'>
                  <i className="iconfont icon-bangding"/> 绑定图片
                </a>
              ]
            }
          </span>
        }
      </div>
    )
  };

  // 上传列表渲染
  upListRender = (val) => {
    let t = this;
    let {disabled} = t.props;
    let {upList, dataSource, columns, col, loading} = val;
    return (
      <div>
        {
          upList && upList.length > 0 &&
          <Row gutter={12}>
            {
              upList.map((item, index) => (
                <Col span={col || 2} key={index}>
                  <div className='myUpList'>
                    <div className='mask'>
                      <i className='iconfont icon-fangda2' onClick={t.handlePreview.bind(t, upList, index)}/>
                      {
                        !(val.disabled || item.disabled || disabled) &&
                        <i className='iconfont icon-delete t-PL16' onClick={val.onDelete.bind(t, index)}/>
                      }
                    </div>
                    <img src={item.url || item.picUrl || item.picurl || item.fullUrl} alt="图片"/>
                  </div>
                  <Paragraph ellipsis style={{textAlign: 'center'}} title={item.fileName}>
                    {item.fileName}
                  </Paragraph>
                </Col>
              ))
            }
          </Row>
        }
        {
          columns && columns.length > 0 &&
          <div style={{marginTop: 2}}>
            <MyTable
              loading={loading}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        }
      </div>
    )
  };

  // 图片模态框展示
  handlePreview = (upList, index) => {
    let list = [];
    upList.map(item => {
      if (typeof item === 'string') {
        list.push(item)
      } else {
        list.push(item.url || item.picUrl || item.picurl || item.fullUrl)
      }
    });
    this.setState({
      upList: list,
      currentIndex: index,
      modalPictureVisible: true,
    });
  };

  // 模态框关闭
  handleCancel = () => {
    this.setState({
      modalPictureVisible: false
    })
  };

  // 下载
  onDownload = (url) => {
    window.open(url);
  };

  // 打开附件预览
  onOpenPreview = (item) => {
    let {url, picurl, picUrl, fileUrl, suffix} = item;
    suffix = suffix ? `.${suffix.toLowerCase()}` : "";
    url = url || picurl || fileUrl || picUrl;
    request({url: config.publicUrl2 + '/file/onlinePreview', method: 'GET', params: {url: url + suffix}}).then(res => {
      if (res.code) {
        this.setState({
          previewVisible: true,
          previewUrl: res.data
        })
      }
    })
  };

  // 递归循环树节点
  loop = (data, first) => data.map((item) => {
    const t = this;
    let {title, disabled} = item;
    if (disabled) {
      title = <span onClick={t.onTreeNodeClick.bind(t, item)} id={first && "TREE_NODE"}>{title}</span>;
    }

    if (item.children) {
      return (
        <TreeSelect.TreeNode dataRef={item} {...item} title={title}>
          {this.loop(item.children)}
        </TreeSelect.TreeNode>
      );
    }
    return <TreeSelect.TreeNode dataRef={item} {...item} title={title}/>;
  });

  // 树节点点击
  onTreeNodeClick = (item) => {
    const t = this;
    let {key} = item;
    if (key) {
      let {treeExpandedKeys = []} = t.state;
      if (treeExpandedKeys.length) {
        let I = treeExpandedKeys.findIndex(item => item === key);
        if (I === -1) {
          treeExpandedKeys.push(key);
        } else {
          treeExpandedKeys = treeExpandedKeys.filter(item => item !== key);
        }
      } else {
        treeExpandedKeys.push(key);
      }

      t.onTreeExpand(treeExpandedKeys)
    }
  };

  // 展开
  onTreeExpand = (treeExpandedKeys) => {
    this.setState({
      treeExpandedKeys
    })
  };

  render() {
    let t = this;
    const {modalPictureVisible, upList, currentIndex, previewUrl, previewVisible, treeExpandedKeys} = this.state;
    const {items, column, disabled, cockpit} = t.props;
    const WIDTH = document.body.clientWidth;
    let col = column ? 24 / column : 12;
    let {getFieldDecorator} = t.props.form;
    return (
      <Form className={`basicForm ${cockpit && "cockpit"}`} layout={"vertical"}>
        <Row gutter={12}>
          {
            items.map((item, index) => {
              if (item.type === 'black') {
                return (
                  <Col key={index} span={item.span || 8} offset={item.offset} style={item.style}
                       className={item.className}>
                    {
                      item.text &&
                      <div style={{paddingTop: 9, color: 'rgba(0,0,0,0.85)', fontSize: 14}}
                           className={item.rules ? 'rules' : null}>{item.text}</div>
                    }
                    {item.content}
                  </Col>
                )
              } else if (item.type === 'title') {
                return (
                  <Col key={index} span={24}>
                    <div className='wp-tab basic-wp-tab'>
                      {
                        item.content &&
                        <div className='basic-wp-tab-header'>
                          <div>{item.content}</div>
                        </div>
                      }
                      <div className='wp-tab-header'>
                        <div>{item.upText}</div>
                      </div>
                      {
                        item.upShow && [
                          item.describe && <div key="a" style={{opacity: 0.6}}>{item.describe}</div>,
                          <div key="b">
                            <Upload
                              name={'multipartFile'}
                              headers={{'token': `${PublicService.getCookie('token')}`}}
                              action={'/zuul/dfs/file/upload?curPath=/xihu'}
                              showUploadList={false}
                              onSuccess={item.onSuccess}
                              beforeUpload={item.beforeUpload}
                              accept={item.accept}
                              disabled={item.disabled || disabled}>
                              <Button
                                loading={item.loading}
                                type="primary"
                                size="small"
                                disabled={item.disabled || disabled}>
                                {
                                  item.loading ?
                                    <span>上传中</span>
                                    :
                                    <span><Icon type="upload"/> 上传</span>
                                }
                              </Button>
                            </Upload>
                          </div>
                        ]
                      }
                    </div>
                  </Col>
                )
              } else if (item.type === 'list') {
                return (
                  <Col key={index} span={24}>
                    {
                      item.upList && item.upList.length > 0 &&
                      item.upList.map((option, subIndex) => (
                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}
                             key={subIndex}>
                          <div style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }} title={option.fileName}>{option.fileName}</div>
                          <div style={{
                            textAlign: 'center',
                            flex: 1,
                          }}>{option.createTime && moment(option.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                          <div style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
                            {
                              option.url &&
                              <div>
                                <a onClick={t.onDownload.bind(t, option.url)} target="_blank">下载</a>
                              </div>
                            }

                            {
                              (!item.disabled || disabled) ?
                                <div style={{marginLeft: 14}}><a onClick={item.onDelete.bind(t, subIndex)}>删除</a></div>
                                :
                                <div style={{marginLeft: 14}}><a onClick={t.onOpenPreview.bind(t, option)}>查看</a></div>
                            }
                          </div>
                        </div>
                      ))
                    }
                  </Col>
                )
              } else if (item.type === 'treeSelect') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset} style={item.colStyle}>
                    <FormItem key={item.paramName} label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || []
                        })(
                          <TreeSelect
                            onTreeExpand={t.onTreeExpand}
                            treeExpandedKeys={treeExpandedKeys}
                            multiple={item.mode === "multiple"}
                            dropdownStyle={{maxHeight: 450}}
                            onChange={item.onChange}
                            disabled={item.disabled}
                            treeCheckable={item.treeCheckable}
                            onSelect={item.onSelect}
                            showSearch={item.showSearch || false}
                            treeNodeFilterProp={item.treeNodeFilterProp || 'title'}
                            treeNodeLabelProp={item.treeNodeLabelProp || 'title'}
                          >
                            {
                              item.options && item.options.length > 0 &&
                              this.loop(item.options, true)
                            }
                          </TreeSelect>
                        )}
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'timePicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          <TimePicker
                            hideDisabledOptions={true} // 将不可选的选项隐藏
                            disabledHours={item.disabledHours}
                            placeholder={item.placeholder || '请选择'}
                            minuteStep={item.minuteStep}
                            onChange={item.onChange}
                            format={item.format || "HH:mm:ss"}
                            disabled={item.disabled || disabled}/>
                        )
                      }
                    </FormItem>
                  </Col>)
              }else if (item.type === 'datePicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          <DatePicker
                            allowClear={item.allowClear}
                            placeholder={item.placeholder || (item.disabled ? "" : '请选择')}
                            onChange={item.onChange}
                            showTime={item.showTime}
                            format={item.format}
                            disabledDate={item.disabledDate}
                            disabled={item.disabled}
                            style={{width: '100%'}}/>
                        )
                      }
                    </FormItem>
                  </Col>)
              } else if (item.type === 'monthPicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          <MonthPicker
                            allowClear={item.allowClear}
                            placeholder={item.placeholder || (item.disabled ? "" : '请选择')}
                            onChange={item.onChange}
                            showTime={item.showTime}
                            format={item.format}
                            disabledDate={item.disabledDate}
                            disabled={item.disabled}
                            style={{width: '100%'}}
                          />
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'yearPicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          t.renderYearPicker(item, disabled)
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'weekPicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          <WeekPicker
                            allowClear={item.allowClear}
                            placeholder={item.placeholder || (item.disabled ? "" : '请选择')}
                            onChange={item.onChange}
                            showTime={item.showTime}
                            format={item.format}
                            disabledDate={item.disabledDate}
                            disabled={item.disabled}
                            style={{width: '100%'}}
                          />
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'rangePicker') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem label={item.label} key={index}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || null,
                        })(
                          <RangePicker
                            allowClear={item.allowClear}
                            showTime={item.showTime}
                            style={{width: item.width}}
                            format={item.format}
                            onChange={item.onChange}
                            disabledDate={item.disabledDate}
                            disabled={item.disabled || disabled}
                            ranges={item.ranges}
                          />
                        )
                      }
                    </FormItem>
                  </Col>)
              } else if (item.type === 'input') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue || "",
                          rules: item.rules,
                        })(
                          <Input
                            style={item.inputStyle || {}}
                            title={item.initialValue}
                            placeholder={item.placeholder || ((item.disabled || disabled) ? "" : ('请输入' + item.label))}
                            disabled={item.disabled || disabled}
                            addonAfter={item.text}
                            onBlur={item.onBlur}
                            onChange={item.onChange}/>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'inputNumber') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset} style={item.style}
                       className={item.className}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue || "",
                          rules: item.rules || [],
                        })(
                          <InputNumber
                            style={{width: "100%"}}
                            step={item.step || 1}
                            max={item.max || 10000}
                            min={item.min || 0}
                            formatter={item.formatter}
                            parser={item.parser}
                            placeholder={item.placeholder || '请输入'}
                            disabled={item.disabled || disabled}
                            onChange={item.onChange}/>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'textArea') {
                return (
                  <Col key={index} span={item.span || 24} style={{marginBottom: 10, ...item.style}}
                       offset={item.offset}>
                    <FormItem className={'myTextArea'} label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue || "",
                          rules: item.rules,
                        })(
                          <TextArea
                            onChange={item.onChange}
                            title={item.initialValue}
                            placeholder={item.placeholder || ((item.disabled || disabled) && '请输入')}
                            disabled={item.disabled || disabled}
                            autoSize={{minRows: 2, maxRows: 2}}/>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'select') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem key={item.paramName} label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || [],
                        })(
                          <Select
                            showSearch
                            className={item.className}
                            optionFilterProp="children"
                            disabled={item.disabled || disabled}
                            mode={item.mode}
                            onChange={item.onChange}
                            onSearch={item.onSearch}
                            placeholder={item.placeholder || (item.disabled ? "" : '请选择')}>
                            {
                              item.options && item.options.length > 0 &&
                              item.options.map(option => (
                                  <Select.Option key={option.value} value={option.value}>
                                    {option.text}
                                  </Select.Option>
                                )
                              )}
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'checkBox') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                    <FormItem style={{height: 40}}>
                      {
                        getFieldDecorator(item.paramName, {
                          valuePropName: 'checked',
                          initialValue: item.initialValue || false,
                          rules: item.rules || [],
                        })(
                          <Checkbox
                            onChange={item.onChange}
                            indeterminate={item.indeterminate}
                            disabled={item.disabled || disabled}>
                            {item.label}
                          </Checkbox>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'switch') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                    <FormItem label={item.label}>
                      {
                        getFieldDecorator(item.paramName, {
                          valuePropName: 'checked',
                          initialValue: item.initialValue || false,
                          rules: item.rules || [],
                        })(
                          <Switch
                            onChange={item.onChange}
                            disabled={item.disabled || disabled}/>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'radio') {
                return (
                  <Col key={index} span={item.span || col} offset={item.offset}>
                    <FormItem className={item.className} label={item.label} colon={item.colon}>
                      {
                        getFieldDecorator(item.paramName, {
                          initialValue: item.initialValue,
                          rules: item.rules || [],
                        })(
                          <RadioGroup
                            buttonStyle={item.buttonStyle}
                            onChange={item.onChange}
                            disabled={item.disabled || disabled}>
                            {
                              item.options && item.options.length > 0 &&
                              (
                                item.buttonStyle === "solid" ?
                                  item.options.map(option => (
                                      <Radio.Button key={option.value} value={option.value}>
                                        {option.label}
                                      </Radio.Button>
                                    )
                                  )
                                  :
                                  item.options.map(option => (
                                      <Radio key={option.value} value={option.value}>
                                        {option.label}
                                      </Radio>
                                    )
                                  )
                              )

                            }
                          </RadioGroup>
                        )
                      }
                    </FormItem>
                  </Col>
                )
              } else if (item.type === 'imgCollapse') {
                return (
                  <Col span={item.span || 24} key={index} offset={item.offset} style={{...item.style}}>
                    <MyCollapse
                      size={"small"}
                      style={{...item.style}}
                      title={item.label}
                      content={t.upBtnRender(item)}
                      titleStyle={item.collapseShow === false ? {
                        flex: 1,
                        justifyContent: "space-between",
                        padding: "4px 0"
                      } : {}}
                      Btn={item.Btn}
                      collapseShow={item.collapseShow}>
                      {t.upListRender(item)}
                    </MyCollapse>
                  </Col>
                )
              }
            })
          }
        </Row>
        {
          modalPictureVisible &&
          <ModalPictureGallery
            width={WIDTH > 1500 ? 1600 : 1000}
            visible={modalPictureVisible}
            pictrues={upList}
            currentIndex={currentIndex}
            onCancel={this.handleCancel}/>
        }

        {
          previewVisible &&
          <Modal
            className='gyl-modal'
            width={WIDTH > 1500 ? 1600 : 1000}
            visible={previewVisible}
            footer={null}
            centered
            onCancel={() => {
              this.setState({
                previewUrl: null,
                previewVisible: false,
              })
            }}>
            <div style={{width: '100%', height: WIDTH > 1500 ? 800 : 700, background: '#F1F1F1'}}>
              <iframe
                src={previewUrl}
                width="100%"
                height="100%"
                frameBorder="0"/>
            </div>
          </Modal>
        }
      </Form>
    )
  }
}

export default Form.create()(BasicForm);

