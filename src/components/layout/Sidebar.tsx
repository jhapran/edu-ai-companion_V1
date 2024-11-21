import { type FC } from 'react';

interface MenuItem {
  label: string;
  icon: string;
}

const Sidebar: FC = () => {
  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Courses', icon: '📚' },
    { label: 'Assignments', icon: '✍️' },
    { label: 'Resources', icon: '📁' },
    { label: 'Analytics', icon: '📈' },
    { label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center space-x-2 px-4 py-3 rounded hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
