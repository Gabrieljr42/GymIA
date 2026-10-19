import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { DefaultLayout } from '../layouts/DefaultLayout';
import Login from '../pages/Login';
import { PrivateRoutes } from './PrivateRoutes';
import React, { Suspense } from 'react';
import ClientDetails from '../pages/Clients/ClientDetails';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const WorkoutPlans = React.lazy(() => import('../pages/WorkoutPlans'));
const Clients = React.lazy(() => import('../pages/Clients'));
const AddClient = React.lazy(() => import('../pages/Clients/AddClient'));
const Instructors = React.lazy(() => import('../pages/Instructors'));

const Loading = () => <div>Loading...</div>;

export const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        
        <Route element={<PrivateRoutes />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/clients/:clientId" element={<ClientDetails />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/grupos" element={<Navigate to="/dashboard" />} />
            <Route path="/perfil" element={<Navigate to="/dashboard" />} />
            <Route path="/preferencias" element={<Navigate to="/dashboard" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
