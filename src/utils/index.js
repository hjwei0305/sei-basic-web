import constants from './constants';
import { utils } from 'seid'

const { storage, constants: seidConstants } = utils;

const getCurrentUserContext = () => {
  const userContext = storage.sessionStorage.get(seidConstants.CONST_GLOBAL.CURRENT_USER) || null;
  return userContext;

};

export {
  constants,
  getCurrentUserContext,
};
