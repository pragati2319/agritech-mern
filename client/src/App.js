import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useLang } from './i18n';

// Lazy-loaded pages keep the first load small
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Farms = lazy(() => import('./pages/Farms'));
const FarmDetail = lazy(() => import('./pages/FarmDetail'));
const Crops = lazy(() => import('./pages/Crops'));
const Orders = lazy(() => import('./pages/Orders'));
const Forum = lazy(() => import('./pages/Forum'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  const { t } = useLang();
  const guard = (el, role) => <ProtectedRoute role={role}>{el}</ProtectedRoute>;
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Suspense fallback={<p>{t('loading')}</p>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={guard(<Dashboard />)} />
            <Route path="/farms" element={guard(<Farms />)} />
            <Route path="/farms/:id" element={guard(<FarmDetail />)} />
            <Route path="/crops" element={guard(<Crops />)} />
            <Route path="/orders" element={guard(<Orders />)} />
            <Route path="/forum" element={guard(<Forum />)} />
            <Route path="/admin" element={guard(<Admin />, 'admin')} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
