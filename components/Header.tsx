
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface p-4 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-secondary tracking-wider">
          Zenith Task Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-brand-text-secondary">Marketing Agency Dashboard</span>
        </div>
      </div>
    </header>
  );
};
