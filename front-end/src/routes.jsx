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
import BlogTable from 'views/admin/blogs/index';

// User Imports
import Home from 'views/user/Home';
//import Problem from 'views/user/Problem';
import Course from '@/views/user/Course';
import CourseDetailUser from '@/views/user/Course/components/CourseDetail';
import Lesson from 'views/user/Lesson';
import Ranking from '@/views/user/Ranking';
import Blog from '@/views/user/Blog';
import BlogDetail from '@/views/user/Blog/components/BlogDetail';

import { FcHome, FcReading, FcLibrary, FcBookmark, FcConferenceCall, FcOpenedFolder, FcApproval, FcFile, FcKindle } from "react-icons/fc";

const routes = [
  // Admin Routes
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <FcHome size={20} />,
    component: <MainDashboard />,
    allowedRoles: [1, 3],
  },
  {
    name: 'Loại khóa học',
    layout: '/admin',
    icon: <FcBookmark size={20} />,
    path: '/category-course',
    component: <CourseCategoryTable />,
    allowedRoles: [1],
  },
  {
    name: 'Khóa học',
    layout: '/admin',
    icon: <FcReading size={20} />,
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
    icon: <FcLibrary size={20} />,
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
    icon: <FcOpenedFolder size={20} />,
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
    icon: <FcApproval size={20} />,
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
    icon: <FcFile size={20} />,
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
    name: 'Quản lý bài viết',
    layout: '/admin',
    icon: <FcKindle size={20} />,
    path: '/blog',
    component: <BlogTable />,
    allowedRoles: [1, 3],
  },

  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <FcConferenceCall size={20} />,
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

  // User Routes
  {
    name: 'TRANG CHỦ',
    layout: '/user',
    path: '/',
    icon: <FcHome size={20} />,
    component: <Home />,
    protected: false
  },
  {
    name: 'HỌC TẬP',
    layout: '/user',
    path: '/course',
    icon: <FcReading size={20} />,
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
    icon: <FcApproval size={20} />,
    component: <Ranking />,
    protected: false
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/blogs',
    icon: <FcKindle size={20} />,
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
