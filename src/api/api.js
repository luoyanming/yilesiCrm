/**
 * Created by UI150730 on 2017/4/17.
 */
import axios from 'axios/dist/axios.min';
var qs = require('qs');

// let base = 'http://wwwdev.yls.com/privateapi';
 let base = 'http://crm.yilesi.cn/privateapi';

let header = {'content-type': 'application/x-www-form-urlencoded'}

// 判断是否登陆
export const isLogin = params => { return axios.post(`${base}/isLogin`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 登录
export const doLogin = params => { return axios.post(`${base}/doLogin`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 登出
export const doLogout = params => { return axios.post(`${base}/doLogout`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 订单列表
export const orderList = params => { return axios.post(`${base}/courseOrder/getOrderList`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 课程列表
export const courseList = params => { return axios.post(`${base}/course/getCourseList`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 类型、标签
export const courseAddTypes = params => { return axios.post(`${base}/course/getCourseAddTypes`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 课程详情
export const courseDetail = params => { return axios.post(`${base}/course/getCourseDetail`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 课程新增、编辑
export const courseModify = params => { return axios.post(`${base}/course/courseModify`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 上传图片(封面、截图)、附件
export const uploadFiles = params => { return axios.post(`${base}/course/uploadFiles`, qs.stringify(params), {headers:header}).then(res => res.data); };
// 上下架
export const updateCourseStatus = params => { return axios.post(`${base}/course/updateCourseStatus`, qs.stringify(params), {headers:header}).then(res => res.data); };
