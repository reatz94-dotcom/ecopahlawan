
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  path: string;
  label: string;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, isMobile = false }) => {
  const activeClasses = isMobile
    ? 'text-light-green bg-secondary-green rounded-full px-4 py-2'
    : 'text-light-green border-b-2 border-light-green';
  const inactiveClasses = isMobile
    ? 'text-white px-4 py-2'
    : 'text-white hover:text-light-green';

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `font-medium transition-colors duration-200 ${
          isActive ? activeClasses : inactiveClasses
        } ${isMobile ? 'flex flex-col items-center text-xs' : ''}`
      }
    >
      {isMobile ? (
        <>
          {/* You might add icons here for mobile nav */}
          <span>{label}</span>
        </>
      ) : (
        label
      )}
    </NavLink>
  );
};

export default NavItem;
