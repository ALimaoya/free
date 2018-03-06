/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function  DateAdd(interval, number, date) {
  switch (interval) {
    case "y ": {
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q ": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m ": {
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w ": {
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d ": {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h ": {
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m ": {
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s ": {
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default: {
      date.setDate(d.getDate() + number);
      return date;
      break;
    }
  }
}

export function GetTimeByTimeStr(dateString) {
  // let timeArr = dateString.split("T");
  let d = dateString.split("-");
  // let t = timeArr[1].split(":");
  return new Date(d[0], d[1] - 1, d[2]);
}

export function monthLength(year, month) {
  let isLeap = false ;
  let dayLong = 31 ;
  if((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)){
    isLeap = true ;
  }
  if(month === 2){
    if(isLeap){
      dayLong = 29 ;
    }else{
      dayLong = 28 ;
    }
  }else if(month === 4|| month ===6 || month ===9 || month === 11){
    dayLong = 30 ;
  }
  return dayLong;
}

