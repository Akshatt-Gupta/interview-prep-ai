import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] p-4 overflow-y-auto transition-transform duration-300 bg-white w-full md:w-[40vw] shadow-2xl shadow-cyan-800/10 border-r border-gray-800 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h5 id="drawer-right-label" className="flex items-center text-base font-semibold text-black">
          {title}
        </h5>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
          aria-label="Close drawer"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      <div className="text-sm mx-3 mb-6 h-[calc(100%-60px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Drawer;