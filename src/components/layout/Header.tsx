import { type FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">EduQuery</h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Courses
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Resources
            </a>
          </nav>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              {/* Add notification icon */}
            </button>
            <button className="ml-3 p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Profile</span>
              {/* Add profile icon/avatar */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
