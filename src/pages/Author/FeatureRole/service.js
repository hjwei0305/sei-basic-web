import { utils } from 'seid';
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
export async function delRoleGroup(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleGroup/delete`;
  return request({
    url,
    method: "DELETE",
    data: params.id,
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
export async function delFeatureRole(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/delete`;
  return request({
    url,
    method: "DELETE",
    data: params.id,
  });
}