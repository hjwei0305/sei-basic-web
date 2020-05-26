import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import GroupAdd from './components/FeatureGroupForm/Add';
import GroupEdit from './components/FeatureGroupForm/Edit';
import PageFeature from './components/FeaturePage';
import FeatureItem from './components/FeatureItem';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ featureGroup, feature, loading }) => ({ featureGroup, feature, loading }))
class Feature extends Component {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      delGroupId: null,
    };
  }

  componentDidUpdate() {
    const { featureGroup } = this.props;
    const { listData: stateListData } = this.state;
    if (!isEqual(stateListData, featureGroup.listData)) {
      const { listData } = featureGroup;
      this.setState({
        listData,
      });
    }
  }

  reloadFeatureGroupData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureGroup/queryFeatureGroupList',
    });
  };

  saveFeatureGroup = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureGroup/saveFeatureGroup',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'featureGroup/queryFeatureGroupList',
          });
          handlerPopoverHide && handlerPopoverHide();
        }
      },
    });
  };

  delFeatureGroup = (data, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delGroupId: data.id,
      },
      () => {
        dispatch({
          type: 'featureGroup/delFeatureGroup',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delGroupId: null,
              });
              this.reloadFeatureGroupData();
            }
          },
        });
      },
    );
  };

  handlerGroupSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currentFeatureGroup = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'featureGroup/updateState',
      payload: {
        currentFeatureGroup,
      },
    });
    dispatch({
      type: 'feature/updateState',
      payload: {
        showFeatureItem: false,
        currentPageRow: null,
      },
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderCustomTool = () => (
    <>
      <Search
        placeholder="输入代码、名称、应用模块关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerSearch}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delGroupId } = this.state;
    const saving = loading.effects['featureGroup/saveFeatureGroup'];
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <GroupEdit saving={saving} saveFeatureGroup={this.saveFeatureGroup} groupData={item} />
          <Popconfirm
            title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗?' })}
            onConfirm={e => this.delFeatureGroup(item, e)}
          >
            {loading.effects['featureGroup/delFeatureGroup'] && delGroupId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  renderTitle = item => (
    <>
      {item.name}
      <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.code}</span>
    </>
  );

  render() {
    const { loading, featureGroup, feature } = this.props;
    const { currentFeatureGroup } = featureGroup;
    const { currentPageRow, showFeatureItem } = feature;
    const { listData } = this.state;
    const listLoading = loading.effects['featureGroup/queryFeatureGroupList'];
    const saving = loading.effects['featureGroup/saveFeatureGroup'];
    const selectedKeys = currentFeatureGroup ? [currentFeatureGroup.id] : [];
    const featureGroupprops = {
      className: 'left-content',
      title: '功能组',
      showSearch: false,
      loading: listLoading,
      dataSource: listData,
      onSelectChange: this.handlerGroupSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['code', 'name', 'appModuleName'],
      selectedKeys,
      extra: <GroupAdd saving={saving} saveFeatureGroup={this.saveFeatureGroup} />,
      itemField: {
        title: this.renderTitle,
        description: item => item.appModuleName,
      },
      itemTool: this.renderItemAction,
    };
    const pageFeatureProps = {
      currentFeatureGroup,
    };
    const featureItemProps = {
      showFeatureItem,
      currentPageRow,
      currentFeatureGroup,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...featureGroupprops} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {currentFeatureGroup ? (
              <PageFeature {...pageFeatureProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
        <FeatureItem {...featureItemProps} />
      </div>
    );
  }
}
export default Feature;
