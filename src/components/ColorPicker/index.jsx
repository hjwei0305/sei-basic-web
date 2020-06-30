import React from 'react';
import cls from 'classnames';
import { SketchPicker } from 'react-color';

import styles from './index.less';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: props.value,
    };
  }

  handleClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    const { onChange } = this.props;
    this.setState({ color: color.rgb }, () => {
      if (onChange) {
        onChange(color.rgb);
      }
    });
  };

  render() {
    const { color, displayColorPicker } = this.state;
    const { r, g, b, a } = color;

    return (
      <div className={cls(styles['color-picker-wrapper'])}>
        <div className={cls('swatch')} onClick={this.handleClick}>
          <div style={{ background: `rgba(${r}, ${g}, ${b}, ${a})` }} className={cls('color')} />
        </div>
        {displayColorPicker ? (
          <div className={cls('popover')}>
            <div className={cls('cover')} onClick={this.handleClose} />
            <SketchPicker color={color} onChangeComplete={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;
