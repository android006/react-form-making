/**
 * Created by GYL on 2018/8/14
 */
import React, {Component} from 'react';
import MyModal from '../MyModal';
import PictureGallery from "../PictureGallery/index";
import './index.less';

class ModalPictureGallery extends Component {
  static defaultProps = {
    pictrues: [],
    currentIndex: 0,
    cockpit: false
  };


  render() {
    let t = this;
    let {pictrues, currentIndex, cockpit} = t.props;
    const WIDTH = document.body.clientWidth;
    return (
      <MyModal
        title={"查看图片"}
        className={`modalPictureGallery ${cockpit && "cockpitModal"}`}
        {...t.props}
        width={WIDTH > 1500 ? 1600 : 900}
      >
        <div className='modalWrap'>
          <PictureGallery
            pictrues={pictrues}
            currentIndex={currentIndex}
          />
        </div>
      </MyModal>
    )
  }
}

export default ModalPictureGallery;

