/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-09 16:51:37
*/
import { utils } from 'seid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取列表*/
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/employee/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/supplierUser/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/employee/delete`;
  return request({
    url,
    method: "DELETE",
    params,
  });
}

/**
 * 获取所有组织机构 不包括冻结
 * @param params
 * @returns {*}
 */
export async function listAllTree(params={}){
  const url = `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`;
  return request.get(url, params);
}

/**
 * 分配功能角色
 */
export async function assignFeatureRole(data){
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/insertRelations`;
  return request.post(url, data);
}

/**
 * 移除分配的功能角色
 */
export async function unAssignFeatureRole(data){
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
export async function assignDataRole(data){
  const url = `${SERVER_PATH}/sei-basic/userDataRole/insertRelations`;
  return request.post(url, data);
}

/**
 * 移除分配的数据角色
 */
export async function unAssignDataRole(data){
  const url = `${SERVER_PATH}/sei-basic/userDataRole/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}


