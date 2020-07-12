import {message} from "antd";
import PublicService from "../services/PublicService";

function Download(url, params) {
  let hide = message.loading('下载中...', 0);
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      resolve(xhr);
    };
    xhr.onerror = reject;
    if (params) {
      xhr.open('GET', url + '?' + PublicService.paramSerializer({
        ...params,
      }));
    } else {
      xhr.open('GET', url);
    }
    let token = PublicService.getCookie('token');
    xhr.setRequestHeader('token', token);
    xhr.send();
  }).then(xhr => {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    let header = xhr.getResponseHeader('Content-Disposition');
    if (header) {
      let text = "filename=";
      let start = header.indexOf(text);
      let file = header.substring(start + text.length, header.length); // 文件后缀
      a.download = decodeURIComponent(file);
    }
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    hide();
    return xhr;
  });
}

export default Download;
