const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getPredictedTags, PredictedTag } = require('../models/TextTag'); // Adjust path according to your directory structure


// Path to the JSON file
const jsonFilePath = path.join(__dirname, '../model/sentenceData.json');

// Function to get a random sentence based on level
router.get('/get_sentence', (req, res) => {
  const level = parseInt(req.query.level, 10) || 1;

  // Read the JSON file
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return res.status(500).json({ error: 'Failed to read JSON file' });
    }

    try {
      const jsonData = JSON.parse(data);
      const sentences = jsonData.filter(sentence => sentence.level === level);
      
      if (sentences.length === 0) {
        return res.status(404).json({ error: 'No sentences found for the given level' });
      }

      const randomIndex = Math.floor(Math.random() * sentences.length);
      res.json(sentences[randomIndex]);
    } catch (err) {
      console.error(`Error parsing JSON: ${err.message}`);
      res.status(500).json({ error: 'Failed to parse JSON data' });
    }
  });
});

router.post('/get_predicted_tags', async (req, res) => {
  const sentence = req.body.sentence;

  // Validate input
  if (typeof sentence !== 'string') {
    return res.status(400).json({ error: 'Invalid request body. `sentence` must be a string.' });
  }

  try {
    console.log('Received sentence:', sentence); // Log the received sentence
    const predictedTags = await getPredictedTags(sentence);
    console.log('Predicted tags:', predictedTags); // Log the predicted tags
    res.json({ predicted_tags: predictedTags });
  } catch (error) {
    console.error('Error predicting tags:', error.message); // Log detailed error message
    res.status(500).json({ error: 'Error predicting tags' });
  }
});



router.post('/save_annotation', async (req, res) => {
  const { sentence, annotations, level } = req.body;

  // Validate the request body
  if (typeof sentence !== 'string' || !Array.isArray(annotations)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const sentenceLower = sentence.toLowerCase();

  try {
    // Fetch predicted tags from MongoDB
    const rows = await PredictedTag.find({ sentence: sentenceLower }).exec();

    const totalAnnotations = rows.length;
    let correctAnnotations = 0;

    annotations.forEach(annotation => {
      if (annotation && typeof annotation.key === 'string' && typeof annotation.tag === 'string') {
        const { key, tag } = annotation;
        const row = rows.find(row => row.key.toLowerCase() === key.toLowerCase());

        if (row && row.tag.toLowerCase() === tag.toLowerCase()) {
          correctAnnotations++;
        }
      }
    });

    res.json({ correct_annotations: correctAnnotations, total_annotations: totalAnnotations });
  } catch (err) {
    console.error('Database Query Error:', err);  // Log database query errors
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
