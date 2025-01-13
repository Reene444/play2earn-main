import React, { useState, useCallback, useEffect } from 'react';
import levelStats from './level_stats.json'; // Make sure this path is correct

const LevelsPage = ({ onAnalyze, isLoading, level, search_text, hint, timeElapsed, setTimerRunning }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [simpleFile, setSimpleFile] = useState(null);
  const [simpleImagePreview, setSimpleImagePreview] = useState(null);
  const [avgTime, setAvgTime] = useState('NA');
  const [minTime, setMinTime] = useState('NA');

  // Fetch avg_time and min_time based on level from the JSON
  useEffect(() => {
    if (levelStats[level]) {
      const levelData = levelStats[level];
      setAvgTime(levelData.avg_time || 'NA');
      setMinTime(levelData.min_time || 'NA');
      console.log(`Avg Time for Level ${level}: ${levelData.avg_time}`); // Debugging log
      console.log(`Min Time for Level ${level}: ${levelData.min_time}`); // Debugging log
    } else {
      console.log(`Level ${level} not found or avg_time/min_time missing`); // Debugging log
      setAvgTime('NA');
      setMinTime('NA');
    }
  }, [level]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setImagePreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSimpleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setSimpleFile(selectedFile);
      setSimpleImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimerRunning(false); 
    onAnalyze(file, url);
  };

  const isFormValid = file && url;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 filter blur-xl opacity-70"></div>
      <div className="relative max-w-3xl w-full bg-white p-10 rounded-xl shadow-2xl border border-gray-200 z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Level {level}</h2>
          <p className="text-gray-600 mt-2">Upload a screenshot and enter the URL where you found the information.</p>
        </div>

        <div className="relative w-full mb-8">
          <div className="bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-lg border border-gray-200 shadow-lg text-center flex items-center justify-center space-x-2">
            <span className="text-4xl">🔍</span>
            <p className="text-lg font-semibold text-gray-800">{search_text}</p>
          </div>
          <p className="text-gray-500 text-center mt-2">
            <strong>Hint:</strong> {hint}
          </p>
        </div>

        <div className="text-center text-lg font-semibold mb-6 text-gray-700">
          <p>Time Elapsed: {timeElapsed} seconds</p> {/* Display the timer here */}
          <p>Avg Time: {avgTime !== 'NA' ? `${avgTime} seconds` : 'NA'}</p> {/* Display the avg time here */}
          <p>Min Time: {minTime !== 'NA' ? `${minTime} seconds` : 'NA'}</p> {/* Display the min time here */}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div
            className={`flex items-center justify-center w-full border-4 ${dragActive ? 'border-blue-500' : 'border-gray-300'} rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-transform duration-300 ease-in-out transform ${dragActive ? 'scale-105' : 'scale-100'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 p-6 relative"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <>
                  <svg className="w-16 h-16 mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v2a1 1 0 001 1h4a1 1 0 001-1v-2m-2 0a2 2 0 10-4 0m2-6v6M6 3a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H6z"></path>
                  </svg>
                  <p className="text-gray-500">
                    <span className="font-semibold text-gray-800">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF (MAX. 800x400px)</p>
                </>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Upload Screenshot of Your Search Process (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSimpleFileChange}
              className="mb-4"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="url" className="text-gray-700 font-semibold mb-2">Enter URL</label>
            <input
              type="url"
              id="url"
              className="border-2 border-gray-300 p-3 rounded-md w-full focus:ring focus:ring-indigo-200"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-indigo-600 text-white font-bold rounded-md shadow hover:bg-indigo-700 transition-transform transform hover:scale-105"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LevelsPage;
