/**
 * Created by wadeforever on 2017/5/25.
 */
import React, {Component} from 'react';
import { Icon } from 'antd';
import './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1926621_65559e29ra6.css',
});

export default class MyIcon extends Component {
  render () {
    let t = this;
    let {type, style, onClick, className} = t.props;
    return (
      <IconFont type={type} className={className} onClick={onClick} style={style}/>
    )
  }
}
