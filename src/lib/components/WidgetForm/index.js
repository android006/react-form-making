/**
 * Created by GYL on Description: 表单控件
 */
import React, {Component} from 'react';
import {Row, Col, Form, Tabs} from 'antd';
import FormItem from "./FormItem";

class WidgetForm extends Component {
  static defaultProps = {
    formConfig: {}
  };

  state = {
    formConfig: this.props.formConfig
  };

  componentDidMount() {
    const t = this;
  };

  // 渲染单项
  renderFormItem = val => val.map((item, index) => {
    const t = this;
    let {formConfig} = t.state;
    let {form} = t.props;
    let {config = {}} = formConfig;
    const formItemLayout =
      config.layout === 'horizontal'
        ? {
          labelCol: {span: item.labelCol},
          wrapperCol: {span: item.wrapperCol},
        }
        : null;

    // 特殊渲染
    const extra = {
      "grid": t.renderGrid,
      "tabs": t.renderTabs,
    };
    if (extra[item.type]) {
      return (extra[item.type](item, index));
    }

    return (
      <FormItem key={item.paramName} data={item} form={form} formItemLayout={formItemLayout}/>
    )
  });

  // 渲染栅格
  renderGrid = (item, index) => {
    const t = this;
    let rowCon = {key: item.paramName + "_" + index, gutter: item.gutter};
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
      <Row {...rowCon}>
        {
          item.columns && item.columns.length > 0 &&
          item.columns.map((col, colIndex) => (
            <Col span={col.span} key={item.key + "-" + colIndex}>
              <div>
                {t.renderFormItem(col.list)}
              </div>
            </Col>
          ))
        }
      </Row>
    )
  };

  // 渲染页签
  renderTabs = (item, index) => {
    const t = this;
    let tabCon = {
      key: item.paramName + "_" + index,
      animated: item.animated,
      tabBarGutter: item.tabBarGutter,
      tabPosition: item.tabPosition,
      type: item.tabType,
    };
    return (
      <Tabs {...tabCon}>
        {
          item.columns && item.columns.length > 0 &&
          item.columns.map((col, colIndex) => (
            <Tabs.TabPane tab={col.tab} key={item.key + "-" + colIndex} forceRender={true}>
              <div>
                {t.renderFormItem(col.list)}
              </div>
            </Tabs.TabPane>
          ))
        }
      </Tabs>
    )
  };

  render() {
    const t = this;
    const {formConfig} = t.state;
    let {config = {}, list = []} = formConfig;
    return (
      <Form {...config}>
        {
          list && list.length > 0 &&
          t.renderFormItem(list)
        }
      </Form>
    )
  }
}

export default Form.create()(WidgetForm);
