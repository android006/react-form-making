export const basicComponents = [
  {
    type: 'input',
    label: "单行文本",
    icon: "icondanhangwenben",
    initialValue: '',
    placeholder: '请输入',
    disabled: false,
    rules: [
      {required: false, message: "必须填写"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'textArea',
    label: "多行文本",
    icon: "iconxialaxuan",
    initialValue: '',
    disabled: false,
    placeholder: '请输入',
    rules: [
      {required: false, message: "必须填写"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'number',
    label: "数值",
    icon: "iconjishuqi",
    initialValue: 0,
    min: '',
    max: '',
    step: 1,
    disabled: false,
    rules: [
      {required: false, message: "必须填写"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'radio',
    label: "单选",
    icon: 'iconiconfontoptionbutton',
    inline: "inline",
    initialValue: '',
    options: [
      {value: 'Option 1', label: 'Option 1'},
      {value: 'Option 2', label: 'Option 2'},
      {value: 'Option 3', label: 'Option 3'}
    ],
    dataType: "static",
    remoteUrl: null,
    remoteValue: 'value',
    remoteLabel: 'label',
    disabled: false,
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'checkbox',
    label: "多选",
    icon: 'iconxuanze',
    inline: "inline",
    initialValue: [],
    showLabel: false,
    options: [
      {value: 'Option 1', label: 'Option 1'},
      {value: 'Option 2', label: 'Option 2'},
      {value: 'Option 3', label: 'Option 3'}
    ],
    dataType: "static",
    remoteUrl: null,
    remoteValue: 'value',
    remoteLabel: 'label',
    disabled: false,
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'timePicker',
    label: "时间",
    icon: "iconshijian",
    initialValue: null,
    placeholder: '请选择时间',
    format: 'HH:mm:ss',
    rules: [
      {required: false, message: "必须填写"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'datePicker',
    label: "日期",
    icon: "iconriqiqishu",
    initialValue: null,
    disabled: false,
    placeholder: '请选择日期',
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'yearPicker',
    label: "年份",
    icon: "iconriqiqishu",
    initialValue: null,
    disabled: false,
    placeholder: '请选择年份',
    rules: [
      {required: false, message: "必须选择"},
    ],
    customWidth: false,
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'monthPicker',
    label: "月份",
    icon: "iconriqiqishu",
    initialValue: null,
    disabled: false,
    placeholder: '请选择月份',
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'rangePicker',
    label: "时间段",
    icon: "iconriqiqishu",
    initialValue: null,
    disabled: false,
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
  {
    type: 'select',
    icon: 'iconxialaxuan',
    label: "下拉选",
    initialValue: null,
    mode: "",
    disabled: false,
    showSearch: true,
    placeholder: '',
    options: [
      {value: 'Option 1', label: 'Option 1'},
      {value: 'Option 2', label: 'Option 2'},
      {value: 'Option 3', label: 'Option 3'}
    ],
    dataType: "static",
    remoteUrl: null,
    remoteValue: 'value',
    remoteLabel: 'label',
    rules: [
      {required: false, message: "必须选择"},
    ],
    labelCol: 4,
    wrapperCol: 20,
  },
];

export const advanceComponents = [
  {
    type: 'imgUpload',
    label: "图片",
    icon: 'icontupian',
    initialValue: [],
    disabled: false,
    upMaxLength: 10,
    multiple: false,
    labelCol: 4,
    wrapperCol: 20,
    name: "file",
    action: ''
  },{
    type: 'fileUpload',
    label: "文件",
    icon: 'iconweibiaoti--',
    initialValue: [],
    disabled: false,
    upMaxLength: 10,
    labelCol: 4,
    wrapperCol: 20,
    multiple: false,
    name: "file",
    action: ''
  },
];

export const layoutComponents = [
  {
    type: 'grid',
    icon: 'iconzhage',
    label: "栅格",
    columns: [
      {label: "列1", span: 12, list: []},
      {label: "列2", span: 12, list: []}
    ],
    flex: false,
    gutter: 12,
    justify: 'start',
    align: 'top'
  }, {
    type: 'tabs',
    icon: 'iconyeqian',
    label: "标签页",
    columns: [
      {list: [], tab: "tab 1"},
    ],
    animated: true, // 切换动画
    tabBarGutter: 0, // 间隙
    tabPosition: "top", // 页签位置
    tabType: "line", // 页签的基本样式
  },
];
