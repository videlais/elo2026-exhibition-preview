/* eslint-disable react-refresh/only-export-components */
import { Navigate } from 'react-router-dom';
import AboutPage from '../../pages/AboutPage';
import HomePage from '../../pages/HomePage';
import SearchPage from '../../pages/SearchPage';
import WorkPage from '../../pages/WorkPage';

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

export const appRoutes: AppRoute[] = [
  { path: '/', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/work/:workId', element: <WorkPage /> },
  { path: '/index', element: <Navigate to="/search" replace /> },
];
