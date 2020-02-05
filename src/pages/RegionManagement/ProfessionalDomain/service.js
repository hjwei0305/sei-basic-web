/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-05 14:59:20
*/
import { utils } from 'seid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取树 */
export async function getTree() {
  const url = `${SERVER_PATH}/sei-basic/professionalDomain/getDomainTree`;
  return request({
    url,
    method: "GET",
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/professionalDomain/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/professionalDomain/delete`;
  return request({
    url,
    method: "DELETE",
    params,
  });
}

/** 移动 */
export async function move(params={}) {
  const { nodeId, targetParentId, } = params;
  const url = `${SERVER_PATH}/sei-basic/professionalDomain/move?nodeId=${nodeId}&targetParentId=${targetParentId}`;
  return request({
    url,
    method: "POST",
  });
}
