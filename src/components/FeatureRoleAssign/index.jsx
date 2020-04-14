import React, { Component, Fragment, } from 'react';
import { Button, } from "antd";
import { ExtTable, ComboGrid, ExtIcon, } from 'suid';
import cls from 'classnames';
import { AssignLayout } from '@/components';
import CfgModal from './CfgModal';
import { constants } from "@/utils";

const { SERVER_PATH } = constants;

class FeatureRoleConfig extends Component {

  constructor(props) {
    super(props);
    const { unAssignCfg, } = props;
    const { unAssignedUrl, } = unAssignCfg;
    this.state = {
      assignBtnDisabled: true,
      unAssignBtnDisabled: true,
      featureRoleGroupId: null,
      unAssignUrl: unAssignedUrl,
      assignChildIds: [],
      unAssignChildIds: [],
      cfgModalVisible: false,
    };
  }

  handleCheck = (e) => {
    const { checked } = e.target;
    this.setState({
      includeSubNode: checked,
    }, () => {
      if (this.unAssignTable) {
        this.unAssignTable.remoteDataRefresh();
      }
    });
  }

  handleUnAssign = () => {
    const { onUnAssign, data, } = this.props;
    const { assignChildIds, } = this.state;
    const { id: parentId, } = data;
    if (onUnAssign) {
      onUnAssign({ parentId, childIds: assignChildIds, }).then(res => {
        this.setState({
          unAssignBtnDisabled: true,
          assignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  }

  handleAssign = () => {
    const { onAssign, data, } = this.props;
    const { unAssignChildIds } = this.state;
    const { id: parentId, } = data;
    if (onAssign) {
      onAssign({ parentId, childIds: unAssignChildIds, }).then(res => {
        this.setState({
          assignBtnDisabled: true,
          unAssignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  }

  getComboGridProps = () => {
    const { unAssignCfg, } = this.props;
    const { unAssignedUrl, unAssignedByIdUrl, } = unAssignCfg;

    return {
      allowClear: true,
      placeholder: '请选择功能角色组',
      rowKey: "id",
      name: 'roleGroupName',
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRoleGroup/findAll`,
      },
      reader: {
        name: 'name',
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      style: { width: 240, marginRight: 15, },
      afterSelect: (rowData) => {
        if (rowData) {
          this.setState({
            featureRoleGroupId: rowData.id,
            unAssignUrl: unAssignedByIdUrl,
          }, () => {
            if (this.unAssignTable) {
              this.unAssignTable.remoteDataRefresh();
            }
          });
        }
      },
      afterClear: () => {
        this.setState({
          unAssignUrl: unAssignedUrl,
          featureRoleGroupId: undefined,
        }, () => {
          if (this.unAssignTable) {
            this.unAssignTable.remoteDataRefresh();
          }
        });
      }
    };
  }

  getCommonColumns = () => {

    return [
      {
        title: "角色代码",
        dataIndex: "code",
        width: 180,
        required: true,
      },
      {
        title: "角色名称",
        dataIndex: "name",
        width: 180,
        required: true,
      },
    ];
  }

  refreshTableData = () => {
    if (this.unAssignTable) {
      this.unAssignTable.remoteDataRefresh();
    }
    if (this.assignTable) {
      this.assignTable.remoteDataRefresh();
    }
  }

  handleConfig = (record) => {
    this.setState({
      cfgModalVisible: true,
      editData: record,
    });
  }

  /** 未分配表格属性 */
  getUnAssignTableProps = () => {
    const { featureRoleGroupId, unAssignUrl, unAssignChildIds } = this.state;
    const { data, unAssignCfg, } = this.props;
    const { unAssignedUrl, byIdKey, } = unAssignCfg;
    const { id, } = data || {};
    const toolBarProps = {
      layout: {
        leftSpan: 16,
        rightSpan: 8,
      },
      left: (
        <Fragment>
          <ComboGrid {...this.getComboGridProps()}/>
        </Fragment>
      )
    };

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: unAssignChildIds,
      columns: this.getCommonColumns(),
      toolBar: toolBarProps,
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.setState({
            assignBtnDisabled: false,
            unAssignChildIds: rowIds,
          });
        } else {
          this.setState({
            assignBtnDisabled: true,
            unAssignChildIds: [],
          });
        }
      },
      store: {
        params: unAssignUrl === unAssignedUrl ? {
          parentId: id,
        } : {
          [byIdKey]: id,
          featureRoleGroupId,
        },
        url: unAssignUrl,
      },
    };
  }

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data, assginCfg, cfged, } = this.props;
    const { assignChildIds, } = this.state;
    const { url } = assginCfg;
    const { id, } = data || {};
    const columns = this.getCommonColumns();
    if (cfged) {
      columns.unshift({
        title: '操作',
        width: 60,
        className: "action",
        dataIndex: 'id',
        required: true,
        render: (_, record) => (
          <span className={cls("action-box")}>
            <ExtIcon
              className="tool"
              onClick={e => {this.handleConfig(record); e.stopPropagation();}}
              type="tool"
              tooltip={
                { title: '配置有效期' }
              }
              antd
            />
          </span>
        )
      });
      columns.push({
        title: '有效期',
        dataIndex: 'effective',
        width: 220,
        render: (_, record) => {
          const { effectiveFrom, effectiveTo, } = record;
          if (effectiveFrom) {
            return `${effectiveFrom} ~ ${effectiveTo}`;
          }
          return ``;
        }
      });
    }

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: assignChildIds,
      columns,
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.setState({
            unAssignBtnDisabled: false,
            assignChildIds: rowIds,
          });
        } else {
          this.setState({
            unAssignBtnDisabled: true,
            assignChildIds: [],
          });
        }
      },
      loading: false,
      store: {
        params: {
          parentId: id,
        },
        url,
      },
    };
  }

  getCfgModalProps = () => {
    const { cfgModalVisible: visible, editData,  } = this.state;
    const { onSaveCfg, cfgLoading } = this.props;

    return  {
      editData,
      visible,
      saving: cfgLoading,
      onSave: (data) => {
        if (onSaveCfg) {
          onSaveCfg(data).then(result => {
            const { success, } = result || {};
            if (success) {
              this.setState({
                editData: null,
                cfgModalVisible: false,
              }, () => {
                this.refreshTableData();
              });
            }
          });
        }
      },
      onCancel: () => {
        this.setState({
          editData: null,
          cfgModalVisible: false,
        });
      }
    };
  }

  render() {
    const { cfged } = this.props;
    const { assignBtnDisabled, unAssignBtnDisabled, cfgModalVisible, } = this.state;
    return (
      <AssignLayout>
        <ExtTable onTableRef={inst => this.unAssignTable = inst } slot="left" {...this.getUnAssignTableProps()} />
        <div slot="center">
          <Fragment>
            <p>
              <Button
                onClick={this.handleUnAssign}
                disabled={unAssignBtnDisabled}
                shape="circle"
                icon="left"
              />
            </p>
            <p>
              <Button
                onClick={this.handleAssign}
                disabled={assignBtnDisabled}
                shape="circle"
                icon="right"
              />
            </p>
          </Fragment>
        { cfged && cfgModalVisible ? (<CfgModal {...this.getCfgModalProps()} />) : null }
        </div>
        <ExtTable onTableRef={inst => this.assignTable = inst } slot="right" {...this.getAssignTableProps()} />
        
      </AssignLayout>
    );
  }
}

export default FeatureRoleConfig;
