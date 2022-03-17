import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取访问周期
 */
export async function getPeriods() {
  const url = `${SERVER_PATH}/sei-auth/accessRecord/getPeriods`;
  return request({
    url,
    method: 'GET',
  });
}
