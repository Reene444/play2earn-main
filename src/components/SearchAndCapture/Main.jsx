import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomePage from './WelcomePage'; 
import HomePage from './HomePage'; 
import LevelsPage from './LevelsPage'; 
import ResultsPage from './ResultsPage';
import Spinner from './Spinner'; 
import levelStats from './level_stats.json'; // Import the levelStats JSON

const Main = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState('1'); // Default to level 1
  const [config, setConfig] = useState({});
  const [totalTokensAccumulated, setTotalTokensAccumulated] = useState(0); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [isHomePage, setIsHomePage] = useState(false); 
  const [completedLevels, setCompletedLevels] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [newRecord, setNewRecord] = useState(false); // Track if a new record is set

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/level_config.json'); 
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    if (result) {
      const calculateTokens = () => {
        let tokens = 0;

        if (result.word_check_message_image === "Congratulations, you found the information!") {
          tokens += 3; 

          if (result.word_check_message_url === "Information verified") {
            tokens += 2; 
          } else {
            tokens += 1; 
          }
        }

        return tokens;
      };

      const tokensForCurrentLevel = calculateTokens();
      setTotalTokensAccumulated(prevTokens => prevTokens + tokensForCurrentLevel);
      
      // Check if a new record is set
      const currentLevelStats = levelStats[level];
      if (currentLevelStats) {
        const currentMinTime = parseFloat(currentLevelStats.min_time) || Infinity;
        if (timeElapsed < currentMinTime) {
          setNewRecord(true);
        }
      }
    }
  }, [result]);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    } else if (!timerRunning && timeElapsed !== 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timerRunning, timeElapsed]);

  const handleAnalyze = async (file, url) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('url', url);
    formData.append('level', level);
    formData.append('timeElapsed', timeElapsed); 

    setIsLoading(true);
    setTimerRunning(false); 

    try {
      const response = await axios.post('http://127.0.0.1:5000/search_capture/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing the inputs:', error);
      alert('Failed to analyze the inputs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  const handleNextLevel = () => {
    setCompletedLevels(prevCompleted => [...new Set([...prevCompleted, level])]);
    setLevel((prevLevel) => (parseInt(prevLevel) + 1).toString());
    setResult(null);
    setTimeElapsed(0);
    setTimerRunning(true);
    setNewRecord(false); // Reset newRecord for the next level
  };

  const handleTryAgain = () => {
    setResult(null);
    setTimeElapsed(0);
    setTimerRunning(true);
    setNewRecord(false); // Reset newRecord for retry
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsHomePage(true);
    setTimerRunning(true);
  };

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel.toString());
    setIsHomePage(false);
    setResult(null);
    setTimeElapsed(0);
    setTimerRunning(true);
  };

  const handleGoHome = () => {
    setResult(null); 
    setIsHomePage(true);
  };

  const currentConfig = config[level] || {};
  const currentLevel = parseInt(level);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      {!hasStarted ? (
        <WelcomePage onStart={handleStart} />  
      ) : isHomePage ? (
        <HomePage 
          onSelectLevel={handleLevelSelect} 
          completedLevels={completedLevels} 
        /> 
      ) : result ? (
        <ResultsPage 
          result={result} 
          onBack={handleBack} 
          onNextLevel={handleNextLevel} 
          onGoHome={handleGoHome} 
          currentLevel={currentLevel} 
          totalTokensAccumulated={totalTokensAccumulated} 
          timeElapsed={timeElapsed} 
          onTryAgain={handleTryAgain}
          newRecord={newRecord} // Pass the new record status
          minTime={levelStats[level]?.min_time} // Pass minTime for the current level
        />
      ) : (
        <LevelsPage 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          level={currentConfig.level}
          search_text={currentConfig.search_text} 
          hint={currentConfig.hint}
          timeElapsed={timeElapsed}
          setTimerRunning={setTimerRunning}
        />
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Main;
