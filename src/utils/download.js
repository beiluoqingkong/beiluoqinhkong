import streamSaver from 'streamsaver'
import API_CONFIG from '../../vue.config';
import Vue from 'vue'

export function transUrl(url) {
  var ip = API_CONFIG.devServer.proxy['/fzideo'].target;
  let result = url.replace(ip, "/fzideo");
  return result;
}

//替换原url为跨域路径，完成下载操作
export function download(url) {
  let filename = url.split('/')[url.split('/').length - 1];
  //如果服务器没有开放跨域，需要获取vue-config代理中/fzideo前缀的域名然后替换
  // var ip = API_CONFIG.devServer.proxy['/fzideo'].target;
  // url=url.replace(ip, "/fzideo");
  // console.log(url);

  fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    // headers: {
    //   'Access-control-allow-origin': '*'
    // }
  }).then(res => {
    Vue.prototype.$notify.success('开始下载！');
    // Vue.prototype.$notify({
    //   message: '开始下载！',
    //   type:'success',
    //   duration: 0
    // });
    const fileStream = streamSaver.createWriteStream(filename, {
      size: res.headers.get("content-length")
    })
    const readableStream = res.body

    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
      return readableStream.pipeTo(fileStream)
        .then(() => {
          Vue.prototype.$notify.success('下载完成！请等待浏览器缓冲...')
          // Vue.prototype.$notify({
          //   message: '下载完成！请等待浏览器缓冲...',
          //   type:'success',
          //   duration: 0
          // });
          // console.log('done writing')
        })
    }

    window.writer = fileStream.getWriter()

    const reader = res.body.getReader()
    const pump = () => {
      reader.read().then(res => {
        if (res.done) window.writer.close();
        else window.writer.write(res.value).then(pump)
      })
    }

  })
}