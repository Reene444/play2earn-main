import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import './Captcha.css'; // Ensure to create this CSS file for styling

const App = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
    level5: false,
    level6: false,
    level7: false,
    level8: false,
    level9: false,
    level10: false,
  });

  const [showText, setShowText] = useState(false); // Add this state

  return (
    <div className="body">
      <div className="captcha-container">
        <h1>Welcome to the CAPTCHA Challenge</h1>
        <p>Test your skills with different types of CAPTCHA tasks. Earn points for correct answers!</p>
     
        <PopupComponent type="Text" setTotalScore={setTotalScore} completedLevels={completedLevels} setCompletedLevels={setCompletedLevels} />
        <PopupComponent type="Audio" setTotalScore={setTotalScore} completedLevels={completedLevels} setCompletedLevels={setCompletedLevels} />
        <PopupComponent type="Image" setTotalScore={setTotalScore} completedLevels={completedLevels} setCompletedLevels={setCompletedLevels} />

        <div className="final-score">
          Your Total Score: {totalScore}
        </div>
      </div>
   
    </div>
  );
};

const PopupComponent = ({ level, type, setTotalScore, completedLevels, setCompletedLevels }) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [completedTasks, setCompletedTasks] = useState({
    level1: { Text: false, Audio: false, Image: false },
    level2: { Text: false, Audio: false, Image: false },
    level3: { Text: false, Audio: false, Image: false },
    level4: { Text: false, Audio: false, Image: false },
    level5: { Text: false, Audio: false, Image: false },
    level6: { Text: false, Audio: false, Image: false },
    level7: { Text: false, Audio: false, Image: false },
    level8: { Text: false, Audio: false, Image: false },
    level9: { Text: false, Audio: false, Image: false },
    level10: { Text: false, Audio: false, Image: false },
  });
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const encouragementMessages = [
    'Great job!',
    'Well done!',
    'Awesome!',
    'You nailed it!',
    'Fantastic!',
    'Keep it up!',
    'Excellent!',
    'Perfect!',
  ];

  const textCaptchas = {
    level1: [
      { imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRg0tVBwYVduQi33E14suTsDRSdL7sMYIbtg&s', answer: 'smwm' },
    ],
    level2: [
      { imageSrc: 'https://i.kym-cdn.com/photos/images/newsfeed/000/401/711/3a6.gif', answer: 'CAPTCHA' },
    ],
    level3: [
      { imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwtMcfpJJmTHCkWGbq40fF4rY-u2MXH9y_aaR2J6-steraDN-rBRJttqukTfrSc82ViA&usqp=CAU', answer: 'eX8MdT' },

    ],
    level4: [
      { imageSrc: 'https://www.tsohost.com/assets/uploads/blog/capcha.jpeg', answer: 'RecAptChA' },
    ],
    level5: [
      { imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgj_lLfmP1V2u1J_QM38lA6PKjf7c9Sv5ZrOX4GaVPKmJ_SFV9r_5Se-lC21OKCdTJpA&usqp=CAU', answer: '4cz8JyAz' },
    ],
    level6: [
      { imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVfyRKBLk5bT3uHzHpRTE6Iylv93YL9ZOqc1nVudqpJZCSdu2TOtJ_OxSAXWnh0GEtvA&usqp=CAU', answer: 'wnB56n' },
    ],
    level7: [
      { imageSrc: 'https://www.tsohost.com/assets/uploads/blog/capcha.jpeg', answer: 'RecAptChA' },
    ],
    level8: [
      { imageSrc: 'https://www.tsohost.com/assets/uploads/blog/capcha.jpeg', answer: 'RecAptChA' },
    ],
    level9: [
      { imageSrc: 'https://www.tsohost.com/assets/uploads/blog/capcha.jpeg', answer: 'RecAptChA' },
    ],
    level10: [
      { imageSrc: 'https://www.tsohost.com/assets/uploads/blog/capcha.jpeg', answer: 'RecAptChA' },
    ],

  };
  

  const audioCaptchas = {
    level1: [
      { audioSrc: 'src/components/captcha/audioAssets/jeep (2).mp3', answer: 'jeep' },
    ],
    level2: [
      { audioSrc: 'src/components/captcha/audioAssets/perfect (2).mp3', answer: 'perfect' },
    ],
    level3: [
      { audioSrc: 'src/components/captcha/audioAssets/flower (2).mp3', answer: 'flower' },
         ],
    level4: [
      { audioSrc: 'src/components/captcha/audioAssets/cup of tea.mp3', answer: 'cup of tea' },
         ],
    level5: [
      { audioSrc: 'src/components/captcha/audioAssets/this is a car.mp3', answer: 'this is a car' },
      ],
    level6: [
      { audioSrc: 'src/components/captcha/audioAssets/i love swimming  .mp3', answer: 'i love swimming' },
   ],
    level7: [
      { audioSrc: 'src/components/captcha/audioAssets/the quiet library wa.mp3', answer: 'the quiet library was filled with the faint rustling of pages as students immersed themselves in their studies.' },
          ],
    level8: [
      { audioSrc: 'src/components/captcha/audioAssets/as the first snowfla.mp3', answer: 'as the first snowflakes of winter fell children eagerly rushed outside to build snowmen' },
          ],
    level9: [
         { audioSrc: 'src/components/captcha/audioAssets/the aroma of freshly.mp3', answer: 'the aroma of freshly brewed coffee filled the cafe creating a cozy atmosphere' },
        ],
    level10: [
           { audioSrc: 'src/components/captcha/audioAssets/the old tree in the .mp3', answer: 'the old tree in the park had witnessed countless seasons standing as a silent guardian over the years' },
         ],


  };

  const imageCaptchas = {
    level1: [

      {
        question: "Select the correct image of a car.",
        options: [
          { imageSrc: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW90b3JiaWtlfGVufDB8fDB8fHww", isCorrect: false },
          { imageSrc: "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_640.jpg", isCorrect: true },
          { imageSrc: "https://static3.depositphotos.com/1000145/100/i/450/depositphotos_1007871-stock-photo-truck-road.jpg", isCorrect: false }
        ]
      },
    
    ],
    level2: [
      {
        question: "Select the correct image of a phone.",
        options: [
          { imageSrc: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?cs=srgb&dl=pexels-fotios-photos-1092644.jpg&fm=jpg", isCorrect: true },
          { imageSrc: "https://watermark.lovepik.com/photo/20211119/large/lovepik-laptop-and-mobile-phone-on-the-desktop-picture_500231129.jpg", isCorrect:false  },
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/8/8d/HP_LaserJet_1020_printer.jpg", isCorrect: false }
        ]
      },

    ],
    level3: [
      {
        question: "Select the correct image of lion.",
        options: [
          { imageSrc: "https://i.natgeofe.com/k/07176791-9577-4e31-b101-b10ca7ca9a3c/Stripes_Tiger-Terrific_KIDS_0722_16x9.jpg", isCorrect: false },
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nagarhole_Kabini_Karnataka_India%2C_Leopard_September_2013.jpg/800px-Nagarhole_Kabini_Karnataka_India%2C_Leopard_September_2013.jpg", isCorrect: false },
          { imageSrc: "https://c02.purpledshub.com/uploads/sites/62/2019/10/Federico_Veronesi_Lions-cover-image-e359a4e.jpg", isCorrect: true }
        ]
      },

    ],
    level4: [
      {
        question: "Select the correct image of a tree.",
        options: [
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flower_jtca001.jpg/1280px-Flower_jtca001.jpg", isCorrect: false },
          { imageSrc: "https://cdn.pixabay.com/photo/2013/04/03/12/05/tree-99852_640.jpg", isCorrect: true },
          { imageSrc: "https://cdn.pixabay.com/photo/2016/02/19/15/46/labrador-retriever-1210559_640.jpg", isCorrect: false }
        ]
      },
    ],
    level5: [
      {
        question: "Select the correct image of monkey.",
        options: [
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Gorille_des_plaines_de_l%27ouest_%C3%A0_l%27Espace_Zoologique.jpg/800px-Gorille_des_plaines_de_l%27ouest_%C3%A0_l%27Espace_Zoologique.jpg", isCorrect: false },
          { imageSrc: "https://api.hub.jhu.edu/factory/sites/default/files/styles/soft_crop_1300/assets/monkey092018.jpg", isCorrect: true },
          { imageSrc: "https://lazoo.org/wp-content/uploads/2023/05/Chimp-Female-Yoshi-Spotlight-JEP_1025-1024x731.jpg", isCorrect: false }
        ]
      },

    ],
    level6: [
      {
        question: "Select the correct image of a rose.",
        options: [
          { imageSrc: "https://harkness-roses.s3.amazonaws.com/700/530920.jpg", isCorrect: true },
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lilium_candidum_1.jpg/800px-Lilium_candidum_1.jpg", isCorrect: false },
          { imageSrc: "https://www.chicagobotanic.org/sites/default/files/images/sunflowers/sunflower_big1.jpg", isCorrect: false }
        ]
      },

    ],
    level7: [
      {
        question: "Select the correct image of a bicycle.",
        options: [
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/0/06/Bicycle_European_city_commuter.jpg", isCorrect: true },
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Firebike.jpg/800px-Firebike.jpg", isCorrect: false },
          { imageSrc: "https://upload.wikimedia.org/wikipedia/commons/9/96/Cannondale_Rush.jpg", isCorrect: false }
        ]
      },
    ],
    level8: [
      {
        question: "Select the correct image of mango tree.",
        options: [
          { imageSrc: "https://static.vecteezy.com/system/resources/previews/038/141/340/non_2x/ai-generated-mango-tree-in-park-generate-ai-photo.jpg", isCorrect: true },
          { imageSrc: "https://i.pinimg.com/736x/46/59/10/465910dfb32ce73e94f211582fd257cd.jpg", isCorrect: false },
          { imageSrc: "https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Navel_Orange_1_FGT.jpg", isCorrect: false }
        ]
      },
    ],
    level9: [

      {
        question: "Select the correct image of sugar.",
        options: [
          { imageSrc: "https://images.ctfassets.net/4f3rgqwzdznj/hFtcOUr8IbQ1S14dB8sw3/daa5240ab54583ca24495ca31301ea2c/closeup_hand_salt_shaker_1374938821.jpg", isCorrect: false },
          { imageSrc: "https://cdn.britannica.com/73/239573-050-E9A4DB36/sugar-cubes.jpg", isCorrect: true },
          { imageSrc: "https://foodtolive.com/healthy-blog/wp-content/uploads/sites/3/2020/06/Himalayan-Pink-Salt-850x500-2px.jpg", isCorrect: false }
        ]
      },

    ],

    level10: [
      {
        question: "Select the correct image of a stethoscope",
        options: [
          { imageSrc: "https://www.accoson.com/wp-content/uploads/2021/03/Physician-Black-Shadow.jpeg", isCorrect: true },
          { imageSrc: "https://static.wixstatic.com/media/2ac255_fbcf1aff702345249d33956a84fa27cc~mv2.png/v1/fill/w_480,h_449,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/2ac255_fbcf1aff702345249d33956a84fa27cc~mv2.png", isCorrect: false },
          { imageSrc: "https://www.embs.org/pulse/wp-content/uploads/sites/13/2023/06/2-An-Injection-of-Innovation-How-Drug-Delivery-Systems-are-Changing-768x432.jpg", isCorrect: false }
        ]
      },


    ]
  };
  const handleLevelSelection = (level) => {
    const difficulty = {
      level1: 'level1',
      level2: 'level2',
      level3: 'level3',
      level4: 'level4',
      level5: 'level5',
      level6: 'level6',
      level7: 'level7',
      level8: 'level8',
      level9: 'level9',
      level10: 'level10',
    }[level];
  
    // Check if the previous level has been completed for the same CAPTCHA type
    const previousLevel = `level${parseInt(level.replace('level', ''), 10) - 1}`;
    if (previousLevel !== 'level0' && (!completedTasks[previousLevel] || !completedTasks[previousLevel][type])) {
      setFeedbackMessage(`You need to complete ${previousLevel} in ${type} CAPTCHA before accessing ${difficulty}.`);
      return;
    }
  
    // Proceed to the selected level
    setCurrentLevel(level);
    setUserAnswer('');
    setFeedbackMessage('');
    setCurrentSetIndex(0);
  };
  
  const handleSubmit = (captcha) => {
    let points = 0;
    if (['level1', 'level2', 'level3'].includes(currentLevel)) {
      points = 5;
    } else if (['level4', 'level5', 'level6'].includes(currentLevel)) {
      points = 10;
    } else if (['level7', 'level8', 'level9', 'level10'].includes(currentLevel)) {
      points = 15;
    }
  
    // Check if the previous level has been completed for the same CAPTCHA type
    const previousLevel = `level${parseInt(currentLevel.replace('level', ''), 10) - 1}`;
    if (previousLevel !== 'level0' && (!completedTasks[previousLevel] || !completedTasks[previousLevel][type])) {
      setFeedbackMessage(`You need to complete ${previousLevel} in ${type} CAPTCHA before accessing ${currentLevel}.`);
      return;
    }
  
    let isAnswerCorrect = false;
  
    if (type === 'Text') {
      if (userAnswer.toLowerCase() === captcha.answer.toLowerCase()) {
        isAnswerCorrect = true;
        const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setFeedbackMessage(`${randomEncouragement} The answer is correct!`);
        setUserAnswer('');
        setTotalScore(prevScore => prevScore + points);
      } else {
        setFeedbackMessage('It is the wrong answer. Try again!');
      }
  
      if (currentSetIndex < textCaptchas[currentLevel].length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        if (isAnswerCorrect) {
          setCompletedTasks(prevState => ({
            ...prevState,
            [currentLevel]: {
              ...prevState[currentLevel],
              [type]: true,
            },
          }));
  
          setCompletedLevels(prevState => ({
            ...prevState,
            [currentLevel]: true,
          }));
        }
        setCurrentLevel(null);
      }
      setUserAnswer('');
  
    } else if (type === 'Audio') {
      if (userAnswer.toLowerCase() === captcha.answer.toLowerCase()) {
        isAnswerCorrect = true;
        const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setFeedbackMessage(`${randomEncouragement} The answer is correct!`);
        setUserAnswer('');
        setTotalScore(prevScore => prevScore + points);
      } else {
        setFeedbackMessage('It is the wrong answer. Try again!');
      }
  
      if (currentSetIndex < audioCaptchas[currentLevel].length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        if (isAnswerCorrect) {
          setCompletedTasks(prevState => ({
            ...prevState,
            [currentLevel]: {
              ...prevState[currentLevel],
              [type]: true,
            },
          }));
  
          setCompletedLevels(prevState => ({
            ...prevState,
            [currentLevel]: true,
          }));
        }
        setCurrentLevel(null);
      }
      setUserAnswer('');
    } else if (type === 'Image') {
      if (captcha.isCorrect) {
        isAnswerCorrect = true;
        const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setFeedbackMessage(`${randomEncouragement} The answer is correct!`);
        setTotalScore(prevScore => prevScore + points);
      } else {
        setFeedbackMessage('The answer is incorrect. Try the next question!');
      }
  
      if (currentSetIndex < imageCaptchas[currentLevel].length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        if (isAnswerCorrect) {
          setCompletedTasks(prevState => ({
            ...prevState,
            [currentLevel]: {
              ...prevState[currentLevel],
              [type]: true,
            },
          }));
  
          setCompletedLevels(prevState => ({
            ...prevState,
            [currentLevel]: true,
          }));
        }
        setCurrentLevel(null);
      }
    } else {
      setFeedbackMessage('Incorrect answer. Please try again.');
      if (currentSetIndex < audioCaptchas[currentLevel].length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        if (isAnswerCorrect) {
          setCompletedTasks(prevState => ({
            ...prevState,
            [currentLevel]: {
              ...prevState[currentLevel],
              [type]: true,
            },
          }));
  
          setCompletedLevels(prevState => ({
            ...prevState,
            [currentLevel]: true,
          }));
        }
        setCurrentLevel(null);
      }
    }
  };
  
  

  const calculateProgress = () => {
    let completedCount = 0;
    let totalCount = 0;
  
    Object.keys(completedTasks).forEach(level => {
      Object.keys(completedTasks[level]).forEach(taskType => {
        totalCount++;
        if (completedTasks[level][taskType]) {
          completedCount++;
        }
      });
    });
  
    return totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;
  };
  
  const captchaImages = {
    Text: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Message-icon-blue-symbol-double.png', // Replace with actual image URL
    Audio: 'src/components/captcha/assets/audio.png', // Replace with actual image URL
    Image: 'src/components/captcha/assets/image.png' // Example image URL for Image CAPTCHA
  };
  
  return (
    <Popup trigger={<button className="button">  <img 
      src={captchaImages[type]} 
      alt={`${type} CAPTCHA`} 
      style={{ width: '110px', height: '100px', marginRight: '8px' }} 
    /><br></br> {type.toUpperCase()} CAPTCHA </button>} modal>
      {close => (
        <div className="modal">
          <button className="close" onClick={() => { close(); setCurrentLevel(null); }}>
            &times;
          </button>
          
          <div className="content">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}>
                Progress: {calculateProgress()}%
              </div>
            </div>
  
            {!currentLevel && (
  <>
    <div className="header" style={{ color: 'black' }}>
      CHOOSE YOUR LEVEL OF DIFFICULTY
    </div>
    <div className="level-button-container">
      <div className="level-button-grid">
      
      
      <button
  onClick={() => handleLevelSelection('level1')}
  key="level1"
  className='level-button1'
  style={{
    backgroundColor: completedTasks.level1 && completedTasks.level1[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 1
</button>

<button
  onClick={() => handleLevelSelection('level2')}
  key="level2"
  className='level-button2'
  style={{
    backgroundColor: completedTasks.level2 && completedTasks.level2[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 2
</button>

<button
  onClick={() => handleLevelSelection('level3')}
  key="level3"
  className='level-button3'
  style={{
    backgroundColor: completedTasks.level3 && completedTasks.level3[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 3
</button>

<button
  onClick={() => handleLevelSelection('level4')}
  key="level4"
  className='level-button4'
  style={{
    backgroundColor: completedTasks.level4 && completedTasks.level4[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 4
</button>

<button
  onClick={() => handleLevelSelection('level5')}
  key="level5"
  className='level-button5'
  style={{
    backgroundColor: completedTasks.level5 && completedTasks.level5[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 5
</button>

<button
  onClick={() => handleLevelSelection('level6')}
  key="level6"
  className='level-button6'
  style={{
    backgroundColor: completedTasks.level6 && completedTasks.level6[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 6
</button>

<button
  onClick={() => handleLevelSelection('level7')}
  key="level7"
  className='level-button7'
  style={{
    backgroundColor: completedTasks.level7 && completedTasks.level7[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 7
</button>

<button
  onClick={() => handleLevelSelection('level8')}
  key="level8"
  className='level-button8'
  style={{
    backgroundColor: completedTasks.level8 && completedTasks.level8[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 8
</button>

<button
  onClick={() => handleLevelSelection('level9')}
  key="level9"
  className='level-button9'
  style={{
    backgroundColor: completedTasks.level9 && completedTasks.level9[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 9
</button>
        <div className="level-button10-container">
        <button
  onClick={() => handleLevelSelection('level10')}
  key="level10"
  className='level-button10'
  style={{
    backgroundColor: completedTasks.level10 && completedTasks.level10[type] ? 'green' : '#4580C3',
  }}
>
  LEVEL 10
</button>
          
        </div>
      </div>
    </div>
  </>
)}

            {feedbackMessage && (
              <h2 className="feedback-message">{feedbackMessage}</h2>
            )}
            {currentLevel && type === 'Image' && (
              <div>
                {imageCaptchas[currentLevel][currentSetIndex] && (
                  <>
                    <p>{imageCaptchas[currentLevel][currentSetIndex].question}</p>
                    <div className="image-captcha-container">
                      {imageCaptchas[currentLevel][currentSetIndex].options.map((option, index) => (
                        <img
                          key={index}
                          className="captcha-image"
                          src={option.imageSrc}
                          alt={`CAPTCHA ${index}`}
                          onClick={() => handleSubmit(option)}
                        />
                      ))}
                    </div>
                    <button onClick={() => setCurrentLevel(null)} className="back-button">Back</button>
                    {feedbackMessage && (
                      <div className="feedback-message">
                        {feedbackMessage}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
  
            {currentLevel && type === 'Text' && (
              <div>
                <div className="image-captcha-container">
                  <img
                    className="captcha-image"
                    src={textCaptchas[currentLevel][currentSetIndex].imageSrc}
                    alt="CAPTCHA"
                  />
                </div>
                <br /><br />
                <input
                  type="text"
                  placeholder="Your answer here"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                />
                <button onClick={() => handleSubmit(textCaptchas[currentLevel][currentSetIndex])} className="submit-button">Submit</button>
                <button onClick={() => setCurrentLevel(null)} className="back-button">Back</button>
                {feedbackMessage && (
                  <div className="feedback-message">
                    {feedbackMessage}
                  </div>
                )}
              </div>
            )}
  
            {currentLevel && type === 'Audio' && (
              <div>
                <audio id="audioCaptcha" controls>
                  <source src={audioCaptchas[currentLevel][currentSetIndex].audioSrc} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <br /><br />
                <input
                  type="text"
                  placeholder="Your answer here"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                />
                <button onClick={() => handleSubmit(audioCaptchas[currentLevel][currentSetIndex])} className="submit-button">
                  Submit
                </button>
                <button onClick={() => setCurrentLevel(null)} className="back-button">
                  Back
                </button>
                {feedbackMessage && (
                  <div className="feedback-message">
                    {feedbackMessage}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="actions">
          </div>
        </div>
      )}
    </Popup>
  );
  };
  
  export default App;
