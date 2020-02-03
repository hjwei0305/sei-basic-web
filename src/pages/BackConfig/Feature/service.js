import { utils } from 'seid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取功能项组列表*/
export async function getFeatureGroupList(params) {
  const url = `${SERVER_PATH}/sei-basic/featureGroup/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 功能项组保存 */
export async function saveFeatureGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/featureGroup/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 功能项组删除 */
export async function delFeatureGroup(params) {
  const url = `${SERVER_PATH}/sei-basic/featureGroup/delete`;
  return request({
    url,
    method: "DELETE",
    params,
  });
}

/** 功能项保存 */
export async function saveFeature(data) {
  const url = `${SERVER_PATH}/sei-basic/feature/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 功能项删除 */
export async function delFeature(params) {
  const url = `${SERVER_PATH}/sei-basic/feature/delete`;
  return request({
    url,
    method: "DELETE",
    params,
  });
}
