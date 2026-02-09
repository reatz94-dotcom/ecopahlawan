
import React from 'react';
import NavItem from './NavItem';
import { NAV_LINKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      {/* Header */}
      <header className="bg-primary-green text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">EcoPahlawan</h1>
          <nav className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.path} path={link.path} label={link.label} />
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Navigation (Sticky Footer) */}
      <nav className="fixed bottom-0 left-0 w-full bg-primary-green md:hidden flex justify-around p-3 shadow-lg z-10">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.path} path={link.path} label={link.label} isMobile={true} />
        ))}
      </nav>
    </div>
  );
};

export default Layout;
