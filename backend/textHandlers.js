const path = require('path');
const fs = require('fs');

// Define path to the texts.json file
const textsPath = path.join(__dirname, 'model', 'texts.json');
let texts = {};

// Attempt to load the JSON file
try {
  texts = JSON.parse(fs.readFileSync(textsPath, 'utf8'));
  console.log('Texts loaded successfully:', texts);
} catch (err) {
  console.error('Error loading texts JSON file:', err);
}

// Function to generate a paragraph
function generateParagraph(req, res) {
  const { level } = req.query;

  console.log('Received level:', level);

  if (!level || !texts[level]) {
    console.error('Invalid level or level not found:', level);
    return res.status(400).json({ error: 'Invalid level or level not found.' });
  }

  const sentences = texts[level];
  const randomIndex = Math.floor(Math.random() * sentences.length);
  const sentence = sentences[randomIndex];

  console.log('Selected sentence:', sentence);

  res.json({
    french: sentence.french,
    english: sentence.english,
  });
}

// Function to verify translation
function verifyTranslation(req, res) {
  const { user_translation, correct_translation, user_id, level } = req.body;

  console.log('Received request body:', { user_translation, correct_translation, user_id, level });

  if (!user_translation || !correct_translation || !user_id || !level) {
    console.error('Missing required fields:', { user_translation, correct_translation, user_id, level });
    return res.status(400).json({ error: 'User translation, correct translation, user_id, and level are required.' });
  }

  // Check if user translation is correct
  const isCorrect = user_translation.trim().toLowerCase() === correct_translation.trim().toLowerCase();

  console.log('Translation verification result:', isCorrect);

  res.json({
    is_correct: isCorrect,
  });
}

module.exports = { generateParagraph, verifyTranslation };
