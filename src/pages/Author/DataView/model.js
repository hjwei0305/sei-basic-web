import {
    getRoleList,
    getAssignedAuthDataList,
    getAssignedAuthTreeDataList,
} from "./service";
import { message } from "antd";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
    namespace: "role",

    state: {
        listData: [],
        currentRole: null,
        assignData: [],
        unAssignData: [],
    },
    effects: {
        * getRoleList({ payload }, { call, put }) {
            const re = yield call(getRoleList, payload);
            if (re.success) {
                yield put({
                    type: "updateState",
                    payload: {
                        listData: re.data
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
