/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import HomePage from "../../pages/HomePage";

const SearchPage = lazy(() => import("../../pages/SearchPage"));
const AboutPage = lazy(() => import("../../pages/AboutPage"));
const WorkPage = lazy(() => import("../../pages/WorkPage"));

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

export const appRoutes: AppRoute[] = [
  { path: "/", element: <HomePage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/work/:workId", element: <WorkPage /> },
  { path: "/index", element: <Navigate to="/search" replace /> },
];
