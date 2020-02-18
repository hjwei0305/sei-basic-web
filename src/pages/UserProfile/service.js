/*
* @Author: zp
* @Date:   2020-02-17 11:04:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-17 20:40:31
*/
import { utils } from 'seid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 查询一个用户配置 */
export const findByUserId = (params={}) => {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-basic/userProfile/findByUserId`,
    params,
  })
}

/** 保存一个用户配置 */
export const saveProfile = (data) => {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-basic/userProfile/save`,
    data,
  })
}

/** 获取当前用户邮件通知列表 */
export const findMyEmailAlert = () => {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-basic/userEmailAlert/findMyEmailAlert`,
  })
}

/** 保存当前用户邮件通知列表 */
export const saveEmailAlert = (data) => {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-basic/userEmailAlert/save`,
    data,
  })
}

/** 根据当前用户，创建账户 */
export const createAccount = (data) => {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/create`,
    data,
  })
}

/** 根据当前用户，更新账户 */
export const updateAccount = (data) => {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/udapte`,
    data,
  })
}

/** 更新密码 */
export const updatePwd = (data) => {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/updatePassword`,
    data,
  })
}

