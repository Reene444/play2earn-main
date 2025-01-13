import React from 'react';

const WelcomePage = ({ onStart }) => {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-white">
          Welcome to Search and Capture Master
        </h1>
        <p className="text-xl mb-8 font-light text-white">
          Unlock your journey to mastering the art of search and capture.
        </p>
        <button
          onClick={onStart}
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Let&apos;s Begin
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
