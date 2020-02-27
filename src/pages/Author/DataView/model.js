import {
    getRoleList,
    getDataAuthorTypeList,
    getAssignedAuthDataList,
    getAssignedAuthTreeDataList,
} from "./service";
import { message } from "antd";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
    namespace: "dataView",

    state: {
        roleList: [],
        dataAuthorTypeList: [],
        currentRoleId: null,
        currentDataAuthorType: null,
        assignData: [],
    },
    effects: {
        * getRoleList({ payload }, { call, put }) {
            const re = yield call(getRoleList, payload);
            if (re.success) {
                yield put({
                    type: "updateState",
                    payload: {
                        roleList: re.data
                    }
                });
            } else {
                message.error(re.message);
            }
        },
        * getDataAuthorTypeList({ payload }, { call, put }) {
            const re = yield call(getDataAuthorTypeList, payload);
            if (re.success) {
                yield put({
                    type: "updateState",
                    payload: {
                        dataAuthorTypeList: re.data
                    }
                });
            } else {
                message.error(re.message);
            }
        },
        * getAssignedAuthDataList({ payload }, { call, put }) {
            const re = yield call(getAssignedAuthDataList, payload);
            if (re.success) {
                yield put({
                    type: "updateState",
                    payload: {
                        assignData: re.data
                    }
                });
            } else {
                message.error(re.message);
            }
        },
        * getAssignedAuthTreeDataList({ payload }, { call, put }) {
            const re = yield call(getAssignedAuthTreeDataList, payload);
            if (re.success) {
                yield put({
                    type: "updateState",
                    payload: {
                        assignData: re.data
                    }
                });
            } else {
                message.error(re.message);
            }
        },
    }
});
