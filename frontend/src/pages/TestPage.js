import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TestPage = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [level]);

  const fetchTest = async () => {
    try {
      const response = await axios.get(`${API}/tests/${level}`);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement du test');
      navigate('/');
    }
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast.error('Veuillez sélectionner une réponse');
      return;
    }

    const newAnswers = [
      ...answers,
      {
        question_id: questions[currentQuestion].id,
        selected_option: selectedOption
      }
    ];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers) => {
    try {
      const response = await axios.post(`${API}/tests/submit`, {
        level,
        answers: finalAnswers
      });
      setResult(response.data);
      toast.success('Test terminé!');
    } catch (error) {
      toast.error('Erreur lors de la soumission du test');
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Test Terminé !</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {result.percentage}%
              </div>
              <p className="text-xl text-gray-600">
                {result.score} / {result.total} réponses correctes
              </p>
              <p className="text-lg text-gray-500 mt-2">
                Niveau: <span className="font-semibold capitalize">{result.level}</span>
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRestart}
                className="w-full"
                data-testid="test-restart-button"
              >
                Refaire le test
              </Button>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full" data-testid="test-home-button">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quitter le test
        </Link>

        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl capitalize">
                Test {level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </CardTitle>
              <span className="text-sm font-semibold text-gray-600">
                Question {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                {questions[currentQuestion]?.question}
              </h3>

              <RadioGroup value={selectedOption?.toString()} onValueChange={(val) => setSelectedOption(parseInt(val))}>
                <div className="space-y-3">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOption(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                data-testid="test-quit-button"
              >
                Quitter
              </Button>
              <Button
                onClick={handleNext}
                data-testid="test-next-button"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Suivant <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  'Terminer'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
