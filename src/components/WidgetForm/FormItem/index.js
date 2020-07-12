import React, {Component} from 'react';
import moment from "moment";
import {
  Form, Select, Input, DatePicker, TimePicker, Radio, TreeSelect, Checkbox, InputNumber, Upload, Button, Modal, Icon
} from 'antd';

class FormItem extends Component {
  state = {};

  // 渲染输入框
  renderInput = (item, disabled) => {
    return (
      <Input
        style={{width: '100%'}}
        placeholder={item.placeholder || '请输入'}
        disabled={item.disabled}
        addonAfter={item.text || disabled}
        onChange={item.onChange}/>
    )
  };

  // 渲染多行文本
  renderTextArea = (item, disabled) => {
    return (
      <Input.TextArea
        style={{width: "100%"}}
        onChange={item.onChange}
        placeholder={item.placeholder || '请输入'}
        disabled={item.disabled || disabled}
        autoSize={{minRows: item.minRows || 2, maxRows: item.maxRows || 2}}/>
    )
  };

  // 渲染数值框
  renderNumber = (item, disabled) => {
    return (
      <InputNumber
        step={item.step || 1}
        max={item.max || 10000}
        min={item.min || 0}
        formatter={item.formatter}
        parser={item.parser}
        placeholder={item.placeholder || '请输入'}
        disabled={item.disabled || disabled}
        onChange={item.onChange}/>
    )
  };

  // 渲染单选框
  renderRadio = (item, disabled) => {
    let {inline} = item;
    const radioStyle = {
      display: inline,
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Radio.Group
        style={{width: '100%'}}
        onChange={item.onChange}
        disabled={item.disabled || disabled}>
        {
          item.options && item.options.length > 0 &&
          item.options.map((o, i) => (
            <Radio style={{...radioStyle}} key={i + "-" + o.value} value={o.value}>{o.label}</Radio>
          ))
        }
      </Radio.Group>
    )
  };

  // 渲染多选框
  renderCheckBox = (item, disabled) => {
    let {inline} = item;
    const checkStyle = {
      display: inline,
      marginLeft: 0,
      marginRight: 8,
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Checkbox.Group
        style={{width: '100%'}}
        disabled={item.disabled || disabled}
        onChange={item.onChange}>
        {
          item.options && item.options.length > 0 &&
          item.options.map((o, i) => (
            <Checkbox style={{...checkStyle}} key={i + "-" + o.value} value={o.value}>{o.label}</Checkbox>
          ))
        }
      </Checkbox.Group>
    )
  };

  // 渲染时间
  renderTime = (item, disabled) => {
    let {hideDisabledOptions = true} = item;
    return (
      <TimePicker
        hideDisabledOptions={hideDisabledOptions} // 将不可选的选项隐藏
        disabledHours={item.disabledHours}
        placeholder={item.placeholder || '请选择'}
        minuteStep={item.minuteStep}
        onChange={item.onChange}
        format={item.format || "HH:mm"}
        disabled={item.disabled || disabled}/>
    )
  };

  // 渲染日期
  renderDatePicker = (item, disabled) => {
    return (
      <DatePicker
        allowClear={item.allowClear}
        onChange={item.onChange}
        showTime={item.showTime}
        format={item.format}
        disabledDate={item.disabledDate}
        placeholder={item.placeholder || '请选择'}
        disabled={item.disabled || disabled}/>
    )
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

  // 渲染月选择
  renderMonthPicker = (item, disabled) => {
    return (
      <DatePicker.MonthPicker
        allowClear={item.allowClear}
        onChange={item.onChange}
        placeholder={item.placeholder || '请选择'}
        disabled={item.disabled || disabled}/>
    )
  };

  // 渲染时间段
  renderRangePicker = (item, disabled) => {
    let {startPlaceholder, endPlaceholder} = item;
    return (
      <DatePicker.RangePicker
        showTime={item.showTime}
        format={item.format}
        onChange={item.onChange}
        placeholder={[startPlaceholder, endPlaceholder]}
        disabledDate={item.disabledDate}
        disabled={item.disabled || disabled}
        ranges={item.ranges}
      />
    )
  };

  // 渲染下拉选
  renderSelect = (item, disabled) => {
    return (
      <Select
        allowClear={item.allowClear}
        showSearch
        className={item.className}
        optionFilterProp="children"
        disabled={item.disabled || disabled}
        mode={item.mode}
        onChange={item.onChange}
        onSearch={item.onSearch}
        placeholder={item.placeholder || '请选择'}>
        {
          item.options && item.options.length > 0 &&
          item.options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            )
          )
        }
      </Select>
    )
  };

  // 渲染树下拉选
  renderTreeSelect = (item, disabled) => {
    return (
      <TreeSelect
        dropdownStyle={{maxHeight: 500}}
        onChange={item.onChange}
        disabled={item.disabled || disabled}
        treeData={item.options}
        treeCheckable={item.treeCheckable}
        onSelect={item.onSelect}
        showSearch={item.showSearch || false}
        treeNodeFilterProp={item.treeNodeFilterProp || 'label'}
        treeNodeLabelProp={item.treeNodeLabelProp || 'label'}
      />
    )
  };

  // 渲染图片上传
  renderImgUpload = (item, disabled) => {
    let {previewVisible, previewImage} = this.state;
    let {initialValue, multiple, action, name} = item;

    const props = {
      listType: "picture-card",
      name,
      action,
      multiple,
      disabled: item.disabled || disabled,
      onChange({file, fileList}) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
      accept: "image/*",
      defaultFileList: initialValue,
      onPreview: file => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    };

    const uploadButton = (
      <div>
        <Icon type="plus"/>
      </div>
    );

    return (
      <Upload
        {...props}>{uploadButton}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => this.setState({previewVisible: false})}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Upload>
    )
  };

  // 渲染附件上传
  renderFileUpload = (item, disabled) => {
    let {initialValue, multiple, action, name} = item;

    const props = {
      name,
      action,
      multiple,
      disabled: item.disabled || disabled,
      onChange({file, fileList}) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
      defaultFileList: initialValue,
    };

    const uploadButton = (
      <Button>
        <Icon type="upload"/> 上传
      </Button>
    );

    return (
      <Upload {...props}>{uploadButton}</Upload>
    )
  };

  render() {
    const t = this;
    let {data = {}, disabled, form = {}, formItemLayout = {}} = t.props;
    let {getFieldDecorator} = form;
    let {label, paramName, initialValue, rules = [], type, ...val} = data;
    const FORM = {
      "input": t.renderInput,
      "textArea": t.renderTextArea,
      "number": t.renderNumber,
      "radio": t.renderRadio,
      "checkbox": t.renderCheckBox,
      "timePicker": t.renderTime,
      "datePicker": t.renderDatePicker,
      "yearPicker": t.renderYearPicker,
      "monthPicker": t.renderMonthPicker,
      "rangePicker": t.renderRangePicker,
      "select": t.renderSelect,
      "treeSelect": t.renderTreeSelect,
      "imgUpload": t.renderImgUpload,
      "fileUpload": t.renderFileUpload,
    };
    return (
      <Form.Item label={label} {...formItemLayout}>
        {
          FORM[type] &&
          getFieldDecorator(paramName, {
            initialValue: initialValue,
            rules: rules
          })(
            FORM[type](data, disabled)
          )
        }
      </Form.Item>
    );
  }
}

export default FormItem;
