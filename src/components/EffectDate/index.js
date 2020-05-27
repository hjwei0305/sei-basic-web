import React, { PureComponent } from 'react';
import cls from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import { ScopeDatePicker, ExtIcon } from 'suid';
import styles from './index.less';

const format = 'YYYY-MM-DD';

class EffectDate extends PureComponent {
  static effectDate = null;

  static propTypes = {
    effectiveFrom: PropTypes.string,
    effectiveTo: PropTypes.string,
    itemId: PropTypes.string,
    onSaveEffectDate: PropTypes.func,
    saving: PropTypes.bool,
    isView: PropTypes.bool,
  };

  static defaultProps = {
    effectiveFrom: '',
    effectiveTo: '',
    isView: false,
  };

  constructor(props) {
    super(props);
    const { effectiveFrom, effectiveTo } = props;
    this.effectDate = [effectiveFrom, effectiveTo];
    this.state = {
      saveItemId: null,
      editEffectDate: false,
    };
  }

  handlerSetEffectDate = e => {
    e && e.stopPropagation();
    this.setState({ editEffectDate: true });
  };

  handlerSetEffectDateCancel = () => {
    this.setState({ editEffectDate: false });
  };

  handlerSetEffectDateSave = itemId => {
    if (
      (this.effectDate &&
        this.effectDate.length === 2 &&
        this.effectDate[0] &&
        this.effectDate[1]) ||
      (!this.effectDate[0] && !this.effectDate[1])
    ) {
      this.setState(
        {
          saveItemId: itemId,
        },
        () => {
          const { onSaveEffectDate } = this.props;
          const data = {
            id: itemId,
            effectiveFrom: this.effectDate[0],
            effectiveTo: this.effectDate[1],
          };
          onSaveEffectDate(data);
        },
      );
    } else {
      message.destroy();
      message.error('开始日期和结束日期，必须同时有值或者同时为空');
    }
  };

  handlerEffectDateChange = d => {
    this.effectDate = d;
  };

  renderView = () => {
    const { effectiveFrom, effectiveTo, isView } = this.props;
    if (effectiveFrom && effectiveTo) {
      return (
        <div className="effect-body" onClick={e => e.stopPropagation()}>
          <div className="field-item info">
            <span className="label">有效期</span>
            <span className="value">{`${effectiveFrom} 至 ${effectiveTo}`}</span>
          </div>
          {!isView ? (
            <ExtIcon
              style={{ marginLeft: 8 }}
              className="btn"
              onClick={this.handlerSetEffectDate}
              type="edit"
              antd
            />
          ) : null}
        </div>
      );
    }
    if (!isView) {
      return (
        <Button type="link" style={{ padding: 0 }} onClick={e => this.handlerSetEffectDate(e)}>
          设置有效期
        </Button>
      );
    }
  };

  renderSaveBtn = itemId => {
    const { saving } = this.props;
    const { saveItemId } = this.state;
    if (saving && saveItemId === itemId) {
      return <ExtIcon style={{ marginLeft: 8 }} className="btn" type="loading" antd />;
    }
    return (
      <ExtIcon
        style={{ marginLeft: 8 }}
        className="btn save"
        onClick={() => this.handlerSetEffectDateSave(itemId)}
        type="check"
        antd
      />
    );
  };

  render() {
    const { editEffectDate } = this.state;
    const { effectiveFrom, effectiveTo, itemId } = this.props;
    const defaultValue =
      effectiveFrom && effectiveTo
        ? [moment().format(effectiveFrom), moment().format(effectiveTo)]
        : [];
    const scopeDatePickerProps = {
      allowClear: true,
      format,
      value: defaultValue,
      splitStr: '至',
      onChange: this.handlerEffectDateChange,
      style: { width: 320 },
    };
    return (
      <div className={cls(styles['effect-box'])}>
        {editEffectDate ? (
          <div className="effect-body" onClick={e => e.stopPropagation()}>
            <div className="field-item info">
              <span className="label">有效期</span>
              <ScopeDatePicker {...scopeDatePickerProps} />
              <ExtIcon
                style={{ marginLeft: 8 }}
                className="btn cancel"
                onClick={this.handlerSetEffectDateCancel}
                type="close"
                antd
              />
              {this.renderSaveBtn(itemId)}
            </div>
          </div>
        ) : (
          this.renderView()
        )}
      </div>
    );
  }
}

export default EffectDate;
