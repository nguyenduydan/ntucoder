import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdHome,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/dashboard';
import CoderTable from 'views/admin/coder/index';
import CoderCreate from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';
import BadgeTable from 'views/admin/badge/index';
import CourseCategoryTable from 'views/admin/categorycourse/index';
import CourseTable from 'views/admin/course/index';
import CourseDetail from 'views/admin/course/components/Detail';
import TopicTable from 'views/admin/topic/index';
import TopicDetail from 'views/admin/topic/components/Detail';
import LessonTable from 'views/admin/lesson/index';
import LessonDetail from 'views/admin/lesson/components/Detail';
// User Imports
import Home from 'views/user/Home';
import Problem from 'views/user/Problem';
import Course from 'views/user/Course';
import CourseDetailUser from 'views/user/Course/components/CourseDetail';
// Auth Imports
//import SignInCentered from 'views/auth/signIn';
import { PersonIcon } from 'components/icons/Icons';
import { FaBookAtlas, FaBook, FaBookmark, FaBookOpen, FaBookBookmark } from "react-icons/fa6";

const routes = [
  //Admin Routes
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Loại khóa học',
    layout: '/admin',
    icon: <Icon as={FaBookBookmark} width="20px" height="20px" color="inherit" />,
    path: '/category-course',
    component: <CourseCategoryTable />,
  },
  {
    name: 'Khóa học',
    layout: '/admin',
    icon: <Icon as={FaBookAtlas} width="20px" height="20px" color="inherit" />,
    path: '/course',
    component: <CourseTable />,
    item: [
      {
        name: 'Chi tiết khóa học',
        path: 'detail/:id',
        component: <CourseDetail />,
      }
    ]
  },

  {
    name: 'Chủ đề',
    layout: '/admin',
    icon: <Icon as={FaBookOpen} width="20px" height="20px" color="inherit" />,
    path: '/topic',
    component: <TopicTable />,
    item: [
      {
        name: 'Chi tiết chủ đề',
        path: 'detail/:id',
        component: <TopicDetail />,
      }
    ]
  },
  {
    name: 'Bài học',
    layout: '/admin',
    icon: <Icon as={FaBook} width="20px" height="20px" color="inherit" />,
    path: '/lesson',
    component: <LessonTable />,
    item: [
      {
        name: 'Chi tiết bài học',
        path: 'detail/:id',
        component: <LessonDetail />,
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
  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <Icon as={PersonIcon} width="20px" height="20px" color="inherit" />,
    path: '/coder',
    component: <CoderTable />,
    item: [
      {
        name: 'Chi tiết người dùng',
        path: 'detail/:id',
        component: <CoderDetail />,
      }
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
    name: 'HỌC TẬP',
    layout: '/user',
    path: '/course',
    component: <Course />,
    item: [
      {
        name: 'Chi tiết khóa học',
        path: 'detail/:id',
        component: <CourseDetailUser />,
      }
    ]
  },
  {
    name: 'BÀI TẬP',
    layout: '/user',
    path: '/problem',
    component: <Problem />,
  },
];

export default routes;
