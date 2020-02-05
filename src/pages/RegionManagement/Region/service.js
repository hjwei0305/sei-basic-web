/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-05 08:52:16
*/
import { utils } from 'seid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取树 */
export async function getTree() {
  const url = `${SERVER_PATH}/sei-basic/region/getRegionTree`;
  return request({
    url,
    method: "GET",
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/region/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/region/delete`;
  return request({
    url,
    method: "DELETE",
    params,
  });
}

/** 移动 */
export async function move(params={}) {
  const { nodeId, targetParentId, } = params;
  const url = `${SERVER_PATH}/sei-basic/region/move?nodeId=${nodeId}&targetParentId=${targetParentId}`;
  return request({
    url,
    method: "POST",
  });
}
