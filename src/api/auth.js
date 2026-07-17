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
      // GET /api/user 不带参数，后端通过 token 识别用户
      const axiosResponse = await requestUser.get('')
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
  // 发送注册验证码（POST /api/user/email?email=xxx）
  async sendRegisterCode(email) {
    const axiosResponse = await auth.post('/email', null, {
      params: { email }
    })
    return axiosResponse.data
  },

  // 发送登录验证码（同注册，POST /api/user/email?email=xxx）
  async sendLoginCode(email) {
    const axiosResponse = await auth.post('/email', null, {
      params: { email }
    })
    return axiosResponse.data
  },

  // 邮箱验证码登录（POST /api/user/login-email?email=xxx&code=xxx）
  async emailLogin(email, code) {
    const axiosResponse = await auth.post('/login-email', null, {
      params: { email, code }
    })
    return axiosResponse.data
  },

  // 注册（POST /api/user/register-user?code=xxx + body）
  async register(data) {
    const axiosResponse = await auth.post('/register-user', {
      userName: data.userName,
      email: data.email,
      password: data.password
    }, {
      params: { code: data.code }
    })
    return axiosResponse.data
  },

  // 发送忘记密码验证码（POST /api/user/email-updatepw?email=xxx）
  async sendPwdCode(email) {
    const axiosResponse = await auth.post('/email-updatepw', null, {
      params: { email }
    })
    return axiosResponse.data
  },

  // 忘记密码修改（PUT /api/user/password-code?password=xxx&email=xxx&code=xxx）
  async resetPassword(newPwd, email, code) {
    const axiosResponse = await auth.put('/password-code', null, {
      params: { password: newPwd, email, code }
    })
    return axiosResponse.data
  },

  // 已登录用户修改密码（PUT /api/user/password?oldPassWord=xxx&newPassWord=xxx）
  async changePassword(oldPwd, newPwd) {
    const axiosResponse = await requestUser.put('/password', null, {
      params: { oldPassWord: oldPwd, newPassWord: newPwd }
    })
    return axiosResponse.data
  }
}