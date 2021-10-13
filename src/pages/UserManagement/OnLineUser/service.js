import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 强制用户退出 */
export async function forceExit(data) {
  const url = `${SERVER_PATH}/sei-auth/auth/logout`;
  return request({
    url,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
