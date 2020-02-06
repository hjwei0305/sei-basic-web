/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-06 13:52:39
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
  const url = `${SERVER_PATH}/sei-basic/region/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 移动 */
export async function move(data) {
  const url = `${SERVER_PATH}/sei-basic/region/move`;
  return request({
    url,
    method: "POST",
    data,
  });
}
