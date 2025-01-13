import React from 'react';

const Spinner = () => (
  <div className="w-16 h-16 border-8 border-t-8 border-blue-500 border-solid rounded-full border-opacity-30 animate-spin relative">
    <div className="absolute inset-0 border-t-8 border-transparent border-blue-300 opacity-50 rounded-full animate-spin"></div>
  </div>
);

export default Spinner;
