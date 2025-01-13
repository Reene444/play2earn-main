import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import imageData from './imageData.json';
import GameOverModal from './GameOverModal';
import EvaluationModal from './EvaluationModal';
import Confetti from 'react-confetti';
import ShareButton from './ShareButtons';
import '../css/imagecaption.css'

// Constants
const TOTAL_LEVELS = 10;
const TIMER_DURATIONS = [90, 80, 70, 60, 50, 40, 30, 20, 15, 10];
const INITIAL_LIVES = 3;

// Helper functions
const getTimerDuration = (level) => {
  return TIMER_DURATIONS[Math.min(level - 1, TIMER_DURATIONS.length - 1)];
};

const startTimer = (duration, onTick, onComplete) => {
  let timeLeft = duration;
  const id = setInterval(() => {
    if (timeLeft <= 1) {
      clearInterval(id);
      onComplete();
    } else {
      timeLeft -= 1;
      onTick(timeLeft);
    }
  }, 1000);

  return id;
};

const clearTimer = (intervalId) => {
  if (intervalId) clearInterval(intervalId);
};

const decreaseLives = (lives, onGameOver) => {
  const newLives = lives - 1;
  if (newLives <= 0) {
    onGameOver();
    return 0;
  }
  return newLives;
};

const areCaptionsSimilar = (userCaption, correctCaption) => {
  const userWords = userCaption.toLowerCase().split(' ').filter(Boolean);
  const correctWords = correctCaption.toLowerCase().split(' ').filter(Boolean);
  return userWords.some(word => correctWords.includes(word));
};

const getRandomImage = (usedImages) => {
  const unusedImages = imageData.filter(image => !usedImages.has(image.id));
  if (unusedImages.length === 0) return null;
  return unusedImages[Math.floor(Math.random() * unusedImages.length)];
};

