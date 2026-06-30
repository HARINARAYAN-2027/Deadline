// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0B0E14] text-[#F3F4F6] overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-[#0B0E14]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


