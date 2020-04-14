/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-14 10:49:57
*/
import { utils } from 'suid';
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

/** 重置密码*/
export async function resetPass(data) {
  const url = `${SERVER_PATH}/sei-auth/account/resetPass`;
  return request({
    url,
    method: "POST",
    params: data,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/employee/save`;
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
 * 获得组织机构下所有员工
 *
 * param organizationId 组织机构ID
 */
export async function findByOrganizationId(params={}){
  const url = `${SERVER_PATH}/sei-basic/employee/findByOrganizationId?organizationId=${params.organizationId}`;
  return request.get(url);
}

/**
 * 获得组织机构下所有员工
 *
 */
export async function findByUserQueryParam(data) {
  const url = `${SERVER_PATH}/sei-basic/employee/findByUserQueryParam`;
  return request({
    url,
    method: 'POST',
    data
  });
}



/**
 * 把一个企业用户的功能角色和数据角色复制到多个企业用户
 */
export async function copyToEmployees(data){
  const url = `${SERVER_PATH}/sei-basic/employee/copyToEmployees`;
  return request.post(url, data);
}

/**
 * 分配岗位
 */
export async function assignEmployee(data){
  const url = `${SERVER_PATH}/sei-basic/employeePosition/insertRelations`;
  return request.post(url, data);
}

/**
 * 取消分配岗位
 */
export async function unAssignEmployee(data){
  const url = `${SERVER_PATH}/sei-basic/employeePosition/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
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

/**
 * 保存已经分配功能角色的有效期
 */
export async function saveAssignFeatureRoleCfg(data){
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/saveEffective`;
  return request.post(url, data);
}

/**
 * 保存已经分配数据角色的有效期
 */
export async function saveAssignDataRoleCfg(data){
  const url = `${SERVER_PATH}/sei-basic/userDataRole/saveEffective`;
  return request.post(url, data);
}


