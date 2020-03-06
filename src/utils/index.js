import constants from './constants';
import { utils } from 'suid'
import * as userAuth from './user';


const { storage, constants: seidConstants } = utils;

const getCurrentUserContext = () => {
  const userContext = storage.sessionStorage.get(seidConstants.CONST_GLOBAL.CURRENT_USER) || null;
  return userContext;

};

export {
  constants,
  userAuth as userUtils,
  getCurrentUserContext,
};
