import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import CoderTable from 'views/admin/coder/index';
import CoderCreate from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';
// User Imports
import Home from 'views/user/Home';
import Problem from 'views/user/Problem';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import { PersonIcon } from 'components/icons/Icons';

const routes = [
  // Admin Routes
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
    icon: <Icon as={PersonIcon} width="20px" height="20px" color="inherit" />,
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
  // Auth Routes
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },

  // User Routes
  {
    name: 'TRANG CHỦ',
    layout: '/user',
    path: '/',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Home />,
  },
  {
    name: 'BÀI TẬP',
    layout: '/user',
    path: '/problem',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
  {
    name: 'KỲ THI',
    layout: '/user',
    path: '/ky-thi',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
  {
    name: 'HỎI & ĐÁP',
    layout: '/user',
    path: '/hoi-dap',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
  {
    name: 'BẢNG CHẤM ĐIỂM',
    layout: '/user',
    path: '/bang-cham-diem',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/bai-viet',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
  {
    name: 'CHAT BOX',
    layout: '/user',
    path: '/chatbox',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Problem />,
  },
];

export default routes;
