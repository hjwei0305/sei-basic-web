/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: Eason
 * @Last Modified time: 2020-03-06 13:34:26
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取数据字典类型 */
export async function getDataDictTypes() {
  const url = `${SERVER_PATH}/sei-basic/dataDict/findByPage`;
  return request({
    url,
    method: "GET",
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/dataDict/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(id) {
  const url = `${SERVER_PATH}/sei-basic/dataDict/delete/${id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 获取字典行项目 */
export async function getDataDictItems(params) {
  const url = `${SERVER_PATH}/sei-basic/dataDict/getDataDictItems`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 保存字典行项目 */
export async function saveDictItem(data) {
  const url = `${SERVER_PATH}/sei-basic/dataDict/saveDictItem`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除字典行项目 */
export async function deleteDictItem(id) {
  const url = `${SERVER_PATH}/sei-basic/dataDict/deleteDictItem/${id}`;
  return request({
    url,
    method: "DELETE",
  });
}