const MainGame = () => {
  const [view, setView] = useState('main'); // 'main', 'level', or 'game'
  const [currentImage, setCurrentImage] = useState(() => getRandomImage(new Set()));
  const [caption, setCaption] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(getTimerDuration(1));
  const [intervalId, setIntervalId] = useState(null);
  const [usedImages, setUsedImages] = useState(new Set());
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (isGameStarted) {
      if (intervalId) clearTimer(intervalId);

      if (timer <= 0) {
        setFeedback('Time is up! Game Over!');
        setGameOver(true);
        setButtonDisabled(true);
        setTimer(0); // Stop the timer
        return;
      }

      const id = startTimer(timer, setTimer, () => {
        setFeedback('Time is up! Game Over!');
        setGameOver(true);
        setButtonDisabled(true);
        setTimer(0); // Stop the timer
      });
      setIntervalId(id);

      return () => clearTimer(id);
    }
  }, [timer, isGameStarted]);

  useEffect(() => {
    if (view === 'level') {
      // Make sure the timer and interval are properly managed when navigating to the level page
      if (intervalId) {
        clearTimer(intervalId);
      }
    }
  }, [view]);


  useEffect(() => {
    if (isGameStarted) {
      setTimer(getTimerDuration(level));
    }
  }, [level, isGameStarted]);




  const handleStartClick = () => {
    setView('level');
  };


  const handleLevelSelect = (levelId) => {
    if (unlockedLevels.includes(levelId)) {
      // Reset timer to the new level's duration
      setTimer(getTimerDuration(levelId));
      setLevel(levelId);
      setSelectedLevel(levelId);
      setIsGameStarted(true);
      setView('game');

      // Clear any existing interval
      if (intervalId) clearTimer(intervalId);

      // Start a new timer
      const id = startTimer(getTimerDuration(levelId), setTimer, () => {
        setFeedback('Time is up! Game Over!');
        setGameOver(true);
        setButtonDisabled(true);
        setTimer(0); // Stop the timer
      });
      setIntervalId(id);
    }
  };


  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (caption.trim() === '') {
      setFeedback('Please enter a caption.');
      return;
    }

    const correctCaption = currentImage?.caption.toLowerCase();
    const userCaption = caption.trim().toLowerCase();

    if (correctCaption && areCaptionsSimilar(userCaption, correctCaption)) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer(correctCaption || '');
    }
  };

  const handleCorrectAnswer = useCallback(() => {
    // Show EvaluationModal
    setShowScoreModal(true);

    // Update unlockedLevels if necessary
    setUnlockedLevels(prev => {
      if (!prev.includes(level + 1) && level < TOTAL_LEVELS) {
        return [...prev, level + 1];
      }
      return prev;
    });

    // Increment score or handle other logic
    setScore(prevScore => prevScore + 10); // Adjust score increment as needed

    // Reset caption
    setCaption('');

    // Set a timeout to advance to the next level after a short delay
    setTimeout(() => {
      // Move to the next level
      setLevel(prevLevel => {
        const nextLevel = prevLevel + 1;
        if (nextLevel <= TOTAL_LEVELS) {
          setLevel(nextLevel);
          setSelectedLevel(nextLevel);
          setIsGameStarted(true);

          const nextImage = getRandomImage(usedImages);
          if (nextImage) {
            setUsedImages(prev => new Set(prev).add(nextImage.id));
            setCurrentImage(nextImage);
          }
          return nextLevel;
        } else {
          setShowResults(true); // Show results if all levels are completed
          return prevLevel;
        }
      });

      setShowScoreModal(false); // Close the modal
    }, 1000); // Delay in milliseconds before closing the modal and moving to the next level
  }, [level, usedImages]);




  const handleIncorrectAnswer = (correctCaption) => {
    setFeedback(`Incorrect caption. The correct caption was: "${correctCaption}". Try again!`);
    setIsCorrect(false);
    setLives(prevLives => {
      const newLives = decreaseLives(prevLives, () => {
        setFeedback('Out of lives! Game Over!');
        setGameOver(true);
        setButtonDisabled(true);
        setTimer(0); // Stop the timer
      });
      if (newLives > 0) {
        const nextImage = getRandomImage(usedImages);
        if (nextImage) {
          setUsedImages(prev => new Set(prev).add(nextImage.id));
          setCurrentImage(nextImage);
          setCaption('');
          setTimer(getTimerDuration(level));
        }
      }
      return newLives;
    });
  };

  const handleRestart = () => {
    setCurrentImage(getRandomImage(new Set()));
    setCaption('');
    setFeedback('');
    setScore(0);
    setLevel(1);
    setLives(INITIAL_LIVES);
    setGameOver(false);
    setShowResults(false);
    setShowScoreModal(false);
    setButtonDisabled(false);
    setTimer(getTimerDuration(1));
    setUsedImages(new Set());
    setIsGameStarted(false);
    setView('main');
    setSelectedLevel(1); // Reset selected level to 1
  };



  const renderLives = (count) => {
    return '❤️'.repeat(count);
  };

  const getButtonStyle = (levelId) => ({
    borderRadius: '70px',
    fontSize: '24px',
    width: '220px',
    marginRight: '20px',
    border: '2px solid',
    backgroundColor: unlockedLevels.includes(levelId) ? 'transparent' : 'grey',
    color: unlockedLevels.includes(levelId) ? 'white' : 'white',
    cursor: unlockedLevels.includes(levelId) ? 'pointer' : 'not-allowed',
  });




  if (showResults) {
    return <GameCompleted score={score} onRestart={handleRestart} />;
  }

  if (gameOver) {
    return (
      <div>
        <GameOverModal
          score={score}
          onRestart={handleRestart}
          open={gameOver}
          onClose={() => setGameOver(false)}
        />
      </div>
    );
  }

  return (
    <div className='main-page' style={{ textAlign: 'center' }}>
      {view === 'main' ? (
        <>
          {/* Main Page */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
              minHeight: '100vh',
              boxSizing: 'border-box'
            }}
          >
            <h1 style={{ fontSize: '36px', color: 'white', margin: '20px 0' }}>Welcome to the AI Image Caption game</h1>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '4px solid white',
                borderRadius: '25px',
                padding: '20px',
                maxWidth: '90vw',
                width: '710px',
                height: 'auto',
                backgroundColor: 'rgba(247, 250, 255, 0.8)',
                color: 'black',
                boxSizing: 'border-box'
              }}
            >
              <h1 style={{ fontSize: '36px', color: 'black' }}>Image Captioning Task</h1>
              <br />
              <p style={{ fontSize: '24px' }}>
                Please read the instruction below <br />before you start the game.
              </p>
              <br />
              <br />
              <Button
                onClick={handleStartClick}
                style={{
                  border: '4px solid transparent',
                  borderRadius: '100px',
                  color: 'white',
                  fontSize: '1.5rem',
                  background: 'rgba(15, 98, 254, 1)',
                  width: '60%',
                  maxWidth: '375px',
                  height: '80px',
                  cursor: 'pointer',
                  margin: '20px 0'
                }}
              >
                Start
              </Button>
            </div>
            <br /><br /><br /><br /><br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <section
                style={{
                  textAlign: 'left',
                  fontSize: '20px',
                  width: '80%',
                  maxWidth: '800px'
                }}
              >
                <h2 style={{ fontSize: '24px', color: 'pink' }}>
                  Instruction:
                </h2>
                In this task, you will be provided with an image and an AI-generated caption.
                Your goal is to refine and enhance the caption to make it SEO-friendly and include trending hashtags.
                The refined caption should be unique, engaging, and relevant to the image. Your caption will be evaluated by an AI system,
                and you will receive points and tokens based on the quality of your caption.
              </section>
            </div>
          </div>
        </>
      ) : view === 'level' ? (
        <>
          {/* Level Selection Page */}
          <div className="container">
            <h1
              style={{
                fontSize: '48px',
                color: 'white',
                margin: '0.5em 0'
              }}
            >Level Select</h1>

            <ButtonGroup className="button-group" size="large">
              {[1, 2, 3, 4, 5].map(level => (
                <Button
                  key={level}
                  style={getButtonStyle(level)}
                  onClick={() => handleLevelSelect(level)}
                  disabled={!unlockedLevels.includes(level)} // Disable if not unlocked
                >
                  Level {level}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup className="button-group" size="large">
              {[6, 7, 8, 9, 10].map(level => (
                <Button
                  key={level}
                  style={getButtonStyle(level)}
                  onClick={() => handleLevelSelect(level)}
                  disabled={!unlockedLevels.includes(level)} // Disable if not unlocked
                >
                  Level {level}
                </Button>
              ))}
            </ButtonGroup>
            <br />

            <Button
              onClick={() => setView('main')}
              style={{
                border: '4px solid transparent',
                borderRadius: '50px',
                fontSize: '36px',
                background: 'rgba(15, 98, 254, 1)',
                width: '250px',
                color: 'white',
                margin: '1em 0'
              }}
            >
              Home
            </Button>
            <br />
            <br />
            <br />
            <p
              style={{
                fontSize: '36px',
                margin: '1em 0',
                color: 'white'
              }}
            >Current Score: {score}</p>
          </div>
        </>

      ) : (
        <>
        <br />
        <br />
        {/* Game Page */}
        <div style={{
          textAlign: 'center',
          border: '4px solid black',
          borderRadius: '25px',
          padding: '20px',
          maxWidth: '90vw',  // Adjusts width for mobile view
          width: '710px',    // Fixed width for PC view
          height: 'auto',    // Adjust height based on content
          position: 'relative',
          margin: 'auto',
          backgroundColor: 'rgba(247, 250, 255, 0.8)',
          color: 'black',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Button
            onClick={() => {
              setView('level'); // Navigate to level selection
              setSelectedLevel(level);
            }}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(15, 98, 254, 1)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight:'bolder',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            Back
          </Button>
      
          <h1 style={{ color: 'black' }}>Level {level}</h1>
          <p>Time left: {timer}s</p>
          <p>Lives: {renderLives(lives)}</p>
          <img
            src={currentImage?.src}
            alt={currentImage?.alt}
            style={{ 
              width: '100%',   // Make image responsive
              maxWidth: '300px', 
              height: 'auto', 
              display: 'block', 
              margin: 'auto' 
            }}
          />
          <p style={{ fontSize: '1.25rem', marginTop: '10px' }}>
            {currentImage?.caption}
          </p>
          <br />
          <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: '100%' }}>
            <textarea
              value={caption}
              onChange={handleCaptionChange}
              placeholder="Enter your caption here"
              rows="4"
              cols="50"
              style={{ 
                fontSize: '1rem', 
                padding: '10px', 
                borderRadius: '10px', 
                border: '2px solid rgba(15, 124, 255, 1)', 
                resize: 'none', 
                width: '100%',
                maxWidth: '500px', // Constrain max width
                boxSizing: 'border-box'
              }}
              disabled={buttonDisabled}
            />
            <br />
            <br />
            <Button
              type="submit"
              disabled={buttonDisabled}
              style={{
                background: 'rgba(63, 212, 60, 1)',
                padding: '10px',
                border: '4px',
                borderRadius: '50px',
                color: 'white',
                fontSize: '1.5rem',
                width: 'auto',
                minWidth: '150px',
                height: '50px',
                marginRight: '20px'
              }}
            >
              Evaluate
            </Button>
            <br />
            <br />
      
            <ShareButton />
          </form>
      
          {showScoreModal && (
            <EvaluationModal
              score={score}
              open={showScoreModal}
              onClose={() => setShowScoreModal(false)}
            />
          )}
        </div>
      </>
      
      )}
    </div>
  );
};

