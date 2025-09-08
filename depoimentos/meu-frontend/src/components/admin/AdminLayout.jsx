import React from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminNavbar from './AdminNavbar.jsx';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;