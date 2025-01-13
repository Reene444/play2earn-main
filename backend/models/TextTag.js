const compromise = require('compromise');
const { Sentence, PredictedTag } = require('../models/TextTagModel');
const path = require('path');
const fs = require('fs').promises;

// Function to extract company names (assuming company suffixes and known companies are available)
async function extractCompanyNames() {
  try {
    const companySuffixesPath = path.resolve(__dirname, '../model/companySuffixes.json');
    const knownCompaniesPath = path.resolve(__dirname, '../model/knownCompanies.json');
    
    const [companySuffixes, knownCompanies] = await Promise.all([
      fs.readFile(companySuffixesPath, 'utf8').then(JSON.parse),
      fs.readFile(knownCompaniesPath, 'utf8').then(JSON.parse)
    ]);

    const sentences = await Sentence.find({}).exec();
    const companyNames = new Set();

    sentences.forEach(({ text }) => {
      companySuffixes.forEach(suffix => {
        const words = text.split(' ');
        words.forEach((word, i) => {
          if (word.endsWith(suffix) && i > 0) {
            const companyName = `${words[i - 1]} ${word}`.trim();
            companyNames.add(companyName);
          }
        });
      });
    });

    // Add known companies to the set
    knownCompanies.forEach(name => companyNames.add(name));
    return companyNames;
  } catch (error) {
    console.error('Error extracting company names:', error.message);
    throw new Error('Failed to extract company names');
  }
}

async function getPredictedTags(sentence) {
  try {
    const doc = compromise(sentence);
    const predictedTags = [];

    const companyNames = await extractCompanyNames();
    const canonicalCompanyNames = new Set([...companyNames].map(name => name.replace(/[^\w\s]/g, '')));

    const addedCompanies = new Set();

    // Add company names detected in the sentence to the predicted tags
    companyNames.forEach(companyName => {
      const companyNameClean = companyName.replace(/[^\w\s]/g, '');
      if (sentence.includes(companyNameClean) && !addedCompanies.has(companyNameClean)) {
        predictedTags.push({ key: companyName, tag: 'ORG' });
        addedCompanies.add(companyNameClean);
      }
    });

    // Use compromise to identify entities
    const entities = doc.topics().out('array'); // Use topics or other methods if 'entities' is not available

    entities.forEach(entity => {
      const entityName = entity.trim().replace(/[^\w\s]/g, '');
      if (!canonicalCompanyNames.has(entityName)) {
        predictedTags.push({ key: entity, tag: 'unknown' }); // Adjust tag as necessary
      }
    });

    // Add undefined words as predicted tags
    const predictedWords = new Set(entities.map(entity => entity.trim().replace(/[^\w\s]/g, '')));
    const allWords = new Set(sentence.split(' ').map(word => word.trim().replace(/[^\w\s]/g, '')));
    const undefinedWords = [...allWords].filter(word => !predictedWords.has(word));

    undefinedWords.forEach(word => {
      if (!canonicalCompanyNames.has(word)) {
        predictedTags.push({ key: word, tag: 'undefined' });
      }
    });

    return predictedTags;
  } catch (error) {
    console.error('Error in getPredictedTags:', error.message, error.stack);
    throw new Error('Failed to get predicted tags');
  }
}

module.exports = { getPredictedTags, PredictedTag };
