import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/supplierUser/saveSupplierUserVo`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/supplierUser/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
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

/**
 * 保存已经分配功能角色的有效期
 */
export async function saveAssignFeatureRoleEffective(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/saveEffective`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 保存已经分配数据角色的有效期
 */
export async function saveAssignDataRoleEffective(data) {
  const url = `${SERVER_PATH}/sei-basic/userDataRole/saveEffective`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
