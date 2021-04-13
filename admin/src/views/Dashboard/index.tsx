import React from 'react';
import Layout from '../../layout';
import { userRoleType } from '../../utils/constraints';

type DashboardViewProps = {
  userRole: userRoleType;
};

/**
 * Dashboard page
 * @params NextPage
 */
const Dashboard: React.FC<DashboardViewProps> = ({ userRole }) => {
  return (
    <Layout userRole={userRole}>
      <h1>Filometro Dashboard</h1>
    </Layout>
  );
};

export default Dashboard;
