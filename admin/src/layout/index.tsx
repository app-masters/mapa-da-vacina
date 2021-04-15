import React from 'react';
import { LayoutContentWrapper, LayoutHeader, LayoutWrapper } from './styles';
import { Layout as ALayout, Menu, Tooltip, Typography } from 'antd';
import NextLink from 'next/link';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { userRolesLabel, userRoleType } from '../utils/constraints';
import { useAuthUser } from 'next-firebase-auth';
import { clearAuthCookies } from '../utils/auth';
import { DesktopOutlined, UserOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import { useResponsiveContext } from '../providers/ResponsiveProvider';
import { User } from '../lib/User';

const { Sider } = ALayout;
const { SubMenu } = Menu;

type MenuProps = {
  key: string;
  route?: string;
  title: string;
  hidden?: boolean;
  roles?: userRoleType[];
  icon?: React.ReactNode | JSX.Element;
  subMenu?: MenuProps[];
};

const viewKeys: MenuProps[] = [
  {
    key: 'dashboard',
    route: '/dashboard',
    title: 'Dashboard',
    icon: <DesktopOutlined />
  },
  {
    key: 'users',
    route: '/users',
    title: 'Usuários',
    roles: ['superAdmin', 'prefectureAdmin', 'placeAdmin'],
    icon: <UserOutlined />
  },
  {
    key: 'update',
    route: '/update',
    title: 'Pontos de Vacinação',
    roles: ['superAdmin', 'prefectureAdmin'],
    icon: <ProfileOutlined />
  }
];

/**
 * Layout
 */
const Layout: React.FC<{ userRole: userRoleType; user: User }> = ({ children, userRole, user }) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const authUser = useAuthUser();

  const router = useRouter();
  const { isMobile } = useResponsiveContext();

  const selectedPlace: MenuProps = React.useMemo(() => {
    const pathname = router.pathname.split('/');
    const place = viewKeys.find((f) => f.key === pathname[1]);
    if (!place) return null;
    if (place.subMenu) {
      const subPlace = place.subMenu.find((f) => f.key === pathname[2]);
      return subPlace;
    } else {
      return place;
    }
  }, [router]);

  React.useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  /**
   * exit
   */
  const handleExit = async () => {
    await authUser.signOut();
    clearAuthCookies();
    Router.push('/auth');
  };

  return (
    <LayoutWrapper>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(collapse) => setCollapsed(isMobile ? true : collapse)}
      >
        <div className="logo">
          {collapsed ? (
            <Tooltip placement="right" title={'Prefeitura de Juiz de Fora'}>
              <Image width={100} height={60} src="/images/pjf-logo-mini.svg" alt="logo" />
            </Tooltip>
          ) : (
            <Image width={170} height={50} src="/images/pjf-logo-horizontal.svg" alt="logo" />
          )}
        </div>
        <Menu theme="light" defaultSelectedKeys={selectedPlace ? [selectedPlace.key] : null} mode="inline">
          {viewKeys
            .filter((f) => !f.hidden)
            .map((view) => {
              if (view.roles && !view.roles.includes(userRole)) return null;
              if (view.subMenu) {
                return (
                  <SubMenu key={view.key} icon={view.icon} title={view.title}>
                    {view.subMenu.map((sub) => (
                      <Menu.Item key={sub.key} icon={sub.icon}>
                        <NextLink href={`${sub.route}`}>{sub.title}</NextLink>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              }
              return (
                <Menu.Item key={view.key} icon={view.icon}>
                  <NextLink href={`${view.route}`}>{view.title}</NextLink>
                </Menu.Item>
              );
            })}
          <Menu.Item key="exit" onClick={handleExit} icon={<LogoutOutlined />}>
            Sair
          </Menu.Item>
        </Menu>
      </Sider>
      <LayoutContentWrapper>
        <LayoutHeader>
          <Typography.Title level={4}>{`${user.name} (${userRolesLabel[userRole]})`}</Typography.Title>
          <Typography.Title>{selectedPlace?.title}</Typography.Title>
        </LayoutHeader>
        {children}
      </LayoutContentWrapper>
    </LayoutWrapper>
  );
};

export default Layout;
