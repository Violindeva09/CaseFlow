import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CasesPage from "./pages/CasesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/cases", element: <CasesPage /> },
    ],
  },
]);

export default router;