import * as React from 'react';
import { Col } from 'antd';
import './index.less';

const Footer = () => {
  return (
    <Col className={'footer'}>
      Powered by{' '}
      <a target="_blank" rel="noopener noreferrer" href="https://untanglestrategy.com/">
        <span className="text-danger">Untangle</span>
        <span style={{ color: 'grey' }}>_</span>
      </a>
    </Col>
  );
};
export default Footer;
