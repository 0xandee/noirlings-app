import React from 'react';
import { Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Auth: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex items-center">
      {user ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="User avatar"
          className="w-10 h-10 rounded-l object-cover border border-r-0"
          style={{
            color: "var(--header-text)",
            borderColor: 'var(--border-color)',
            backgroundColor: 'transparent'
          }}
        />
      ) : (
        <div className="" />
      )}

      <button
        className={`text-base px-4 py-2 ${user ? 'rounded-r border-l-0 ' : 'rounded'} hover:opacity-80 transition-opacity border flex items-center gap-2 cursor-pointer`}
        style={{
          color: "var(--header-text)",
          borderColor: 'var(--border-color)',
          backgroundColor: 'transparent'
        }}
        onClick={user ? logout : login}
      >
        {user ? (
          <div className="group flex items-center gap-2">
            <span className="group-hover:hidden">{user.user_metadata.user_name || 'User'}</span>
            <span className="hidden group-hover:block">Logout</span>
          </div>
        ) : (
          <>
            <Github size={16} color="var(--header-text)" />
            <span>Login with GitHub</span>
          </>
        )}
      </button>
    </div>
  );
};