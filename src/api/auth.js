import axios from 'axios'
import {requestUser} from './requst';


const API_URL = '/api/user';
const auth = axios.create({
  baseURL: API_URL,
});

export default {
  // 账号密码登录
  async loginWithUsername(account, passwd, remember) {
    try{
    // 1. 发请求
    const axiosResponse = await auth.post('/login', {
      msg: '密码登录',
      account: account,
      passwd: passwd,
      remember: remember
    })
    // 取出数据数据返回前端
    return axiosResponse.data;
    
  }catch(error){
    console.error('登录失败',error.response?.data);
    throw error;
  }},

  //查询当前用户id
  async selectuserId(){
    try{
      //调用拦截器
      const axiosResponse = await requestUser.get('/me')
      return axiosResponse.data;
    }catch(error){
      console.log('查询失败',error.response?.data);
      throw error;
    }
  },
  //根据用户id查询用户信息
  async selectuserdate(userId){
    try{
      // GET /api/user 不需要参数，自动返回当前登录用户信息
      const axiosResponse = await requestUser.get('/')
      return axiosResponse.data
    }catch(error){
      console.log('查询失败',error.response?.data);
      throw error;
    }
  },

  //修改用户名
  async updateUsername(username){
    try{
      //调用拦截器加上token
      const axiosResponse = await requestUser.put('/username',null,{
        params:{
        username:username
      }})

      return axiosResponse.data

    }catch(error){
      console.error('修改失败',error.response?.data);
      throw error;
    }
  },
  //删除用户
  async deleteUser(userId){
    try{
      const axiosResponse = await requestUser.delete(`/${userId}`)
      return axiosResponse.data
    }catch(error){
      console.error('修改失败',error.response?.data);
      throw error;
    }
  },
  // 发送注册验证码
  async sendRegisterCode(email) {
    const axiosResponse = await auth.post('/register/send-code', {
      msg: '创建用户发送验证码',
      e_mail: email
    })
    return axiosResponse.data
  }
}