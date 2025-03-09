import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
} from 'react-icons/md';

// Admin Imports
// import MainDashboard from 'views/admin/default';
import CoderTable from 'views/admin/coder/index';
import CoderCreate from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';
import BadgeTable from 'views/admin/badge/index';
// User Imports
import Home from 'views/user/Home';
import Problem from 'views/user/Problem';

// Auth Imports
//import SignInCentered from 'views/auth/signIn';
import { PersonIcon } from 'components/icons/Icons';
import { FaBookAtlas, FaBookmark } from "react-icons/fa6";

const routes = [
  // Admin Routes
  // {
  //   name: 'Main Dashboard',
  //   layout: '/admin',
  //   path: '/dashboard',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <MainDashboard />,
  // },
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
  {
    name: 'Khóa học',
    layout: '/admin',
    icon: <Icon as={FaBookAtlas} width="20px" height="20px" color="inherit" />,
    path: '/course',
    component: <CoderTable />,
    item: [
      {
        name: 'Thêm mới khóa học',
        path: 'create',
        component: <CoderCreate />,
      },
      {
        name: 'Chi tiết khóa học',
        path: 'detail/:id',
        component: <CoderDetail />,
      }
    ]
  },
  {
    name: 'Nhãn',
    layout: '/admin',
    icon: <Icon as={FaBookmark} width="20px" height="20px" color="inherit" />,
    path: '/badge',
    component: <BadgeTable />,
    item: [
      {
        name: 'Thêm mới nhãn',
        path: 'create',
        component: <CoderCreate />,
      },
    ]
  },
  // Auth Routes
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: '/sign-in',
  //   component: <SignInCentered />,
  // },

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
    component: <Problem />,
  },
  {
    name: 'KỲ THI',
    layout: '/user',
    path: '/ky-thi',
    component: <Problem />,
  },
  {
    name: 'HỎI & ĐÁP',
    layout: '/user',
    path: '/hoi-dap',
    component: <Problem />,
  },
  {
    name: 'BẢNG CHẤM ĐIỂM',
    layout: '/user',
    path: '/bang-cham-diem',
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
    component: <Problem />,
  },
];

export default routes;
