import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/common/home";
import Login from "./pages/common/login";
import Register from "./pages/common/register";
import "./styles/theme.css";
import "./styles/alignments.css";
import "./styles/textelements.css";
import "./styles/custom-components.css";
import "./styles/form-elements.css";
import "./styles/layout.css";
import Exams from "./pages/admin/Exams";
import AddEditExam from "./pages/admin/Exams/AddEditExam";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import WriteExam from "./pages/user/WriteExam";
import UserReports from "./pages/user/UserReports";
import AdminReports from "./pages/admin/AdminReports";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          {/* Common Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/** User Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}

          {/* Exam Index Page  */}
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />

          {/* Add Exam */}
          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          {/* Edit Exam */}
          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          {/* Admin Reports */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
