
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { generateQuizAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { withAuth } from '@/components/withAuth';
import { useToast } from '@/hooks/use-toast';

type AnswersState = { [key: number]: string };
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function QuizSkeleton() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline text-center">
          Generating Your Quiz...
        </CardTitle>
        <CardDescription className="text-center">
          Our AI is crafting some questions for you. Please wait a moment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
        </div>
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    const result = await generateQuizAction();
    if (result.questions) {
      setQuizQuestions(result.questions);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [activeQuestion]: value }));
  };

  const handleNext = () => {
    if (activeQuestion < quizQuestions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;
    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = correctAnswers;
    setScore(finalScore);
    setShowResult(true);
  };

  const handleReset = () => {
    setActiveQuestion(0);
    setAnswers({});
    setShowResult(false);
    setScore(0);
    fetchQuiz(); // Fetch a new set of questions
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <QuizSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 text-center">
         <Card className="shadow-xl">
           <CardContent className="p-8">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Failed to Load Quiz</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button onClick={fetchQuiz} className="mt-6">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
           </CardContent>
         </Card>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4 text-center">
            <p>No quiz questions available.</p>
        </div>
    )
  }

  const currentQuestion = quizQuestions[activeQuestion];
  const progress = ((activeQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline text-center">
            Knowledge Check
          </CardTitle>
          <CardDescription className="text-center">
            Test your understanding with these AI-generated questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Question {activeQuestion + 1} of {quizQuestions.length}
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">
              {currentQuestion.question}
            </h3>
            <RadioGroup
              value={answers[activeQuestion] || ''}
              onValueChange={handleOptionChange}
              className="mt-4 space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <Label
                  key={index}
                  className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:border-primary transition-all"
                >
                  <RadioGroupItem value={option} id={`q${activeQuestion}-o${index}`} />
                  <span>{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Quiz
            </Button>
            {activeQuestion < quizQuestions.length - 1 ? (
              <Button onClick={handleNext} disabled={!answers[activeQuestion]}>
                Next &rarr;
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!answers[activeQuestion]}>
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-headline">
              Quiz Results
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You scored {score} out of {quizQuestions.length}!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Progress value={(score / quizQuestions.length) * 100} />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-4 p-1">
            {quizQuestions.map((q, index) => (
              <div key={index} className="text-sm p-2 rounded-md" style={{ background: answers[index] === q.correctAnswer ? 'hsla(var(--success)/0.1)' : 'hsla(var(--destructive)/0.1)'}}>
                <p className="font-semibold flex items-center gap-2">
                   {answers[index] === q.correctAnswer ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                  {q.question}
                </p>
                 <p className="text-muted-foreground pl-6">
                    {answers[index] === q.correctAnswer ? `Your answer: ${answers[index]}` : `Correct answer: ${q.correctAnswer}`}
                 </p>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleReset}>
              Try a New Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAuth(QuizPage);
