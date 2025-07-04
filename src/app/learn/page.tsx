import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { learningContent } from '@/data/content';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const levels = Object.keys(learningContent) as (keyof typeof learningContent)[];

export const metadata = {
  title: 'Learning Roadmap | VibeLearn AI',
  description: 'Your interactive roadmap to mastering prompt engineering.',
};

export default function LearnPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
          Learning Roadmap
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
          Start your journey from the basics and progress to advanced
          techniques. Select a level to begin.
        </p>
      </div>

      <Tabs defaultValue="beginner" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
          {levels.map((level) => (
            <TabsTrigger key={level} value={level} className="capitalize">
              {level}
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((level) => (
          <TabsContent key={level} value={level} className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">{learningContent[level].title}</h2>
                <p className="text-muted-foreground mt-2">{learningContent[level].description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningContent[level].topics.map((topic, index) => (
                <Link
                  href={`/learn/${level}/${topic.slug}`}
                  key={index}
                  className="flex group"
                >
                  <Card className="flex flex-col w-full hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl bg-card/50 hover:bg-card">
                    <CardHeader>
                       <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-3">{topic.details}</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm font-medium text-primary flex items-center">
                        Explore Topic <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
