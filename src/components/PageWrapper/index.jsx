import React from 'react';
import cls from 'classnames';
import styles from './index.less';

const PageWrapper = (props) => {
  const { children, className, } = props;
  return (
    <div className={cls(styles['sei-page-warpper'], className)}>
      {children}
    </div>
  )
}

export default PageWrapper;
