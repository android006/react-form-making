/**
 * Created by GYL on Description: 收缩
 */
import React, {Component} from 'react';
import {Tooltip, Divider, Icon, Spin} from 'antd';
import MyIcon from '../MyIcon';
import './index.less';

class MyCollapse extends Component {
  static defaultProps = {
    defaultActive: true,
    collapseShow: true,
    loading: false,
    refresh: true,
    hideHeight: 0,
    extraHeight: 0,
    showHeight: null,
    title: '',
    headerRender: null,
    size: 'big',
    Btn: [],
    // Btn: [
    //   {title: "上传照片", icon: 'icon-shangchuanzhaopian', color: '#2090F0'},
    //   {title: "保存", icon: 'icon-baocun', color: '#3670E9'},
    //   {title: "撤销输入", icon: 'icon-chexiao1', color: '#FF914E'},
    // ],
    items: []
  };

  state = {
    collapseActive: this.props.defaultActive,
    height: 'auto',
  };

  componentDidMount() {
    let t = this;
    window.setTimeout(() => {
      let {showHeight, defaultActive, hideHeight, extraHeight} = t.props;
      t.height = t.content && t.content.offsetHeight;
      // 额外的高度
      if (extraHeight) {
        t.height += extraHeight;
      }
      let height = t.height;
      if (defaultActive) {
        if (showHeight) {
          height = showHeight;
        }
      } else {
        height = hideHeight;
      }

      t.setState({
        height,
      })
    }, 50)
  };

  componentWillReceiveProps(nextProps) {
    let t = this;
    let {height, collapseActive} = t.state;
    let {items, showHeight, refresh} = t.props;
    if (collapseActive && refresh) {
      this.setState({
        height: "auto"
      }, () => {
        t.height = t.content && t.content.offsetHeight;
        if (showHeight) {
          t.height = showHeight;
        }
        if (height < 10 && !items.length) {
          if (t.height) {
            t.setState({
              height: t.height,
            })
          }
        }
      })
    }
  }

  componentDidUpdate() {

  }

  // 收缩
  onCollapse = () => {
    let {collapseActive} = this.state;
    let {hideHeight, showHeight, onCollapse} = this.props;
    if (collapseActive && this.height <= 10) {
      return
    }
    let height = this.height;
    if (showHeight) {
      height = showHeight;
    }
    if (collapseActive) {
      height = hideHeight;
    }
    onCollapse && onCollapse(!collapseActive);
    this.setState({
      collapseActive: !collapseActive,
      height,
    })
  };

  // 按钮点击
  onBtnClick = (callback, e) => {
    // 阻止事件冒泡
    e.stopPropagation(); // 阻止事件冒泡
    if (callback) {
      callback();
    }
  };

  render() {
    let t = this;
    let {title, content, Btn, collapseShow, headerRender, loading, size, contentClass, titleStyle} = t.props;
    let {collapseActive, height} = t.state;
    return (
      <div className={`myCollapse ${size === "small" && 'myCollapseSmall'}`}>
        <Spin spinning={loading}>
          {
            title &&
            <div
              className={`myCollapse-header myCollapse-header-border`}
              onClick={collapseShow ? t.onCollapse : null}>
              <div className={'myCollapse-header-title'} style={titleStyle}>
                {
                  title !== "noShow" &&
                  <div className={"myCollapse-header-title-text"}>{title}</div>
                }

                {
                  content && content
                }
                {
                  collapseShow &&
                  <div
                    className={`myCollapse-header-title-icon ${collapseActive && 'myCollapse-header-title-icon-active'}`}>
                    <Icon type="double-right"/>
                  </div>
                }
              </div>
              <div className={'myCollapse-header-btn'}>
                {
                  Btn.length > 0 &&
                  Btn.map((item, index) => (
                    <div key={index} className={'myCollapse-header-btn-item'}>
                      <Tooltip title={item.title}>
                        <a onClick={t.onBtnClick.bind(t, item.onClick)}>
                          <MyIcon type={item.icon} style={{fontSize: 22, color: item.color}}/>
                        </a>
                      </Tooltip>
                      {
                        (index <= Btn.length - 2) &&
                        <Divider type="vertical" style={{background: '#1D2A2F'}}/>
                      }
                    </div>
                  ))
                }
                {headerRender}
              </div>
            </div>
          }
          <div ref={ref => this.content = ref}
               style={{...t.props.style, height}}
               className={`myCollapse-content ${contentClass}`}>
            {t.props.children}
          </div>
        </Spin>
      </div>
    )
  }
}

export default MyCollapse;
