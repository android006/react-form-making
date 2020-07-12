import moment from 'moment';
import Util from '../utils/Util';


export default class PublicService {

  /**
   * @param allProjectInfo 所有项目信息数组
   * @param valueIndex select option的value
   * @param textIndex select option的text
   * @param addAll 添加option {value: '', text: '全部'}
   * @param paramsAll 添加全部元素
   * @returns {Array} 根据需要生成的select option配置
   */
  static transformProjectInfoToSelect(allProjectInfo, valueIndex, textIndex, addAll, paramsAll) {
    let selectOpts = [];
    if (addAll) {
      selectOpts.push({value: '', text: '全部'});
    }
    if (allProjectInfo && allProjectInfo.length !== 0) {
      for (let i = 0, l = allProjectInfo.length; i < l; i++) {
        if (paramsAll) {
          selectOpts.push({
            ...allProjectInfo[i],
            value: allProjectInfo[i][valueIndex],
            text: allProjectInfo[i][textIndex]
          });
        } else {
          selectOpts.push({value: allProjectInfo[i][valueIndex], text: allProjectInfo[i][textIndex]});
        }

      }
    }
    return selectOpts;
  }

  /**
   * 时间格式化
   * @param text 时间戳
   * @param format 转换格式(默认为YYYY-MM-DD)
   */
  static setTime = (text, format = "YYYY-MM-DD") => {
    return moment(text).format(format)
  };


  /**
   * 生成随机id
   * @param len 长度
   * */
  static RandomId(len = 6) {
    return Math.random().toString(36).substr(3, len);
  }

  /**
   * 格式化金钱
   * @param num 值
   * */
  static FormatMoney(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * 生成随机颜色
   * @param len 长度
   * */
  static RandomColor(len = 6) {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
  }

  /**
   * 验证数据类型
   * @param tgt 目标
   * @param type 预测类型
   * */
  static DataType(tgt, type){
    const dataType = Object.prototype.toString.call(tgt).replace(/\[object /g, "").replace(/\]/g, "").toLowerCase();
    return type ? dataType === type : dataType;
  }

  // 验证手机号码和座机
  static checkTel(value) {
    let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    let isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    if (isMob.test(value) || isPhone.test(value)) {
      return true;
    } else {
      return false;
    }
  };

  // 校验经度是否符合规范
  static checkLong(val) {
    let longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
    if (!longrg.test(val)) {
      return '经度整数为0-180,小数为0到4位!';
    }
    return false
  }

  // 校验纬度是否符合规范
  static checkLat(val) {
    let latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,4}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
    if (!latreg.test(val)) {
      return '纬度整数为0-90,小数为0到4位!';
    }
    return false;
  }

  /**
   * 实现对象的深克隆
   * obj 为需要克隆对象
   * **/
  static deepClone(obj) {
    if (typeof obj !== "object") {
      return obj;
    }
    if (!obj) {
      return
    }
    let newObj = obj.constructor === Array ? [] : {};  //开辟一块新的内存空间
    for (let i  in  obj) {
      newObj [i] = this.deepClone(obj [i]);                 //通过递归实现深层的复制
    }
    return newObj;
  }


  /**
   * @param data 需要转换结构的源数据
   * @param needColNum 需要增加table序号列数据
   * @param needKey 需要增加唯一标识key
   * @param currentPage 当前页
   * @param pageSize 每页数据数目
   * @returns {*} 转换后的数据
   */
  static transformArrayData(data, needColNum, needKey, currentPage, pageSize) {
    // 需要添加table序号
    if (needColNum) {
      for (let i = 0; i < data.length; i++) {
        // 有分页
        if (currentPage && pageSize) {
          data[i]['num'] = pageSize * (currentPage - 1) + i + 1;
          // 无分页
        } else {
          data[i]['num'] = i + 1;
        }
      }
      // 需要添加唯一标识key
    }
    // 添加Key
    if (needKey) {
      for (let i = 0; i < data.length; i++) {
        // 若数据不存在key字段,则增加唯一标识key
        if (!data[i]['key']) data[i]['key'] = i;
      }
    }
    if (!needColNum && !needColNum) {
      console.info('检查transformArrayData方法参数(needColNum,needKey),返回数据结构未改变');
    }
    return data;
  }

  /**
   * @param array 需要去重的数组
   * @param keys 指定的根据字段
   * @returns {Array} 返回筛选后的数组对象
   */
  static uniqeByKeys(array, keys) {
    let result = [], hash = {};
    for (let i = 0; i < array.length; i++) {
      let elem = array[i][keys];
      if (!hash[elem]) {
        result.push(array[i]);
        hash[elem] = true;
      }
    }
    return result
  }

