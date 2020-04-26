import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取权限对象列表 */
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/authorizeEntityType/findAll`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 权限对象保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/authorizeEntityType/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 权限对象删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/authorizeEntityType/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
