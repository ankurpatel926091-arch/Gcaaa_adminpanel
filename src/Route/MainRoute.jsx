import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../Pages/Login'
import MainLayout from '../Layout/MainLayout'
import Dashboard from '../Pages/Dashboard'
import RegisteredMembers from '../Pages/RegisteredMembers'
import Alumni from '../Pages/Alumni'
import AlumniData from '../Pages/AlumniData'
import ElectionNominations from '../Pages/ElectionNominations'
import Events from '../Pages/Events'
import Gallery from '../Pages/Gallery'
import Publications from '../Pages/Publications'
import Blogs from '../Pages/Blogs'
import BlogDetails from '../Pages/BlogDetails'
import Profile from '../Pages/Profile'
import ContactPageSettings from '../Pages/ContactPageSettings'
import ContactMessages from '../Pages/ContactMessages'
import adminAuth from '../Api/adminAuthApi'
import WithdrawalsPage from '../Pages/WithdrawalsPage'

// Route Guard: Ensures only authenticated admins can access portal pages
const ProtectedAdminRoute = ({ children }) => {
  if (!adminAuth.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

const MainRoute = () => {
  const isAuth = adminAuth.isAuthenticated()

  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route
        path="/"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Admin Panel Protected Routes (Requires JWT Session) */}
      <Route
        element={
          <ProtectedAdminRoute>
            <MainLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registered-members" element={<RegisteredMembers />} />
        <Route path="/all-batches" element={<Alumni />} />
        <Route path="/batches" element={<AlumniData />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/election-nominations" element={<ElectionNominations />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/contact-page" element={<ContactPageSettings />} />
        <Route path="/contact-messages" element={<ContactMessages />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/withdrawals" element={<WithdrawalsPage />} />
        <Route path="/MainLayout" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  )
}

export default MainRoute
