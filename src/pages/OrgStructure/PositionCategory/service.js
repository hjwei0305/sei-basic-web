/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: Easonon
 * @Last Modified time: 2020-03-06 13:34:444
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取列表*/
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/positionCategory/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/positionCategory/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/positionCategory/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}
