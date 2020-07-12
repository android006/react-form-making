/* Created By SJ 2019-05-22 */
import React, {Component, PropTypes} from 'react';
import {Icon, Carousel} from 'antd';
import MyIcon from "../MyIcon/index";
import './index.less';

// 图片回廊
// pictrues（必传）
class PictureGallery extends Component {

  // 约束props类型
  static propTypes = {
    mode: PropTypes.string,
    thumbnailPosition: PropTypes.string,
    className: PropTypes.string,
    pictrues: PropTypes.array,
    currentIndex: PropTypes.number,
  }

  // 默认props
  static defaultProps = {
    mode: 'vertical',          // 缩略图类型，现在支持垂直(vertical)、水平(horizontal)
    thumbnailPosition: 'right', // 缩略图于大图所在的位置 top、bottom(针对水平模式)、left、right(针对垂直模式)
    className: '',               // 类名
    pictrues: [],                // 图片列表
    currentIndex: 0,             // 当前选中的图片索引
    dots: true,                 // 轮播是否显示面板指示点
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.currentIndex,                    // 当前选中的图片索引
      picSmallW: 100,                                      // 小图宽
      picSmallH: 150,                                     // 小图高
      picInterval: 10,                                     // 图片列表间隔
    }
  }

  prefix = ["Webkit", "Moz", "O", "MS"];      // 浏览器前缀
  lastOffset = '0px';                         // 上一次的偏移量

  componentWillMount() {
    this.checkProps()
  }

  componentDidMount() {
    let {currentIndex} = this.props;
    this.carousel.slick.slickGoTo(currentIndex); // 设置轮播图当前选中项
    let $ul = this.getSmallListDom();
    let $li = $ul.children && $ul.children[0];
    let {width, height, marginRight, marginBottom} = this.getStyle($li);        // 获取缩略图li的样式
    this.setState({
      picSmallH: this.pxToNumber(height),
      picSmallW: this.pxToNumber(width),
      picInterval: this.pxToNumber(this.isHorizontal() ? marginRight : marginBottom),
    })
  }

  // 是否是水平模式
  isHorizontal = () => {
    return this.props.mode === "horizontal"
  }

  // 是否是垂直模式
  isVertical = () => {
    return this.props.mode === 'vertical'
  }

  // 检测props联动
  checkProps = () => {
    const {thumbnailPosition} = this.props;
    // 水平模式下 thumbnailPosition只能为 top, bottom
    if (this.isHorizontal()) {
      let about = ["top", "bottom"];
      if (!about.includes(thumbnailPosition)) {
        throw new Error("PictureGallery : horizontal模式下 thumbnailPosition只能为 top、bottom")
      }
    }
    // 垂直模式下 thumbnailPosition只能为 left, right
    if (this.isVertical()) {
      let about = ["left", "right"];
      if (!about.includes(thumbnailPosition)) {
        throw new Error("PictureGallery : vertical模式下 thumbnailPosition只能为 left、right")
      }
    }
  }

  // 像素转数值
  pxToNumber = (str = "") => {
    return str ? +str.replace("px", "") : 0;
  }

  // 获取dom样式
  getStyle = (el) => {
    let computedStyle = {};
    if (window.getComputedStyle) {
      computedStyle = getComputedStyle(el, null)
    } else {
      computedStyle = el.currentStyle;    //兼容IE的写法
    }
    return computedStyle;
  }

  // 获取图片列表长度
  getPictrueLen = () => {
    return (this.props.pictrues || []).length;
  };

  getIndex = () => {
    let {pictrues} = this.props;
    let {currentIndex} = this.state;
    return (
      <div className="indexText">
        <span style={{paddingRight: 20}}><span
          className="currentIndex">{currentIndex + 1}</span>/{pictrues.length}</span>
        <a href={pictrues[currentIndex]} target="_blank">
          <MyIcon type="icon-xiazai" style={{fontSize: 24}}/>
        </a>
      </div>
    )
  };

  // 获取当前图片
  getCurrentPic = (index) => {
    let {currentIndex} = this.state;
    return this.props.pictrues[index + '' !== 'undefined' ? index : currentIndex] || ""
  };

  // 获取箭头字体大小
  getArrowFs = (isSmall) => {
    return isSmall ? '20px' : '40px'
  }

  // 获取箭头方向
  getArrowDirection = (type, isSmall) => {
    switch (type) {
      case "add":
        if (isSmall) {
          return this.isVertical() ? "down" : "right";
        }
        return "right"
      case "cut":
        if (isSmall) {
          return this.isVertical() ? "up" : "left";
        }
        return "left"
    }
  }

  // 判断是否是当前项
  isCurrent = (i) => {
    return this.state.currentIndex === i
  }

  // 获取缩略图父容器dom
  getSmallListWrapperDom = () => {
    return document.getElementById("pictrueGalleryListWrapper");
  }

  // 获取缩略图容器dom
  getSmallListDom = () => {
    return document.getElementById("pictrueGalleryList");
  }

  // 获取缩略图容器的宽度
  getSmallListWrapperWidth = () => {
    return this.getSmallListWrapperDom().clientWidth;
  }

  // 获取缩略图容器的高度
  getSmallListWrapperHeight = () => {
    return this.getSmallListWrapperDom().clientHeight;
  }

  // 一个图片li所占据的宽度或者高度 根据mode判断
  getLiSpace = () => {
    const {picSmallW, picSmallH, picInterval} = this.state;
    return this.isHorizontal() ? picInterval + picSmallW : picInterval + picSmallH
  }

  // 父容器所占据的高度或者宽度 根据mode判断
  getWrapperSpace = () => {
    return this.isHorizontal() ? this.getSmallListWrapperWidth() : this.getSmallListWrapperHeight();
  }

  // 获取缩略图列表的偏移值
  getOffset = (type) => {
    const {currentIndex} = this.state;
    let len = this.getPictrueLen();                   // 图片列表总个数
    let liSpace = this.getLiSpace();                  // 一个图片li所占据的宽度或者高度
    let wrapperSpace = this.getWrapperSpace();        // 父容器所占据的高度或者宽度
    let halfSpace = wrapperSpace / 2;                 // 父容器的宽或高的一半
    let number = Math.floor(wrapperSpace / liSpace);  // 父容器所见宽或高能放置图片li的个数 假如父容器是800px 每个li所占宽或高是100px 那么个数为800/100=8
    let halfNo = number / 2;                          // 父容器所见宽或高能放置图片li个数的一半

    // 滚动到最后一张图片之后时 需要回滚到第一张
    if (currentIndex + 1 > len) {
      return "0px"
      // 刚开始从左至右滚动时不需要偏移 当超过半数才需要设置偏移量
    } else if (currentIndex + 1 <= halfNo) {
      return "0px"
      // 滚动到最后一页时
    } else if (currentIndex + 1 > len - halfNo + 1) {
      // 右箭头点击时 不需要进行偏移
      if (type === 'add') {
        return this.lastOffset
      }
      // 左箭头点击时 需要直接滚动到最右侧
      if (type === 'cut') {
        return (-(liSpace) * currentIndex) + wrapperSpace - liSpace + 'px'
      }
      // 偏移值 = -(小图宽 + 图片间隔) * 当前索引 + 父容器宽度的一半 - 图片li宽度
    } else {
      return (-(liSpace) * currentIndex) + halfSpace - liSpace + 'px'
    }
  }

  // 设置缩略图列表偏移
  setOffset = (type) => {
    let el = this.getSmallListDom();
    let offset = this.getOffset(type);
    this.prefix.forEach(m => {
      el.style[`${m}Transform`] = this.isHorizontal() ? `translate(${offset})` : `translate(0, ${offset})`;
    })
    this.lastOffset = offset;
  }

  // 设置当前索引 结合以下规则
  setCurrentIndex = (i) => {
    let currentIndex = -1;
    let picLen = this.getPictrueLen();

    // 小于0时需要滚到最后一张
    if (i < 0) {
      currentIndex = picLen - 1
      // 大于图片列表的长度时 需要回到第一张图片
    } else if (i > picLen - 1) {
      currentIndex = 0
    } else {
      currentIndex = i
    }

    this.carousel.slick.slickGoTo(currentIndex); // 设置轮播图当前选中项
    // setState是异步的 导致计算时不是最新的值 所以用直接赋值的方式
    this.state.currentIndex = currentIndex;
    this.setState({})
  }

  // 图片切换事件
  handleChange = (type, i) => {
    let curIndex = this.state.currentIndex;
    switch (type) {
      // 右箭头点击时
      case "add":
        this.setCurrentIndex(curIndex + 1)
        break;
      // 左箭头点击时
      case "cut":
        this.setCurrentIndex(curIndex - 1)
        break
      // 点击缩略图时
      default:
        this.setCurrentIndex(i)
    }
    this.setOffset(type);
  }

  // 左箭头
  getLeftArrow = (isSmall) => {
    return (
      <div
        className={`arrow arrow-left ${ isSmall ? "small" : 'big' }`}
        onClick={() => this.handleChange('cut')}
      >
        <div className='imgWrap'>
          <Icon
            style={{fontSize: this.getArrowFs(isSmall)}}
            type={this.getArrowDirection("cut", isSmall)}
          />
        </div>
      </div>
    )
  };

  // 右箭头
  getRightArrow = (isSmall) => {
    return (
      <div
        className={`arrow arrow-right ${ isSmall ? "small" : 'big'}`}
        onClick={() => this.handleChange('add')}
      >
        <div className='imgWrap'>
          <Icon
            style={{fontSize: this.getArrowFs(isSmall)}}
            type={this.getArrowDirection("add", isSmall)}
          />
        </div>
      </div>
    )
  }

  // 小图列表
  getSamllList = () => {
    const {pictrues = []} = this.props;

    return (
      <div className={"small-list"} id="pictrueGalleryListWrapper">
        <ul id="pictrueGalleryList">
          {
            pictrues.map((m, i) => {
              return (
                <li
                  key={i}
                  onClick={() => this.handleChange(null, i)}
                  className={this.isCurrent(i) ? "current" : ''}
                >
                  <img draggable={false} src={m}/>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  };

  // 图片变化之后
  beforeChange = (form, to) => {
    let type = 'cut';
    if (to > form) {
      type = "add";
    }
    this.setState({currentIndex: to}, () => {
      this.setOffset(type);
    })

  };

  // 大图预览盒子
  getViewBox = () => {
    const {pictrues = [], dots} = this.props;
    return (
      <div className={"view-box"}>
        <div className={"view-box-inner"}>
          {this.getLeftArrow()}
          <div className='view-box-wrap'>
            <Carousel ref={ref => this.carousel = ref} beforeChange={this.beforeChange} dots={dots}>
              {
                pictrues.map((item, index) => (
                  <div className='view-box-item' key={index}>
                    <img draggable={false} className={"view-box-img"} src={item}/>
                  </div>
                ))
              }
            </Carousel>

          </div>
          {this.getIndex()}
          {this.getRightArrow()}
        </div>
      </div>
    )
  }

  // 缩略图
  getThumbnailBox = () => {
    return (
      <div className={"thumbnail-box" + ' ' + this.props.mode}>
        {this.getLeftArrow(true)}
        <div style={{height: '100%'}}>{this.getSamllList()}</div>
        {this.getRightArrow(true)}
      </div>
    )
  }

  // 获取主体
  getContainer = () => {
    switch (this.props.thumbnailPosition) {
      case 'left' :
        return (
          <div className="pictrue-container">
            <div className="pictrue-container-left thumbnail">{this.getThumbnailBox()}</div>
            <div className="pictrue-container-right view">{this.getViewBox()}</div>
          </div>
        );
      case 'right' :
        return (
          <div className="pictrue-container">
            <div className="pictrue-container-left view">{this.getViewBox()}</div>
            <div className="pictrue-container-right thumbnail">{this.getThumbnailBox()}</div>
          </div>
        );
      case 'top':
        return (
          <div>
            {this.getThumbnailBox()}
            {this.getViewBox()}
          </div>
        );
      case 'bottom':
        return (
          <div>
            {this.getViewBox()}
            {this.getThumbnailBox()}
          </div>
        )
    }
  }

  render() {
    const {className = ''} = this.props;

    return (
      <div className={"pictrue-gallery-wrapper" + ' ' + className}>
        {this.getContainer()}
      </div>
    )

  }

}

export default PictureGallery
