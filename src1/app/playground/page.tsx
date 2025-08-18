'use client';
import { useState, useRef, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { testPromptAction, improvePromptAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot, Wand2, Lightbulb } from 'lucide-react';
import { withAuth } from '@/components/withAuth';

function SubmitButton({
  isPending,
  icon,
  text,
}: {
  isPending: boolean;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Button type="submit" disabled={isPending} className="w-full md:w-auto">
      {isPending ? (
        <span className="animate-spin mr-2">
          <Sparkles />
        </span>
      ) : (
        icon
      )}
      {isPending ? 'Processing...' : text}
    </Button>
  );
}

function PlaygroundTab() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(testPromptAction, {
    message: '',
    data: null,
  });

  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Playground</CardTitle>
        <CardDescription>
          Test your prompts in real-time and see the AI's response.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
        >
          <Textarea
            name="prompt"
            placeholder="e.g., Explain the concept of zero-shot prompting in simple terms."
            className="min-h-[150px] text-base"
            required
          />
          <div className="flex justify-end">
            <SubmitButton
              isPending={isPending}
              icon={<Bot />}
              text="Run Prompt"
            />
          </div>
        </form>
        {isPending && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-muted-foreground">
            <Sparkles className="animate-pulse" />
            <span>AI is thinking...</span>
          </div>
        )}
        {state.data && !isPending && (
          <Card className="mt-6 bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot /> AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                {state.data}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

function ImproverTab() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(improvePromptAction, {
    message: '',
    data: null,
  });

  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prompt Improver</CardTitle>
        <CardDescription>
          Get AI-powered suggestions to make your prompts more effective.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
        >
          <Textarea
            name="prompt"
            placeholder="Enter your prompt draft here..."
            className="min-h-[150px] text-base"
            required
          />
          <div className="flex justify-end">
            <SubmitButton
              isPending={isPending}
              icon={<Wand2 />}
              text="Improve Prompt"
            />
          </div>
        </form>
        {isPending && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-muted-foreground">
            <Sparkles className="animate-pulse" />
            <span>AI is analyzing...</span>
          </div>
        )}
        {state.data && !isPending && (
          <div className="mt-6 space-y-6">
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 /> Improved Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  {state.data.improvedPrompt}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb /> Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  {state.data.explanation}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PlaygroundPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
          AI Playground
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
          Hone your prompt engineering skills with our powerful AI tools.
        </p>
      </div>

      <Tabs defaultValue="playground" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="improver">Prompt Improver</TabsTrigger>
        </TabsList>
        <TabsContent value="playground">
          <PlaygroundTab />
        </TabsContent>
        <TabsContent value="improver">
          <ImproverTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(PlaygroundPage);
