import React, {Component} from 'react';
import {List, Picker, InputItem, TextareaItem, DatePicker, Radio, Checkbox, Calendar, ImagePicker} from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import moment from "moment";

class FormItem extends Component {
  state = {};

  // 渲染输入框
  renderInput = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <InputItem
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        clear
        error={!!getFieldError(item.paramName)}
        placeholder={item.placeholder}
        style={{marginTop: 5}}>
        {this.renderLabel(item)}
      </InputItem>
    )
  };

  // 渲染多行文本
  renderTextArea = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <TextareaItem
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        clear
        error={!!getFieldError(item.paramName)}
        className={item.className}
        disabled={disabled}
        rows={item.rows}
        count={item.count}
        title={this.renderLabel(item)}
        autoHeight
        placeholder={item.placeholder}
      />
    )
  };

  // 渲染数值框
  renderNumber = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    let moneyKeyboardWrapProps;
    if (isIPhone) {
      moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
      };
    }

    disabled = item.disabled || disabled;
    return (
      <InputItem
        {...getFieldProps(item.paramName, {
          normalize: (v, prev) => {
            if (v && !/^(([1-9]\d*)|0)(\.\d{0,6}?)?$/.test(v)) {
              if (v === '.') {
                return '0.';
              }
              return prev;
            }
            return v;
          },
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        type={"money"}
        title={this.renderLabel(item)}
        placeholder={item.placeholder}
        onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
        clear
        moneyKeyboardWrapProps={moneyKeyboardWrapProps}>
        {this.renderLabel(item)}
      </InputItem>
    )
  };

  // 渲染单选框
  renderRadio = (item, disabled) => {
    let {radioVal} = this.state;
    let {getFieldProps} = this.props.form;
    let {initialValue, options} = item;
    radioVal = radioVal || initialValue;

    const onClick = (value) => {
      radioVal = radioVal === value ? null : value;
      this.setFormValue({[item.paramName]: radioVal});
      this.setState({radioVal});
    };

    disabled = item.disabled || disabled;
    return (
      <List renderHeader={item.label}>
        {
          options && options.length > 0 &&
          options.map((o, i) => (
            <Radio.RadioItem
              {...getFieldProps(item.paramName, {
                initialValue: item.initialValue,
                rules: item.rules,
              })}
              checked={o.value === radioVal}
              key={o.value}
              disabled={disabled}
              onClick={onClick.bind(this, o.value)}>
              {o.label}
            </Radio.RadioItem>
          ))
        }
      </List>
    )
  };

  // 渲染多选框
  renderCheckBox = (item, disabled) => {
    let {checkVal} = this.state;
    let {getFieldProps} = this.props.form;
    let {initialValue, options} = item;
    checkVal = checkVal || initialValue || [];

    const onClick = (value) => {
      let I = checkVal.findIndex(i => i === value);
      if (I === -1) {
        checkVal.push(value)
      } else {
        checkVal = checkVal.filter(i => i !== value)
      }
      this.setFormValue({[item.paramName]: checkVal});
      this.setState({checkVal});
    };

    disabled = item.disabled || disabled;
    return (
      <List renderHeader={item.label} disabled={disabled}>
        {
          options && options.length > 0 &&
          options.map((o, i) => (
            <Checkbox.CheckboxItem
              key={o.value}
              {...getFieldProps(item.paramName, {
                initialValue: item.initialValue,
                rules: item.rules,
              })}
              onClick={onClick.bind(this, o.value)}
              checked={checkVal.includes(o.value)}
              disabled={disabled}>
              {o.label}
            </Checkbox.CheckboxItem>
          ))
        }
      </List>
    )
  };

  // 渲染时间
  renderTime = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <DatePicker
        mode={"time"}
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        title={this.renderLabel(item)}
        extra={<span style={{fontSize: 14, color: '#616161'}}>{item.placeholder}</span>}>
        <List.Item arrow="horizontal">
          {this.renderLabel(item)}
        </List.Item>
      </DatePicker>
    )
  };

  // 渲染日期
  renderDatePicker = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <DatePicker
        mode={"date"}
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        title={this.renderLabel(item)}
        extra={<span style={{fontSize: 14, color: '#616161'}}>{item.placeholder}</span>}>
        <List.Item arrow="horizontal">
          {this.renderLabel(item)}
        </List.Item>
      </DatePicker>
    )
  };

  // 渲染年
  renderYearPicker = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <DatePicker
        mode={"year"}
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        title={this.renderLabel(item)}
        extra={<span style={{fontSize: 14, color: '#616161'}}>{item.placeholder}</span>}>
        <List.Item arrow="horizontal">
          {this.renderLabel(item)}
        </List.Item>
      </DatePicker>
    )
  };

  // 渲染月选择
  renderMonthPicker = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;

    disabled = item.disabled || disabled;
    return (
      <DatePicker
        mode={"month"}
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        disabled={disabled}
        title={this.renderLabel(item)}
        extra={<span style={{fontSize: 14, color: '#616161'}}>{item.placeholder}</span>}>
        <List.Item arrow="horizontal">
          {this.renderLabel(item)}
        </List.Item>
      </DatePicker>
    )
  };

  // 渲染时间段
  renderRangePicker = (item, disabled) => {
    let {initialValue} = item;
    let {show, value} = this.state;

    if (!value && initialValue && initialValue.length) {
      value = [];
      initialValue.map(i => {
        value.push(new Date(i))
      })
    }

    const onConfirm = (startDateTime, endDateTime) => {
      let val = [startDateTime, endDateTime];
      this.setFormValue({[item.paramName]: val});
      this.setState({value: val, show: false});
    };

    disabled = item.disabled || disabled;

    let content;
    if (value && value.length) {
      value.map(v => {
        let format = moment(v).format("YYYY-MM-DD");
        content = content ? content + " ~ " + format : format
      })
    }

    return (
      <List.Item
        arrow="horizontal"
        onClick={() => (!disabled && this.setState({show: true}))}
        extra={content}>
        {this.renderLabel(item)}
        <div onClick={e => e.stopPropagation()}>
          <Calendar
            locale={zhCN}
            visible={show}
            type={"range"}
            showShortcut={true}
            onCancel={() => this.setState({show: false})}
            onConfirm={onConfirm}
            defaultValue={value}
          />
        </div>
      </List.Item>

    )
  };

  // 渲染下拉选
  renderSelect = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;
    disabled = item.disabled || disabled;
    return (
      <Picker
        cols={item.cols || 1}
        data={item.options}
        title={item.label}
        extra={<span style={{fontSize: 14, color: '#616161'}}>{item.placeholder}</span>}
        disabled={disabled}
        {...getFieldProps(item.paramName, {
          initialValue: item.initialValue,
          rules: item.rules,
        })}
        onOk={item.onChange}>
        <List.Item arrow="horizontal">
          {this.renderLabel(item)}
        </List.Item>
      </Picker>
    )
  };

  // 渲染标签
  renderLabel = (item) => {
    let required;
    let {rules = []} = item;
    if (rules && rules.length) {
      rules.map(i => {
        if (i.required) {
          required = true
        }
      })
    }

    if (required) {
      return <span style={{color: '#000000', fontSize: 14}}><span style={{color: '#FF0000'}}>*</span>{item.label}</span>
    }

    return <span style={{color: '#000000', fontSize: 14, paddingLeft: 6}}>{item.label}</span>
  };

  // 渲染图片上传
  renderImgUpload = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;
    let {initialValue} = item;
    return (
      <List.Item>
        {this.renderLabel(item)}
        <ImagePicker
          files={initialValue}
          onChange={item.onChange}
          selectable={!(item.disabled || disabled)}
          accept={"image/*"}
          {...getFieldProps(item.paramName, {
            initialValue: item.initialValue,
            rules: item.rules,
          })}
          disableDelete={item.disabled || disabled}
          multiple={item.multiple}
        />
      </List.Item>

    )
  };

  // 渲染附件上传
  renderFileUpload = (item, disabled) => {
    const {getFieldProps, getFieldError} = this.props.form;
    let {initialValue} = item;

    return (
      <List.Item>
        {this.renderLabel(item)}
        <ImagePicker
          files={initialValue}
          onChange={item.onChange}
          selectable={!(item.disabled || disabled)}
          accept={"*"}
          {...getFieldProps(item.paramName, {
            initialValue: item.initialValue,
            rules: item.rules,
          })}
          disableDelete={item.disabled || disabled}
          multiple={item.multiple}
        />
      </List.Item>
    )
  };

  // 修改form值
  setFormValue = (params) => {
    let {setFieldsValue} = this.props.form;
    setFieldsValue(params)
  };

  render() {
    const t = this;
    let {data = {}, disabled} = t.props;
    let {type} = data;
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
      "imgUpload": t.renderImgUpload,
      "fileUpload": t.renderFileUpload,
    };
    return (FORM[type](data, disabled));
  }
}

export default FormItem;
