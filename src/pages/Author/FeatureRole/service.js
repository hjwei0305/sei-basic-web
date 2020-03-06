import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取功能角色组列表*/
export async function getRoleGroupList(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleGroup/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 功能角色组保存 */
export async function saveRoleGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleGroup/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 功能角色组删除 */
export async function delRoleGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleGroup/delete/${data.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 
 * 根据角色组id获取功能角色列表
 * param roleGroupId
*/
export async function getFeatureRoleList(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/findByFeatureRoleGroup`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 功能角色保存 */
export async function saveFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 功能角色删除 */
export async function delFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/delete/${data.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 为功能角色分配功能项 */
export async function assignFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/insertRelations`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 功能角色移除已分配的功能项 */
export async function removeAssignedFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/removeRelations`;
  return request({
    url,
    method: "DELETE",
    data,
  });
}

/** 获取功能角色未分配的功能项 */
export async function getUnAssignedFeatureItemList(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/getUnassigned`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 根据功能角色的id获取已分配的用户
 * params featureRoleId
 */
export async function getAssignedEmployeesByFeatureRole(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/getAssignedEmployeesByFeatureRole`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 根据功能角色的id获取已分配的岗位
 * params featureRoleId
*/
export async function getAssignedPositionsByFeatureRole(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/getAssignedPositionsByFeatureRole`;
  return request({
    url,
    method: "GET",
    params,
  });
}


