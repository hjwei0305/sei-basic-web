import { utils } from 'seid';
import {constants} from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取业务模块列表*/
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/appModule/findAll`;
  return request({
    url,
    method: "GET",
    data: params
  });
}

/** 业务模保存 */
export async function save(params) {
  const url = `${SERVER_PATH}/sei-basic/appModule/save`;
  return request({
    url,
    method: "POST",
    data: { ...params.data }
  });
}

/** 业务模删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/appModule/delete`;
  return request({
    url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    data: params.id
  });
}
