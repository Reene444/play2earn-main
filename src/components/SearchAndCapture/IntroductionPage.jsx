import React, { useState } from 'react';

const IntroductionPage = ({ onProceed }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [formError, setFormError] = useState('');

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || !url) {
      setFormError('Both screenshot and URL are required.');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('url', url);

    try {
      await fetch('http://127.0.0.1:5000/search_capture/verify', {
        method: 'POST',
        body: formData,
      });
      onProceed(); // Proceed to HomePage after successful submission
    } catch (error) {
      console.error('Error verifying the screenshot and URL:', error);
      alert('Failed to verify. Please try again.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 filter blur-xl opacity-75"></div>

      <div className="relative z-10 bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Instructions</h1>
        <p className="mb-4">
          Welcome to the task! Please choose a level to start the task and earn tokens. Complete tasks accurately to earn better rewards!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Upload Screenshot</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Website URL</label>
            <input type="text" value={url} onChange={handleUrlChange} className="border p-2 w-full" />
          </div>
          {formError && <p className="text-red-600 mb-4">{formError}</p>}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default IntroductionPage;
