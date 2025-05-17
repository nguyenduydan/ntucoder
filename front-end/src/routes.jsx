import { Icon } from '@chakra-ui/react';
import {
  MdHome,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/dashboard';
import CoderTable from 'views/admin/coder/index';
import CoderCreate from '@/views/admin/coder/components/Create';
import CoderDetail from '@/views/admin/coder/components/Detail';
import BadgeTable from 'views/admin/badge/index';
import CourseCategoryTable from 'views/admin/categorycourse/index';
import CourseTable from 'views/admin/course/index';
import CourseDetail from '@/views/admin/course/components/Detail';
import TopicTable from 'views/admin/topic/index';
import TopicDetail from '@/views/admin/topic/components/Detail';
import LessonTable from 'views/admin/lesson/index';
import LessonDetail from '@/views/admin/lesson/components/Detail';
import ProblemTable from 'views/admin/problem/index';
import ProblemDetail from '@/views/admin/problem/components/Detail';
// User Imports
import Home from 'views/user/Home';
//import Problem from 'views/user/Problem';
import Course from '@/views/user/Course';
import CourseDetailUser from '@/views/user/Course/components/CourseDetail';
import Lesson from 'views/user/Lesson';
import Ranking from '@/views/user/Ranking';
import Blog from '@/views/user/Blog';
import BlogDetail from '@/views/user/Blog/components/BlogDetail';

import { PersonIcon } from '@/components/icons/Icons';
import { FaBookAtlas, FaFileCode, FaBook, FaBookmark, FaBookOpen, FaBookBookmark } from "react-icons/fa6";


const routes = [
  //Admin Routes
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    allowedRoles: [1, 3],
  },
  {
    name: 'Loại khóa học',
    layout: '/admin',
    icon: <Icon as={FaBookBookmark} width="20px" height="20px" color="inherit" />,
    path: '/category-course',
    component: <CourseCategoryTable />,
    allowedRoles: [1],
  },
  {
    name: 'Khóa học',
    layout: '/admin',
    icon: <Icon as={FaBookAtlas} width="20px" height="20px" color="inherit" />,
    path: '/course',
    component: <CourseTable />,
    allowedRoles: [1, 3],
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
    allowedRoles: [1, 3],
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
    allowedRoles: [1, 3],
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
    allowedRoles: [1],
    item: [
      {
        name: 'Thêm mới nhãn',
        path: 'create',
        component: <CoderCreate />,
      },
    ]
  },
  {
    name: 'Quản lý bài tập',
    layout: '/admin',
    icon: <Icon as={FaFileCode} width="20px" height="20px" color="inherit" />,
    path: '/problem',
    component: <ProblemTable />,
    allowedRoles: [1, 3],
    item: [
      {
        name: 'Chi tiết bài tập',
        path: 'detail/:id',
        component: <ProblemDetail />,
      }
    ]
  },

  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <Icon as={PersonIcon} width="20px" height="20px" color="inherit" />,
    path: '/coder',
    component: <CoderTable />,
    allowedRoles: [1],
    item: [
      {
        name: 'Chi tiết người dùng',
        path: 'detail/:id',
        component: <CoderDetail />,
      }
    ]
  },

  // //Auth Routes
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: '/login',
  //   component: <Login />,
  // },


  // User Routes
  {
    name: 'TRANG CHỦ',
    layout: '/user',
    path: '/',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Home />,
    protected: false
  },
  {
    name: 'HỌC TẬP',
    layout: '/user',
    path: '/course',
    component: <Course />,
    item: [
      {
        name: 'Chi tiết khóa học',
        path: ':slugId',
        component: <CourseDetailUser />,
        protected: false
      },
      {
        name: 'Chi tiết bài học',
        path: ':slugId/:lessonId',
        component: <Lesson />,
        protected: true
      }
    ]
  },

  {
    name: 'XÊP HẠNG',
    layout: '/user',
    path: '/ranking',
    component: <Ranking />,
    protected: false
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/blogs',
    component: <Blog />,
    protected: false,
    item: [
      {
        name: 'Chi tiết bài viết',
        path: ':slugId',
        component: <BlogDetail />,
        protected: false
      }
    ]
  }

];

export default routes;
