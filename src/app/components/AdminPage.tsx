'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SignupSignatory from './SignupSignatory';
import RegisterStudent from './RegisterStudent';

const AdminPage: React.FC = () => {
  const [selection, setSelection] = useState<string>('signatory');

  const renderContent = () => {
    switch (selection) {
      case 'signatory':
        return <SignupSignatory />;
      case 'student':
        return <RegisterStudent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelect={setSelection} />
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
