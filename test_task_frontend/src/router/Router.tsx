import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/common';
import {
  LoginPage,
  RegisterPage,
  RestorePage,
  DiaryPage,
  InvitesPage,
} from '../components/pages';
import ProtectedRoute from './ProtectedRoute';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Navigate to="/diary" replace />
            </Layout>
          }
        />
        <Route
          path="/restore"
          element={
            <Layout>
              <ProtectedRoute>
                <RestorePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/diary"
          element={
            <Layout>
              <ProtectedRoute>
                <DiaryPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Admin routes */}
        <Route
          path="/invites"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={['Admin']}>
                <InvitesPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
