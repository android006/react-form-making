import PublicService from "../services/PublicService";

require('es6-promise').polyfill();
import 'isomorphic-fetch';
import Util from './Util';
import {hashHistory} from 'dva/router';
import config from '../config';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  // token超期
  if (response.status === 401) {
    return hashHistory.push({
      pathname: '/login',
      state: {loginOut: true, message: "登录过期，请重新登录", messageType: "error"}
    });
  }

  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function transformRequestData(data) {
  let obj = deleteUndefindeProps(data);
  return Util.isObject(obj) ? JSON.stringify(obj) : obj
}

function deleteUndefindeProps(Obj) {
  let newObj;
  if (Obj instanceof Array) {
    newObj = [];  // 创建一个空的数组
    let i = Obj.length;
    while (i--) {
      newObj[i] = deleteUndefindeProps(Obj[i]);
    }
    return newObj;
  } else if (Obj instanceof Object) {
    newObj = {};  // 创建一个空对象
    for (let k in Obj) {  // 为这个对象添加新的属性
      newObj[k] = deleteUndefindeProps(Obj[k]);
    }
    return newObj;
  } else {
    return Util.isUndefined(Obj) ? null : Obj;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(options) {

  if (!Util.isObject(options)) {
    throw new Error('Http request configuration must be an object');
  }
  if (!Util.isString(options.url)) {
    throw new Error('Http request configuration url must be a string');
  }
  // if (options.headers && !Util.isObject(options.headers)) {

  //   throw new Error('Http request headers must be a string');
  // }
  const defaultOpt = {method: 'GET'};
  let params = PublicService.paramSerializer(options.params);
  if (params) options.url = `${options.url}?${params}`;
  options.url = (
    options.url.slice(0, 3) === '/ed' ||
    options.url.slice(0, 4) === '/zsb' ||
    options.url.slice(0, 4) === '/ewc' ||
    options.url.slice(0, 4) === '/hms' ||
    options.url.slice(0, 4) === 'http' ||
    options.url.slice(0, 5) === '/epms' ||
    options.url.slice(0, 5) === '/xihu' ||
    options.url.slice(0, 5) === '/mwms' ||
    options.url.slice(0, 5) === '/pmms' ||
    options.url.slice(0, 6) === '/index' ||
    options.url.slice(0, 6) === '/spsms' ||
    options.url.slice(0, 8) === '/cockpit' ||
    options.url.slice(0, 8) === '/message' ||
    options.url.slice(0, 9) === '/waterenv' ||
    options.url.slice(0, 10) === '/basicinfo' ||
    options.url.slice(0, 10) === '/datalayer' ||
    options.url.slice(0, 14) === '/co-processing' ||
    options.url.slice(0, 11) === '/permission'
  ) ? options.url : config.publicUrl + options.url;
  if (options.method && options.method.toLowerCase() === 'export') {
    window.location = options.url;
    return {};
  }
  let opt = {};
  for (let k in options) {
    if (k !== 'params') {
      opt[k] = options[k];
    }
  }

  let headers;
  if (!opt.headers) {
    let token = PublicService.getCookie('token');
    opt.headers = opt.headers || {};
    headers = new Headers({
      'Accept': 'application/json, text/plain, */*',
      "Content-Type": "application/json;charset=UTF-8",
      'token': token,
      ...opt.headers
    });
  }


  opt.headers = headers;
  opt.credentials = 'include';  // 发送请求时带cookie
  opt.body = opt.data ? transformRequestData(opt.data) : opt.form;
  // 请求地址加入公共路径
  return fetch(options.url, opt)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      // if (!data.code) {
      //   notification.open({
      //     message: '提示',
      //     description: data.message,
      //     duration: 3,
      //   });
      // }
      return data
    })
    .catch(err => {
      // notification.open({
      //   message: '提示',
      //   description: '网络错误',
      //   duration: 3,
      // });
    });
}
