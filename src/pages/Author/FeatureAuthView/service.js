import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 通过用户账号获取数据角色列表
 * @param account
 */
export async function getRoleList(params) {
  const url = `${SERVER_PATH}/sei-basic/user/getFeatureRolesByAccount`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
/**
 * 根据功能角色获取已分配功能项树形结构
 * @featureRoleId 功能角色Id
 */
export async function getAssignFeatureItem(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/getFeatureTree`;
  return request({
    url,
    params,
  });
}
