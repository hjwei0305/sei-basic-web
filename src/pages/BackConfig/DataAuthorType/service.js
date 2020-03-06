import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取数据权限类型列表*/
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataAuthorizeType/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 数据权限类型保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/dataAuthorizeType/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 数据权限类型删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/dataAuthorizeType/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}
