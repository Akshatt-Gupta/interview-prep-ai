import React from 'react';

const DefaultAvatar = ({ className }) => {
  return (
    <div className={`${className} bg-gray-50 flex items-center justify-center`}>
      <svg
        className="w-14 h-14 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 13C8.13401 13 5 16.134 5 20V21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21V20C3 15.0294 7.02944 11 12 11C16.9706 11 21 15.0294 21 20V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V20C19 16.134 15.866 13 12 13Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default DefaultAvatar; 