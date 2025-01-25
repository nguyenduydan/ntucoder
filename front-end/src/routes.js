import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdHome,
  MdLock,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import CoderTable from 'views/admin/coder/index';
import CoderCreate from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/coder',
    component: <CoderTable />,
    item: [
      {
        name: 'Thêm mới người dùng',
        path: 'create',
        component: <CoderCreate />,
      },
      {
        name: 'Chi tiết người dùng',
        path: 'detail/:id',
        component: <CoderDetail />,
      }
    ]
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
