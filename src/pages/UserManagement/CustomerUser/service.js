/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: Easonon
 * @Last Modified time: 2020-03-06 13:34:588
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取列表 */
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/employee/findAll`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/expertUser/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 冻结 */
export async function freeze(params) {
  const url = `${SERVER_PATH}/sei-basic/expertUser/freeze`;
  return request({
    url,
    method: 'POST',
    params,
  });
}

/**
 * 分配功能角色
 */
export async function assignFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/insertRelations`;
  return request.post(url, data);
}

/**
 * 移除分配的功能角色
 */
export async function unAssignFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 分配数据角色
 */
export async function assignDataRole(data) {
  const url = `${SERVER_PATH}/sei-basic/userDataRole/insertRelations`;
  return request.post(url, data);
}

/**
 * 移除分配的数据角色
 */
export async function unAssignDataRole(data) {
  const url = `${SERVER_PATH}/sei-basic/userDataRole/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}
