import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Tasks from "./pages/Tasks";
import Planner from "./pages/Planner";

import Sidebar from "./components/Sidebar";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

/* Layout wrapper */
function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Layout>
                <Dashboard />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/courses"
          element={
            <Protected>
              <Layout>
                <Courses />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/tasks"
          element={
            <Protected>
              <Layout>
                <Tasks />
              </Layout>
            </Protected>
          }
        />

        <Route
          path="/planner"
          element={
            <Protected>
              <Layout>
                <Planner />
              </Layout>
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;