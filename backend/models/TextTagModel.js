const mongoose = require('mongoose');

// Define the Sentence schema
const sentenceSchema = new mongoose.Schema({
  text: String,
  level: Number,
});

// Define the PredictedTag schema
const predictedTagSchema = new mongoose.Schema({
  sentence: String,
  key: String,
  tag: String,
});

// Create models from schemas
const Sentence = mongoose.model('Sentence', sentenceSchema);
const PredictedTag = mongoose.model('PredictedTag', predictedTagSchema);

// Export the models
module.exports = { Sentence, PredictedTag };
