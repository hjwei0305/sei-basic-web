import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取所有组织机构 */
export async function getOrgList() {
  const url = `${SERVER_PATH}/sei-basic/organization/findOrgTree`;
  return request({
    url,
    method: 'GET',
  });
}

/** 组织机构项保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/organization/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 组织机构项删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/organization/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
