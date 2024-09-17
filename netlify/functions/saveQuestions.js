const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const questions = JSON.parse(event.body);
    const filePath = path.join(__dirname, 'questions.json');
    await fs.promises.writeFile(filePath, JSON.stringify(questions, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Questions saved successfully' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save questions' })
    };
  }
};