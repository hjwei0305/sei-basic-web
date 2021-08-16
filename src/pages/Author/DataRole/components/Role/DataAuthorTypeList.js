import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Card, Button } from 'antd';
import { ExtTable, ExtIcon, ComboList } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import AssignView from './AssignView';
import DataAuthorAssignModal from './DataAuthorAssign';
import styles from './DataAuthorTypeList.less';

const { SERVER_PATH } = constants;

@connect(({ dataRole, loading }) => ({ dataRole, loading }))
class DataAuthorTypeList extends PureComponent {
  static dataAutorTypeTableRef;

  constructor(props) {
    super(props);
    this.state = {
      currentAppModuleId: null,
    };
  }

  reloadData = () => {
    if (this.dataAutorTypeTableRef) {
      this.dataAutorTypeTableRef.remoteDataRefresh();
    }
  };

  handlerShowDataAuthorAssign = dataAuthorType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataRole/updateState',
      payload: {
        showDataAuthorAssign: true,
        currentDataAuthorType: dataAuthorType,
      },
    });
  };

  renderAssignView = record => {
    const { dataRole } = this.props;
    const { currentRole } = dataRole;
    return (
      <>
        <span className={cls('action-box')}>
          <AssignView currentDataAuthorType={record} currentRole={currentRole} />
          <ExtIcon
            type="file-add"
            onClick={() => this.handlerShowDataAuthorAssign(record)}
            antd
            tooltip={{ title: '配置权限' }}
          />
        </span>
      </>
    );
  };

  render() {
    const { dataRole } = this.props;
    const { currentRole } = dataRole;
    const { currentAppModuleId } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: formatMessage({id: 'basic_000019', defaultMessage: '操作'}) }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => this.renderAssignView(record),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 200,
        optional: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '应用模块',
        dataIndex: 'appModuleName',
        width: 200,
      },
      {
        title: '树形结构',
        dataIndex: 'beTree',
        width: 120,
        align: 'center',
        required: true,
        render: (text, record) => {
          if (record.beTree) {
            return <ExtIcon type="check" antd />;
          }
          return null;
        },
      },
    ];
    const appModulePros = {
      style: { width: 220 },
      allowClear: true,
      placeholder: '所有应用模块',
      store: {
        url: `${SERVER_PATH}/sei-basic/tenantAppModule/getTenantAppModules`,
      },
      afterSelect: item => {
        this.setState({
          currentAppModuleId: item.id,
        });
      },
      afterClear: () => {
        this.setState({
          currentAppModuleId: null,
        });
      },
      reader: {
        name: 'name',
        description: 'code',
      },
    };
    const toolBarProps = {
      layout: {
        leftSpan: 14,
        rightSpan: 10,
      },
      left: (
        <>
          <div className="app-module-box">
            <span className="label">应用模块</span>
            <ComboList {...appModulePros} />
          </div>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      cascadeParams: { roleId: currentRole ? currentRole.id : null },
      onTableRef: ref => (this.dataAutorTypeTableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-basic/dataAuthorizeType/getByDataRole`,
      },
      sort: {
        field: { name: null, beTree: null, appModuleName: 'asc' },
      },
    };
    if (currentAppModuleId) {
      extTableProps.store = {
        url: `${SERVER_PATH}/sei-basic/dataAuthorizeType/getByAppModuleAndDataRole`,
      };
      extTableProps.cascadeParams.appModuleId = currentAppModuleId;
    }
    return (
      <div className={cls(styles['data-author-type-box'])}>
        <Card
          title={<BannerTitle title={currentRole.name} subTitle="数据权限类型" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <DataAuthorAssignModal />
      </div>
    );
  }
}

export default DataAuthorTypeList;
