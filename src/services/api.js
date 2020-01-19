import { utils } from 'seid'
import { constants } from "@/utils";

const { request } = utils;
const { SERVER_PATH } = constants;

/** 登录*/
export async function login(params) {
  const url = `${SERVER_PATH}/sei-auth/auth/login`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    data: params,
  });
}

/** 退出*/
export async function logout(params) {
  const url = `${SERVER_PATH}/sei-auth/auth/logout`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    data: params,
  });
}