  /**
   * @param data 需要转换结构的源数据
   * @param parentKey 父元素Key值
   * @param newKey 子元素key
   */
  static addKey(data, parentKey, newKey) {
    // 添加Key
    if (newKey) {
      for (let i = 0; i < data.length; i++) {
        // 增加唯一标识key
        data[i]['key'] = parentKey + i + '';
      }
    }
    return data;
  }

  /**
   * @param data 需要转换结构的源数据
   * @param keyName key名称
   * @param num 序号
   */
  static setKey(data, keyName, num) {
    data.map((item, index) => {
      item.key = item[keyName];
      if (num) {
        item.num = index + 1;
      }
    });
    return data;
  }

  /**
   *  返回指定的字段的一维数组
   *  @param data: 数据源，[{},{}]
   *  @param key: 指定键名
   *  @returns 返回一维数组
   *
   */
  static getDataByKey(data, key) {
    let list = [];
    if (data && data.length) {
      data.map(item => {
        list.push(item[key])
      })
    }
    return list;
  }

  /***
   * @columns 表格的columns属性
   * @returns {number} table宽度
   */
  static getTableWidth(columns) {
    let tableWidth = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width) {
        tableWidth = tableWidth + parseInt(columns[i].width)
      } else {
        console.log('PublicService->getTableWidth: columns 中没有配置width属性');
      }
    }
    return tableWidth;
  }

  /**
   * @data 数据源(['1', '2'] ||  [{title: '标题', dataIndex: '对应字段', width: '表格宽度', format: '格式化时间'}])
   */
  static getTableColumns(data) {
    data.map((item, index) => {
      if (typeof item === 'string') {
        data[index] = {
          title: item,
          key: item + index,
          dataIndex: item + index,
          width: PublicService.getColumnWidth(item)
        }
      } else {
        let {title, dataIndex, width, format} = item;
        item.dataIndex = dataIndex ? dataIndex : title;
        item.width = width ? width : PublicService.getColumnWidth(title);
        if (format) {
          item.render = (text) => (<span>{text ? moment(text).format(format) : null}</span>)
        }
        if (item.children && item.children.length) {
          PublicService.getTableColumns(item.children);
        }
      }
    });
    return data
  }

  /***
   * @title 文字
   * @returns {number} 列宽度
   */
  static getColumnWidth(title) {
    return Math.floor(title.length / 2) * 12 + 80;
  }

  /**
   * @param params 导出文件所需参数
   * @returns {*}   返回导出拼接字符串
   */
  static paramSerializer(params) {
    if (!params) return '';
    let urlPart = [];
    for (let k in params) {
      let value = params[k];
      if (value === null || Util.isUndefined(value)) continue;
      if (Util.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          urlPart.push(k + '=' + value[i])
        }
      } else {
        urlPart.push(k + '=' + value)
      }
    }
    return urlPart.join('&')
  }

  // 浏览器全屏方法
  static fullScreen(element) {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  // 取消全屏
  static outFull(document) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else {
      window.parent.showTopBottom();
    }
  }

  static getCurSysDateFromMillforDay(mill, isChinese) {
    var d = new Date();
    d.setTime(mill);
    if (isChinese) {
      return '第' + d.getDate() + '天';
    }
    return d.getDate();
  }

  /**
   * 保存字段到cookie
   * @param c_name 要保存字段的名称
   * @param value 要保存字段的值
   * @param expireDays 过期时间
   */
  static setCookie(c_name, value, expireDays = 30) {
    document.cookie = c_name + "=" + escape(value);
    // cookie过期时间
    // let expireTimeCode = timeCode + (60 * 60 * 24 * expireDays);
    // if (expireDays)
    //   document.cookie = 'expireTimeCode=' + expireTimeCode
  }

  /**
   * 从cookie中取字段
   * @param c_name 要取得的字段名
   * @returns {string} 返回字段对应的值, 若字段不存在则返回空
   */
  static getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=")
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  };

  /**
   * 清空cookie中某字段
   * @param name 要清空的字段名
   */
  static clearCookie(name) {
    this.setCookie(name, "", -1);
  }

  /**
   * 返回localStorage中的用户信息
   * @param sessionName 要获取的对象信息
   * @param name 要获取的对象中的信息
   */
  static getSessionItem(sessionName, name) {
    let content = "";
    if (name) {
      const session = JSON.parse(localStorage.getItem(sessionName));
      if (session) {
        content = session[name]
      }
    } else {
      content = localStorage.getItem(sessionName);
    }
    return content;
  }

  // 年份选择
  static yearSelect() {
    let curYear = new Date().getFullYear();
    let yearSelectOpt = [];
    for (let i = curYear - 100; i < curYear + 100; i++) {
      yearSelectOpt.push({
        text: i,
        value: i,
      });
    }
    return yearSelectOpt;
  }

  /**
   * 将数组按键名取出单一值
   * @param arr [] 目标数组
   * @param key [] 取出数据的属性名
   * @param where ()
   * @returns [] 一维数组
   */
  static arrDataBy(arr, key, where) {
    let data = [];
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i][key];
      if (where) {
        if (typeof where === "function") {
          let B = where(arr[i]);
          if (B) {
            data.push(val)
          }
        } else if (typeof where === "string") {
          if (arr[i][where]) {
            data.push(val)
          }
        }
      } else {
        data.push(val)
      }
    }
    return data
  }

  /**
   * 循环两个数据，根据条件返回新的数组
   * @param arr 目标数组
   * @param arr2 数组2
   * @param keys 条件名称
   * @returns [] 符合条件的数据
   */
  static arrsByKey(arr = [], arr2 = [], keys = []) {
    let list = [];
    arr.map(item => {
      let num = 0; // 记录比对成功次数
      arr2.map(subItem => {
        keys.map(key => {
          item[key] == subItem[key] && num++
        });
      });
      // 比对成功的次数等于比较字段长度，视为比对成功
      num === keys.length && list.push({...item})
    });
    return list
  }

  /**
   * 将数组根据目标键名中取出
   * @param arr 目标数组
   * @param keys 目标键名
   * @param exclude 是否为排除目标键名模式，默认为false
   *  false: 按键名获取字段; true: 获取键名以外的字段
   * @return []
   * */
  static arrToKeyData(arr = [], keys = [], exclude = false) {
    let data = [];
    arr.map((item, index) => {
      data[index] = {};
      let keyNames = Object.keys(item); // 获取arr键名集合
      keys.map(key => {
        keyNames.map(keyName => {
          // 判断是否为排除模式
          if (keyName === key && !exclude) {
            data[index][keyName] = item[key]
          } else if (keyName !== key && exclude) {
            data[index][keyName] = item[key]
          }
        })
      });
    });
    return data
  };

  /***
   * 将对象数组按照对象某一属性分组
   * 每组的数据保存属性data中
   * @param arr 目标数组
   * @param index 分组根据的属性名
   */
  static arrGroupBy(arr, index) {
    let map = {};
    let dest = [];
    for (let i = 0; i < arr.length; i++) {
      let ai = arr[i];
      if (!map[ai[index]]) {
        dest.push({
          [index]: ai[index],
          data: [ai]
        });
        map[ai[index]] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let dj = dest[j];
          if (dj[index] == ai[index]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }

  /***
   * 获取url参数
   * @param name 目标参数名称
   */
  static getQueryString(name) {
    let reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
    let r = window.location.href.substr(1).match(reg);
    if (r !== null) {
      return unescape(r[2]);
    }
    return null;
  }

  // 坐标装换
  static onConvertFrom(lng, lat) {
    //定义一些常量
    let x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    let PI = 3.1415926535897932384626;
    let a = 6378245.0;
    let ee = 0.00669342162296594323;

    function gcj02towgs84(lng, lat) {
      if (out_of_china(lng, lat)) {
        return [lng, lat]
      }
      else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
      }
    }

    function transformlat(lng, lat) {
      let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
      ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
      return ret
    }

    function transformlng(lng, lat) {
      let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
      return ret
    }

    function out_of_china(lng, lat) {
      return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }

    return gcj02towgs84(lng, lat)
  }

  /**
   * 自定义函数名：PrefixZero
   * @param num： 被操作数
   * @param n： 固定的总位数
   */
  static PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  /**
   * 修改网站图标和标题
   */
  static changeTitleAndIcon({title, icon}) {
    if (icon) {
      const changeFavicon = link => {
        let $favicon = document.querySelector('link[rel="icon"]');
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
        if ($favicon !== null) {
          $favicon.href = link;
          // Otherwise, create a new element and append it to <head>.
        } else {
          $favicon = document.createElement("link");
          $favicon.rel = "icon";
          $favicon.href = link;
          document.head.appendChild($favicon);
        }
      };
      changeFavicon(icon); // 动态修改网站图标
    }
    if (title) {
      document.title = title; // 动态修改网站标题
    }
  }
}
