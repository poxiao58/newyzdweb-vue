/**
 * Created by luyanan on 19/3/10.
 */

/**
 * 去除str前后空格
 * @param str
 */
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}


export function dateFormat(date, fmat){
  const daterc = date
  var fmt = 'yyyy-MM-dd hh:mm:ss'
  if (fmat) {
    fmt = fmat
  }
  if (daterc) {
    var that = new Date(parseInt(daterc.replace('/Date(', '').replace(')/', ''), 10));
    var o = {
      'M+': that.getMonth() + 1, // 月份
      'd+': that.getDate(), // 日
      'h+': that.getHours(), // 小时
      'm+': that.getMinutes(), // 分
      's+': that.getSeconds(), // 秒
      'q+': Math.floor((that.getMonth() + 3) / 3), // 季度
      'S': that.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
