
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, PenTool, Puzzle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 text-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6">
            <Logo className="h-36 w-36" />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Unlock the Power of AI with VibeLearn
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                Your personal guide to mastering prompt engineering. Explore our
                curriculum, sharpen your skills in the interactive playground,
                and test your knowledge with AI-powered quizzes.
              </p>
            </div>
            {!user && (
               <div className="pt-6">
                <Button asChild size="lg">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features/Navigation Section - Conditionally render for logged-in users */}
      {user && (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
              <Link href="/learn" className="group">
                <Card className="h-full flex flex-col justify-between text-center p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-left-8">
                  <CardHeader className="p-0 items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline">
                      Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-muted-foreground">
                      Explore our comprehensive curriculum, from beginner basics
                      to professional strategies.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/playground" className="group">
                <Card className="h-full flex flex-col justify-between text-center p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 delay-150">
                  <CardHeader className="p-0 items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                      <PenTool className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline">
                      Playground
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-muted-foreground">
                      Experiment with your own prompts and get instant feedback
                      from a live AI model.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/quiz" className="group">
                <Card className="h-full flex flex-col justify-between text-center p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-right-8 delay-300">
                  <CardHeader className="p-0 items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                      <Puzzle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline">
                      Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-muted-foreground">
                      Test your knowledge with AI-generated quizzes to solidify
                      your understanding.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
