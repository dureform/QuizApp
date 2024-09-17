import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';

const QuizEditor = ({ onSaveQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    choices: ['', '', ''],
    correctAnswer: 0
  });

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleChoiceChange = (index, e) => {
    const newChoices = [...currentQuestion.choices];
    newChoices[index] = e.target.value;
    setCurrentQuestion({ ...currentQuestion, choices: newChoices });
  };

  const handleCorrectAnswerChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) });
  };

  const addQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      question: '',
      choices: ['', '', ''],
      correctAnswer: 0
    });
  };

  const saveQuestions = () => {
    onSaveQuestions(questions);
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>Quiz Editor</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter question"
              />
            </Form.Group>
            {currentQuestion.choices.map((choice, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>Choice {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e)}
                  placeholder={`Enter choice ${index + 1}`}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control
                as="select"
                value={currentQuestion.correctAnswer}
                onChange={handleCorrectAnswerChange}
              >
                {currentQuestion.choices.map((_, index) => (
                  <option key={index} value={index}>Choice {index + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={addQuestion}>
              Add Question
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Added Questions</Card.Title>
          {questions.map((q, index) => (
            <p key={index}>{index + 1}. {q.question}</p>
          ))}
          {questions.length > 0 && (
            <Button variant="success" onClick={saveQuestions}>
              Save Questions and Start Quiz
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizEditor;