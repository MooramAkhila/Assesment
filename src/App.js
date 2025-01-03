import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './components/auth/Login';
import CompanyManagement from './components/admin/CompanyManagement';
import CommunicationMethods from './components/admin/CommunicationMethods';
import Dashboard from './components/user/Dashboard';
import Notifications from './components/user/Notifications';
import Calendar from './components/user/Calendar';
import PrivateRoute from './components/common/PrivateRoute';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

function App() {
  return (
    <Provider store={store}>
      <Router basename='/Assesment'>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute
                element={<AdminLayout />}
                requiredRole="admin"
              />
            }
          >
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="communication-methods" element={<CommunicationMethods />} />
            <Route index element={<Navigate to="companies" replace />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <PrivateRoute
                element={<UserLayout />}
                requiredRole="user"
              />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="calendar" element={<Calendar />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route 
            path="/unauthorized" 
            element={<div>You are not authorized to view this page.</div>} 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
