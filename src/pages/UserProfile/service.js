/*
 * @Author: zp
 * @Date:   2020-02-17 11:04:24
 * @Last Modified by: zp
 * @Last Modified time: 2021-11-03 14:48:16
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 查询一个用户配置 */
export const findByUserId = (params = {}) =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-basic/userProfile/findByUserId`,
    params,
  });

/** 保存一个用户配置 */
export const saveProfile = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-basic/userProfile/save`,
    data,
  });

/** 获取当前用户邮件通知列表 */
export const findMyEmailAlert = () =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-basic/userEmailAlert/findMyEmailAlert`,
  });

/** 保存当前用户邮件通知列表 */
export const saveEmailAlert = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-basic/userEmailAlert/save`,
    data,
  });

/** 根据当前用户，创建账户 */
export const createAccount = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/create`,
    data,
  });

/** 根据当前用户，更新账户 */
export const updateAccount = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/udapte`,
    data,
  });

/** 根据当前用户，更新账户 */
export const sendVerifyCode = params =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-auth/verifyCode/sendVerifyCode`,
    params,
  });

/** 绑定帐号 */
export const bindAccount = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/binding`,
    data,
  });

/** 解绑定帐号 */
export const unBindAccount = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/unbinding`,
    data,
  });

/** 获取帐号 */
export const getAccount = params =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-auth/account/getByUserId`,
    params,
  });

/** 更新密码 */
export const updatePwd = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/updatePassword`,
    data,
  });

/** 获取生成二维码配置信息 */
export async function authorizeData(authType = 'weChat') {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-auth/sso/authorizeData?authType=${authType}`,
    headers: {
      needToken: false,
    },
  });
}

/** 通过收款方代码获取银行支付信息 */
export async function findByReceiverCode(params) {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-fim/personalPaymentInfo/findByReceiverCode`,
    params,
  });
}

/** 删除个人支付信息 */
export async function deletePayment({ id }) {
  return request({
    method: 'DELETE',
    url: `${SERVER_PATH}/sei-fim/personalPaymentInfo/delete/${id}`,
  });
}

/** 保存个人支付信息 */
export async function savePayment(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/dms/paymentInfo/save`,
    data,
  });
}
