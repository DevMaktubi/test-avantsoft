import { useSelector } from "react-redux";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { dashboardPath, loginPath } from "../constant/path";
import { useEffect } from "react";
import type { RootState } from "./store";

function RootLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && location.pathname === loginPath) {
      navigate(dashboardPath);
    } else if (!isAuthenticated && location.pathname !== loginPath) {
      navigate(loginPath);
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return <Outlet />;
}

export const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "/*",
        element: <div>404 Not Found</div>,
      },
      {
        path: "/",
        element: <Login key="Login" />,
      },
      {
        path: "/login",
        element: <Login key="Login" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard key="Dashboard" />,
      },
    ],
  },
];
