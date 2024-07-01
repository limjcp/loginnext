import React from 'react';

type SidebarProps = {
  onSelect: (selection: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <nav className="p-4">
        <ul>
          <li>
            <button onClick={() => onSelect('signatory')} className="w-full text-left p-2 hover:bg-gray-700">
              Register Signatory
            </button>
          </li>
          <li>
            <button onClick={() => onSelect('student')} className="w-full text-left p-2 hover:bg-gray-700">
              Register Student
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
