
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import MissionsPage from './pages/MissionsPage';
import ProfilePage from './pages/ProfilePage';
import { AppRoute } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path={AppRoute.HOME} element={<HomePage />} />
          <Route path={AppRoute.LEARN} element={<LearnPage />} />
          <Route path={AppRoute.MISSIONS} element={<MissionsPage />} />
          <Route path={AppRoute.PROFILE} element={<ProfilePage />} />
          <Route path="*" element={<HomePage />} /> {/* Fallback route */}
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
