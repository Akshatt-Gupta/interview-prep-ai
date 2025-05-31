import React from 'react';

const SpinnerLoader = ({ size = 20, className = '' }) => {
  return (
    <div
      role="status"
      className={`flex items-center justify-center ${className}`}
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        aria-hidden="true"
        className={`inline animate-spin drop-shadow-sm`}
        width={size}
        height={size}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
          className="text-gray-200 dark:text-gray-600"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.553C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7232 75.2124 7.41289C69.5422 4.10255 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2611 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5723 10.4717 44.0491 10.1071C47.8511 9.53687 51.7191 9.49537 55.5402 10.0039C60.864 10.7309 65.9921 12.5733 70.6331 15.4256C75.274 18.2779 79.3347 22.0618 82.5849 26.5327C84.9175 29.7282 86.7997 33.322 88.1476 37.1465C88.9402 39.4041 91.5422 40.678 93.9676 39.0409Z"
          fill="currentFill"
          className="text-black/80"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerLoader;
