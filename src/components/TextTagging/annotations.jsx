import React, { useState, useEffect } from 'react';
import sentencesData from './sentencesData.json';

const SentencesList = () => {
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    setSentences(sentencesData);
  }, []);

  return (
    <div>
      <h1>Sentences List</h1>
      <ul>
        {sentences.map(sentence => (
          <li key={sentence.id}>
            <strong>Level {sentence.level}:</strong> {sentence.sentence}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentencesList;
