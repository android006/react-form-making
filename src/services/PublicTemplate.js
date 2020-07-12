/**
 * Created by win7 on 2017/11/22.
 */
import moment from 'moment';
export default class PublicTemplate {

  /**
   * 文本内容超出部分省略号显示
   * @param text 文本内容
   * @param lens 要省略文本长度(不传默认为10)
   */
  static stringToEllipsis = (text, lens) => {
    let textCopy = text;
    let len = lens ? lens : 10;
    text = text ? (text.length > len ? text.substr(0, len - 1) + '...' : text) : '--';
    return (
      <span title={textCopy}> {text} </span>
    )
  }

  /**
   * 文本内容超出部分省略号显示
   * @param text 文本内容
   * @param lens 要省略文本长度(不传默认为10)
   */
  static stringToEllipsisText = (text, lens) => {
    let val = text;
    let strLen = 0;
    lens = lens * 2;
    for (let i = 0; i < text.length; i++) {
      //如果是汉字，则字符串长度加2
      if (text.charCodeAt(i) > 255) {
        strLen += 2;
      } else {
        strLen++;
      }
      if (strLen >= lens) {
        val = text.substr(0, strLen) + "...";
        break;
      }
    }
    return val
  }

  /**
   * 文本内容超出部分省略号显示
   * @param text 时间戳
   * @param type 转换格式(默认为YYYY-MM-DD)
   */
  static setTime = (text, type) => {
    if (text) {
      let len = type ? type : 'YYYY-MM-DD';
      return (
        <span> {moment(text).format(len)} </span>
      )
    } else {
      return <span>--</span>
    }

  }

}
