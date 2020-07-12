/**
 * Created by GYL on 2018/7/27
 */
import React, {Component} from 'react';
import {Tabs, List} from 'antd-mobile';
import {createForm} from 'rc-form';
import FormItem from "./FormItem";

class MobileWidgetForm extends Component {
  static defaultProps = {
    formConfig: {}
  };

  state = {
    formConfig: this.props.formConfig
  };

  componentDidMount() {

  };

  // 渲染单项
  renderFormItem = val => val.map((item, index) => {
    const t = this;
    let {form} = t.props;

    // 特殊渲染
    const extra = {
      "grid": t.renderGrid,
      "tabs": t.renderTabs,
    };
    if (extra[item.type]) {
      return (extra[item.type](item, index));
    }

    return (
      <FormItem key={item.paramName} data={item} form={form}/>
    )
  });

  // 渲染栅格
  renderGrid = (item, index) => {
    const t = this;
    let rowCon = {key: item.paramName + "_" + index};
    return (
      <div {...rowCon}>
        {
          item.columns && item.columns.length > 0 &&
          item.columns.map((col, colIndex) => (
            <List renderHeader={col.label} key={item.key + "-" + colIndex}>
              <div>
                {t.renderFormItem(col.list)}
              </div>
            </List>
          ))
        }
      </div>
    )
  };

  // 渲染页签
  renderTabs = (item, index) => {
    const t = this;
    let {columns = []} = item;
    let tabs = [];
    columns.map((c, i) => {
      tabs.push({title: c.tab, key: i})
    });

    let tabCon = {
      key: item.paramName,
      animated: item.animated,
      tabBarGutter: item.tabBarGutter,
      tabBarPosition: item.tabPosition,
      tabs
    };
    return (
      <Tabs {...tabCon}>
        {
          item.columns && item.columns.length > 0 &&
          item.columns.map((col, colIndex) => (
            <div key={colIndex}>
              {t.renderFormItem(col.list)}
            </div>
          ))
        }
      </Tabs>
    )
  };

  render() {
    const t = this;
    const {formConfig} = t.state;
    let {list = []} = formConfig;
    return (
      <List>
        {
          list && list.length > 0 &&
          t.renderFormItem(list)
        }
      </List>
    )
  }
}

export default createForm()(MobileWidgetForm);
