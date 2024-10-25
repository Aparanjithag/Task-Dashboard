import React from 'react';
import { X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faFolder, 
  faTasks, 
  faFileAlt, 
  faUsers, 
  faLifeRing 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const IconItem = ({ icon, label, active = false }) => {
  return (
    <a
      href="#"
      className={`flex items-center p-2 rounded-lg hover:bg-gray-100 group transition-colors
        ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className={`w-5 h-5 transition duration-75 
          ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}`}
      />
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
    </a>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-10
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-56
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-center relative">
            <div className="text-2xl font-bold">Team Sync</div>
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors absolute right-4"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mx-6"></div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li><IconItem icon={faHome} label="Home" active={true}/></li>
              <li><IconItem icon={faFolder} label="Projects" active={true} /></li>
              <li><IconItem icon={faTasks} label="Tasks" active={true} /></li>
              <li><IconItem icon={faFileAlt} label="File Manager" active={true} /></li>
              <li><IconItem icon={faUsers} label="Users" active={true} /></li>
              <li><IconItem icon={faLifeRing} label="Support" active={true} /></li>
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mb-4"></div>
            <div className="flex items-center gap-3 cursor-pointer" onClick={()=>{navigate("/dashboard/profile")}}>
              <img
                className="w-10 h-10 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User Profile"
              />
              <div>
                <p className="font-semibold text-gray-800">{userName || 'Guest'}</p>
                <p className="text-sm text-gray-500">{userEmail || 'No email'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
