import React, { useState, useRef } from "react";
import { FiUser } from "react-icons/fi";

const ProfilePhotoUpload = ({ onImageChange }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Client-side validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(file); // Pass the actual file object
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="relative w-20 h-20 rounded-full border border-gray-200 hover:border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden bg-gray-50 transition-all"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FiUser className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      <p className="text-xs text-gray-500 mt-2">
        {preview ? "Change photo" : "Add photo"}
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;