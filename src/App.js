import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizEditor from './QuizEditor';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/.netlify/functions/getQuestions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
      if (data.length === 0) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setIsEditing(true);
    }
  };

  const saveQuestions = async (newQuestions) => {
    try {
      const response = await fetch('/.netlify/functions/saveQuestions', {
        method: 'POST',
        body: JSON.stringify(newQuestions)
      });
      if (!response.ok) throw new Error('Failed to save questions');
      setQuestions(newQuestions);
      startQuiz();
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(null);
    setIsEditing(false);
  };

  const handleAnswer = (choiceIndex) => {
    setUserAnswers([...userAnswers, choiceIndex]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const newScore = questions.reduce((acc, question, index) => {
      return acc + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    setScore(newScore);
  };

  if (isEditing) {
    return <QuizEditor onSaveQuestions={saveQuestions} initialQuestions={questions} />;
  }

  return (
    <Container className="mt-5">
      {currentQuestion === -1 ? (
        <Card className="text-center">
          <Card.Body>
            <Card.Title as="h1">Welcome to the Quiz!</Card.Title>
            <Button variant="primary" size="lg" className="mt-3" onClick={startQuiz}>
              Start the Quiz
            </Button>
          </Card.Body>
        </Card>
      ) : score !== null ? (
        <Card className="text-center">
          <Card.Body>
            <Card.Title as="h2">Quiz Completed!</Card.Title>
            <Card.Text>Your score: {score} out of {questions.length}</Card.Text>
            <Button variant="primary" className="mt-3 me-2" onClick={startQuiz}>
              Restart Quiz
            </Button>
            <Button variant="secondary" className="mt-3" onClick={() => setIsEditing(true)}>
              Edit Questions
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Card.Title as="h2">Question {currentQuestion + 1}</Card.Title>
            <Card.Text>{questions[currentQuestion].question}</Card.Text>
            <Form>
              {questions[currentQuestion].choices.map((choice, index) => (
                <Form.Check 
                  type="radio"
                  id={`choice${index}`}
                  label={choice}
                  name="quizChoice"
                  key={index}
                  onChange={() => handleAnswer(index)}
                />
              ))}
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default App;