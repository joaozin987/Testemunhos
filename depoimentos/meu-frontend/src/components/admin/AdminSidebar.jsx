import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminSidebar() {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/usuarios', label: 'Usuários', icon: '👥' },
    { path: '/admin/posts', label: 'Posts', icon: '📝' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Administração</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 space-x-2 transition-colors ${
                isActive
                  ? 'bg-gray-700 border-r-4 border-blue-500'
                  : 'hover:bg-gray-700'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AdminSidebar;