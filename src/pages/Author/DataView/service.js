import { utils } from 'seid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 
 * 通过租户代码和用户账号获取数据角色列表
 * param tenantCode
 * param userAccount
 */
export async function getRoleList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRole/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取已分配的业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getAssignedAuthDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthDatas`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取已分配的树形业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getAssignedAuthTreeDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthTreeDataList`;
  return request({
    url,
    method: "GET",
    params,
  });
}
