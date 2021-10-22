import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, NoSidebar } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import FeedingsOverview from "./views/FeedingOverview";
import Tables from "./views/Tables";
import Login from "./views/Login";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/blog-overview" />
  },
  {
    path: "/login",
    layout: NoSidebar,
    component: Login
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/feedings",
    layout: DefaultLayout,
    component: FeedingsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },

];
