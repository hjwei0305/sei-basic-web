import React, { useCallback, useMemo } from 'react';
import { connect, useSelector, useDispatch } from 'dva';
import { get } from 'lodash';
import { Radio } from 'antd';
import { MoneyInput, PageLoader, Space } from 'suid';
import { FilterView, DropdownOption } from '@/components';
import styles from './index.less';
import Feature from './Feature';
import Personnel from './Personnel';

let localeTopNum;

const AccessLog = props => {
  const { loading } = props;
  const dispatch = useDispatch();
  const { periods, currentPeriod, byTypes, currentByType, topNum } = useSelector(
    sel => sel.accessLog,
  );

  const handlerPeriodTypeChange = useCallback(
    p => {
      dispatch({
        type: 'accessLog/updateState',
        payload: {
          currentPeriod: p,
        },
      });
    },
    [dispatch],
  );

  const handlerByTypeChange = useCallback(
    t => {
      const [byType] = byTypes.filter(it => it.value === t.target.value);
      dispatch({
        type: 'accessLog/updateState',
        payload: {
          currentByType: byType,
        },
      });
    },
    [byTypes, dispatch],
  );

  const handlerTopNumChange = useCallback(
    count => {
      localeTopNum = count;
      dispatch({
        type: 'accessLog/updateState',
        payload: {
          topNum: count,
        },
      });
    },
    [dispatch],
  );

  const handlerLocalTopNumChange = useCallback(count => {
    localeTopNum = count;
  }, []);

  const handlerLocalTopNumSubmit = useCallback(() => {
    handlerTopNumChange(localeTopNum);
  }, [handlerTopNumChange]);

  const renderByTypeFilter = useMemo(() => {
    const { value } = currentByType;
    return (
      <span className="filter-by-type">
        <span className="label">维度</span>
        <Radio.Group onChange={handlerByTypeChange} defaultValue={value} size="small">
          {byTypes.map(it => (
            <Radio.Button key={it.value} value={it.value}>
              {it.title}
            </Radio.Button>
          ))}
        </Radio.Group>
      </span>
    );
  }, [byTypes, currentByType, handlerByTypeChange]);

  const renderView = useMemo(() => {
    const byType = get(currentByType, 'value');
    const period = get(currentPeriod, 'value');
    const comProps = { period, topNum };
    if (byType === 'Feature') {
      return <Feature {...comProps} />;
    }
    if (byType === 'Personnel') {
      return <Personnel {...comProps} />;
    }
  }, [topNum, currentByType, currentPeriod]);

  const renderCountNum = useMemo(() => {
    return (
      <span style={{ marginLeft: 8 }}>
        <span className="label">排名数(Top)</span>
        <MoneyInput
          size="small"
          onBlur={handlerLocalTopNumSubmit}
          onChange={handlerLocalTopNumChange}
          value={topNum}
          precision={0}
          textAlign="left"
          style={{ width: 50, top: 9, left: 2, zIndex: 1 }}
        />
        <DropdownOption suffix="" interval={topNum} onChange={handlerTopNumChange} />
      </span>
    );
  }, [handlerLocalTopNumSubmit, handlerLocalTopNumChange, topNum, handlerTopNumChange]);

  const renderContent = useMemo(() => {
    if (loading.effects['accessLog/getPeriods']) {
      return <PageLoader />;
    }
    return (
      <div>
        <div className="tool-box">
          <Space>
            <FilterView
              title="访问周期"
              iconType=""
              style={{ minWidth: 140 }}
              currentViewType={currentPeriod}
              viewTypeData={periods}
              rowKey="value"
              onAction={handlerPeriodTypeChange}
              reader={{
                title: 'name',
                value: 'value',
              }}
            />
            {renderByTypeFilter}
            {renderCountNum}
          </Space>
        </div>
        <div className="log-body"> {renderView}</div>
      </div>
    );
  }, [
    currentPeriod,
    handlerPeriodTypeChange,
    loading.effects,
    periods,
    renderByTypeFilter,
    renderCountNum,
    renderView,
  ]);

  return <div className={styles['container-box']}>{renderContent}</div>;
};

export default connect(({ accessLog, loading }) => ({ accessLog, loading }))(AccessLog);
