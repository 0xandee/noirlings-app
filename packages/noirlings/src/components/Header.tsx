import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Auth } from './Auth';

interface HeaderProps {
  showProgress?: boolean;
  completedCount?: number;
  totalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  showProgress = false,
  completedCount = 0,
  totalCount = 0
}) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="px-4 py-2 flex justify-between items-center border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-toolbar)' }}>
      <div className="flex items-center gap-3 ml-2">
        <Link
          to="/"
          style={{
            color: location.pathname === "/" ? 'var(--color-accent)' : 'var(--color-secondary)',
            textDecoration: 'none',
          }}
        >
          {theme === 'light' ? (
            <img src="/noirlingsapplogo-white.png" alt="Noirlings Logo" className="h-4 w-auto" style={{ maxHeight: 32 }} />
          ) : (
            <img src="/noirlingsapplogo-white.png" alt="Noirlings Logo" className="h-4 w-auto" style={{ maxHeight: 32 }} />
          )}
        </Link>
        <div className="ml-4 flex gap-4 items-center">
          <Link
            to="/"
            style={{
              color: location.pathname === "/" ? 'var(--subheader-text)' : 'var(--header-text)'
            }}
            className="hover:opacity-80 transition-opacity no-underline"
          >
            Basic
          </Link>
          <Link
            to="/advanced"
            style={{
              color: location.pathname === "/advanced" ? 'var(--subheader-text)' : 'var(--header-text)'
            }}
            className="hover:opacity-80 transition-opacity no-underline"
          >
            Advanced
          </Link>
          {/* <Minus size={18} style={{ color: 'var(--header-text)',  transform: 'rotate(90deg)', opacity: 0.6   }} /> */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {showProgress && (
          <span style={{ color: 'var(--header-text)' }}>
            Finished: {completedCount}/{totalCount}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'transparent' }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Sun size={18} color="var(--header-text)" />
          ) : (
            <Moon size={18} color="var(--header-text)" />
          )}
        </button>
        <Auth />
      </div>
    </div>
  );
};