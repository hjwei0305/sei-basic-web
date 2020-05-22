import React from 'react';

const BannerTitle = ({ title, subTitle }) => {
  return (
    <>
      {title}
      <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>{subTitle}</span>
    </>
  );
};

export default BannerTitle;
