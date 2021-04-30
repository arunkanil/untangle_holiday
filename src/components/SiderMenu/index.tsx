import './index.less';

import * as React from 'react';

import { Avatar, Col, Icon, Layout, Menu } from 'antd';
import { L, isGranted } from '../../lib/abpUtility';

import AbpLogo from '../../images/logo.svg';
import { appRouters } from '../../components/Router/router.config';

const { Sider } = Layout;
const { SubMenu } = Menu;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      className={'sidebar'}
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      {collapsed ? (
        <Col onClick={() => history.push('/my_profile')} style={{ textAlign: 'center', marginTop: 15, marginBottom: 10, cursor: 'pointer' }}>
          <Avatar shape="square" style={{ height: 27, width: 70, borderRadius: 0 }} src={AbpLogo} />
        </Col>
      ) : (
        <Col onClick={() => history.push('/my_profile')} style={{ textAlign: 'center', marginTop: 15, marginBottom: 10, cursor: 'pointer' }}>
          <Avatar shape="square" style={{ height: 54, width: 185, borderRadius: 0 }} src={AbpLogo} />
        </Col>
      )}

      <Menu theme="dark" mode="inline">
        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu && !item.innerMenu)
          .map((route: any, index: number) => {
            if (route.permission && !isGranted(route.permission)) return null;
            if (route.name == 'create_leave_request' && localStorage.getItem('userName') == 'admin') return null;
            if (route.name == 'my_profile' && localStorage.getItem('userName') == 'admin') return null;
            if (route.name == 'leave_approval' && localStorage.getItem('userName') == 'admin') return null;
            return (
              <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                <Icon type={route.icon} />
                <span>{L(route.title)}</span>
              </Menu.Item>
            );
          })}
        {isGranted('Pages.Admin') ? (
          <SubMenu
            key="masters"
            title={
              <span>
                <Icon type="form"/>
                <span>Masters</span>
              </span>
            }
          >
            {appRouters
              .filter((item: any) => !item.isLayout && item.showInMenu && item.innerMenu)
              .map((route: any, index: number) => {
                if (route.permission && !isGranted(route.permission)) return null;

                return (
                  <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                    <Icon type={route.icon} />
                    <span>{L(route.title)}</span>
                  </Menu.Item>
                );
              })}
          </SubMenu>
        ) : null}
        {isGranted('Pages.Admin') ? (
          <Menu.Item key={'/initiate_carry_forward'} onClick={() => history.push('/initiate_carry_forward')}>
            <Icon type={'warning'} />
            <span>{L('Initiate Carry Forward')}</span>
          </Menu.Item>
        ) : null}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
