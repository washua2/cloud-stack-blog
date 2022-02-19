//工具方法
class Utils {

  //格式化日期
  formatDate(date, format) {
    //date: 日期对象 或者日期字符串
    //format: 日期格式(yyyy-MM-dd hh:mm:ss)

    let d = null;

    if (Object.prototype.toString.call(date) === '[object,Date]') {
      d = date;
    } else {
      d = new Date(date);
    }

    //将年份替换yyyy ==> 2021-MM-dd hh:mm:ss
    let year = d.getFullYear().toString();

    //判断是否存在yyyy
    if (/(y+)/.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 

      year = year.slice(4 - content.length);

      format = format.replace(content, year);
    }

    // 

    //替换月日时分秒
    let o = {
      M: d.getMonth() + 1,
      d: d.getDate(),
      h: d.getHours(),
      m: d.getMinutes(),
      s: d.getSeconds()
    };

    for (let key in o) {
      //根据key动态生成正则
      let reg = new RegExp(`(${key}+)`);
      // 
      if (reg.test(format)) {
        //获取匹配组的内容
        let c = RegExp.$1;
        // 
        let text = o[key] >= 10 ? o[key] : c.length === 2 ? '0' + o[key] : o[key];
        format = format.replace(c, text);
        // 
      }
    }

    return format;


  }

}

export const utils = new Utils();