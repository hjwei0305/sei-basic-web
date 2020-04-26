/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: Eason
 * @Last Modified time: 2020-03-06 13:34:34
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取树 */
export async function getTree() {
  const url = `${SERVER_PATH}/sei-basic/organization/findOrgTree`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/organization/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/organization/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
