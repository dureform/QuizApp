const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const filePath = path.join(__dirname, 'questions.json');
    const data = await fs.promises.readFile(filePath, 'utf8');
    return {
      statusCode: 200,
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read questions' })
    };
  }
};