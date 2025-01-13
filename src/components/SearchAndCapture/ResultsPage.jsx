import React, { useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

const ResultsPage = ({
  result,
  onBack,
  onNextLevel,
  onGoHome,
  currentLevel,
  totalTokensAccumulated,
  saveLevelData,
  timeElapsed,
  onTryAgain,
  minTime, // New prop for minTime
  newRecord // New prop for newRecord
}) => {
  // Calculate tokens based on the conditions
  const calculateTokens = () => {
    let tokens = 0;

    // Check for word_check_message_image
    if (result.word_check_message_image === "Congratulations, you found the information!") {
      tokens += 3; // Award 3 tokens for the image message

      // Check for word_check_message_url if image message is congratulatory
      if (result.word_check_message_url === "Information verified") {
        tokens += 2; // Award 2 tokens if URL message is "Information verified"
      } else {
        tokens += 1; // Award 1 token if URL message is anything else
      }
    }

    return tokens;
  };

  // Conditionally set timeElapsed to "NA" if the congratulatory message is not present
  const displayTimeElapsed =
    result.word_check_message_image === "Congratulations, you found the information!"
      ? `${timeElapsed} seconds`
      : 'NA';

  // Check if the user has broken the record
  const isNewRecord = minTime !== 'NA' && timeElapsed < parseFloat(minTime);

  // Save level data when the component is rendered
  useEffect(() => {
    const screenshot = result.screenshot; // Assuming result contains screenshot URL
    const url = result.url; // Assuming result contains URL

    if (screenshot || url) {
      saveLevelData(currentLevel, screenshot, url);
    }
  }, [result, currentLevel, saveLevelData]);

  const totalTokens = calculateTokens();
  const isFinalLevel = currentLevel === 10;

  const sendDataToBackend = async () => {
    // Attempt to fix invalid or empty values silently
    let validLevel = currentLevel && !isNaN(currentLevel) && currentLevel > 0 ? currentLevel : 1;  // Default level to 1 if invalid
    let validTimeElapsed = displayTimeElapsed !== 'NA' && !isNaN(timeElapsed) && timeElapsed >= 0 ? timeElapsed : null;  // Set to null if invalid or 'NA'

    // If both values cannot be fixed, return gracefully (i.e., do nothing)
    if (!validLevel && validTimeElapsed === null) {
        return;  // Return silently without logging or sending a request
    }

    try {
        const url = new URL('http://127.0.0.1:5000/search_capture/save_level_data');
        
        // Append the "fixed" query parameters to the URL
        url.searchParams.append('level', validLevel);
        if (validTimeElapsed !== null) {
            url.searchParams.append('time_elapsed', validTimeElapsed);
        }

        const response = await fetch(url, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();  // Handle response as text
        console.log('Data sent to backend:', data);
    } catch (error) {
        console.error('Error sending data to backend:', error.message);
    }
};


  

  useEffect(() => {
    sendDataToBackend();
  }, [result, currentLevel, totalTokens, totalTokensAccumulated, timeElapsed]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 filter blur-3xl opacity-70"></div>
      
      {/* Content */}
      <div className="relative max-w-lg w-full bg-white p-10 rounded-xl shadow-2xl border border-gray-200 z-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Level {currentLevel} Result</h2>
          <p className="text-gray-600 mt-2">Here are the results of your analysis:</p>
        </div>
        <div className="mt-8 space-y-6">
          {result.word_check_message_image && (
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-blue-700">{result.word_check_message_image}</p>
            </div>
          )}
          {result.word_check_message_image === "Congratulations, you found the information!" && result.word_check_message_url && (
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-blue-700">{result.word_check_message_url}</p>
            </div>
          )}
          {result.error_url && (
            <div className="bg-red-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-bold text-red-600">URL Error</h3>
              <p className="text-red-700">{result.error_url}</p>
            </div>
          )}
          {/* Display total tokens for current level */}
          <div className="bg-green-50 p-6 rounded-lg shadow-sm mt-4">
            <p className="text-green-700 text-lg font-semibold">Tokens for this level: {totalTokens}</p>
          </div>
          {/* Display total accumulated tokens if on final level */}
          {isFinalLevel && (
            <div className="bg-green-100 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-green-800 text-lg font-semibold">Total Tokens Received: {totalTokensAccumulated}</p>
            </div>
          )}
          {/* Conditionally render the time elapsed section */}
          {displayTimeElapsed !== 'NA' && (
            <div className="bg-yellow-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-yellow-700 text-lg font-semibold">Time Elapsed: {displayTimeElapsed}</p>
            </div>
          )}
          {/* Conditionally render congratulatory message if new record */}
          {newRecord && (
            <div className="bg-green-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-green-700 text-lg font-semibold">Congratulations! You've set a new record with a time of {timeElapsed} seconds!</p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          {/* Render button only if not on final level */}
          {!isFinalLevel && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
              onClick={onNextLevel}
            >
              Next Level
            </button>
          )}
          {/* Back button always available */}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 ml-4"
            onClick={onTryAgain}
          >
            Try Again!
          </button>
          {/* Go Home button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 ml-4"
            onClick={onGoHome}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
