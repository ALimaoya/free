/**
 * Created by jiachenpan on 16/11/18.
 */



/* 合法url*/
export function validateURL(textval) {
  const urlregex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ ;
  // const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
/*获取字符串中多个url*/
export function httpString(s) {
  // var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  //var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
  //v = v.replace(reg, "<a href='$1$2'>$1$2</a>"); //这里的reg就是上面的正则表达式
  //s = s.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
  s = s.match(reg);
  // console.log(s)
  return(s)
}
/*QQ号验证*/
export function validQQ(str){
  const reg = /^[1-9][0-9]{4,16}$/;
  return reg.test(str) ;
}
 /*微信验证*/
export function validateWX(str){
  const reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
  return reg.test(str)
}

/*手机号验证*/
export function validatePhone(val){
  const reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/ ;
  return reg.test(val)
}
/*邮箱验证*/
export function validateEmail(val){
  const email = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/ ;
  return email.test(val)
}
/*邮编验证*/
export function validateZipCode(val){
  const reg = /^[1-9][0-9]{5}$/ ;
  return reg.test(val)
}
/*身份证号验证*/
export function validateIDCard(val){
  const reg =  /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/ ;
  return reg.test(val);
}
/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/*短信验证码*/
export function validateCode(textval) {
  const urlregex = /^[0-9]{6}$/
  return urlregex.test(textval)
}

/*图片验证码*/
export function validateCaptcha(str){
    const reg =  /^[0-9A-Za-z]{4}$/;
    return reg.test(str)
}
/*登录注册密码*/
export function validPassWord(str){
  const reg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/;
  return reg.test(str)
}
/*验证姓名*/
export function validName(str){
  const reg =  /^[\u4e00-\u9fa5]+$/;
  return reg.test(str)
}
/*获取url参数*/
export function getQueryString(url,name) {

  let obj = new Object();
  let url0 = url.split('?')[1];
  let urlArr = url0.split('&');
  urlArr.forEach( (i) => {
     obj[i.split('=')[0]] = i.split('=')[1];
  });
  return obj[name];

  // return null;
}

/*验证数字、字母及汉字，符号只能为@ 及小数点*/
export function checkInput(value){
  // const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/ ;
  const reg = new RegExp("[`~!@#$^*()=|{}':;',\\[\\].<>/?~！@#￥……*（）——|{}【】‘；：”“'。，、？]");

  return reg.test(value)
}

/*验证输入数值有小数点时不能超过两位小数*/
export function checkFloat(value){
  const reg = /^(0|[1-9][0-9]*)+(\.\d{1,2})?$/ ;
  return reg.test(value) ;
}