const GameCompleted = ({ score, onRestart }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='results'> <Confetti
      width={windowWidth}
      height={windowHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
    />
   <div
  style={{
    textAlign: 'center',
    border: '4px solid black',
    borderRadius: '25px',
    padding: '20px',
    maxWidth: '90vw', // Use a percentage width to adapt to different screen sizes
    maxHeight: '80vh', // Adjust height based on viewport height
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(247, 250, 255, 0.8)',
    color: 'black',
    boxSizing: 'border-box' // Ensure padding and borders are included in width/height calculations
  }}
>

  <h1 style={{ fontSize: '24px',fontWeight:'bolder' , color: 'black' }}>Congratulations🎉</h1><br/><br/>
  <p style={{  fontSize: '24px' }}>Your final score: {score}</p><br/>

  <div style={{ marginTop: '20px' }}>
    <Button
      onClick={onRestart}
      style={{
        border: '4px solid',
        borderRadius: '30px',
        color: 'white',
        fontSize: '1.5rem',
        background: 'rgba(205, 26, 26, 1)',
        padding: '10px 20px',
        margin: '10px',
        display: 'inline-block' // Ensure buttons are inline on smaller screens
      }}
    >
      Play again
    </Button>
    <Button
      href='/'
      style={{
        border: '4px solid',
        borderRadius: '30px',
        color: 'white',
        fontSize: '1.5rem',
        background: 'rgba(15, 98, 254, 1)',
        padding: '10px 20px',
        margin: '10px',
        display: 'inline-block' // Ensure buttons are inline on smaller screens
      }}
    >
      Home
    </Button>
  </div>
</div>

    </div>
  );
};

export default MainGame;
