import React from 'react';
import { LayoutContentWrapper, LayoutHeader, LayoutWrapper } from './styles';
import { Layout as ALayout, Menu, Typography } from 'antd';
import NextLink from 'next/link';
import Router, { useRouter } from 'next/router';
import { userRoleType } from '../utils/constraints';
import { useAuthUser } from 'next-firebase-auth';
import { clearAuthCookies } from '../utils/auth';

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
    icon: null
  },
  {
    key: 'users',
    route: '/users',
    title: 'Usuários',
    roles: ['superAdmin', 'prefectureAdmin', 'placeAdmin'],
    icon: null
  }
];

/**
 * Layout
 */
const Layout: React.FC<{ userRole: userRoleType }> = ({ children, userRole }) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const authUser = useAuthUser();

  const router = useRouter();

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
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
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
          <Menu.Item key="exit" onClick={handleExit} icon={null}>
            Sair
          </Menu.Item>
        </Menu>
      </Sider>
      <LayoutContentWrapper>
        <LayoutHeader>
          <Typography.Title>{selectedPlace?.title}</Typography.Title>
        </LayoutHeader>
        {children}
      </LayoutContentWrapper>
    </LayoutWrapper>
  );
};

export default Layout;