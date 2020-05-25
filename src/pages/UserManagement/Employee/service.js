/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: Easonon
 * @Last Modified time: 2020-03-06 13:34:411
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/employee/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 重置密码 */
export async function resetPassword(data) {
  const url = `${SERVER_PATH}/sei-auth/account/resetPass`;
  return request({
    url,
    method: 'POST',
    params: data,
  });
}

/**
 * 获取所有组织机构 不包括冻结
 * @param params
 * @returns {*}
 */
export async function listAllTree() {
  const url = `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`;
  return request({
    url,
    method: 'GET',
  });
}

/**
 * 把一个企业用户的功能角色和数据角色复制到多个企业用户
 */
export async function copyToEmployees(data) {
  const url = `${SERVER_PATH}/sei-basic/employee/copyToEmployees`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 分配岗位 企业员工
 */
export async function assignStation(data) {
  const url = `${SERVER_PATH}/sei-basic/employeePosition/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 取消分配岗位 企业员工
 */
export async function unAssignStation(data) {
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
export async function assignFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
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
  return request({
    url,
    method: 'POST',
    data,
  });
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
