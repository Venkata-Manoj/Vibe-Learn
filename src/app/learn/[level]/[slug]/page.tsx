
import { learningContent } from '@/data/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Level = keyof typeof learningContent;

const levels = Object.keys(learningContent) as Level[];
const allTopics = levels.flatMap((level) =>
  learningContent[level].topics.map((topic) => ({
    level,
    ...topic,
  }))
);

const getTopicData = (level: Level, slug: string) => {
  const levelData = learningContent[level];
  if (!levelData) {
    notFound();
  }

  const topicIndex = allTopics.findIndex(
    (t) => t.level === level && t.slug === slug
  );

  if (topicIndex === -1) {
    notFound();
  }

  const topic = allTopics[topicIndex];
  const prevTopic = topicIndex > 0 ? allTopics[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < allTopics.length - 1 ? allTopics[topicIndex + 1] : null;

  return {
    topic,
    levelTitle: levelData.title,
    prevTopic,
    nextTopic,
  };
};

export async function generateStaticParams() {
  const paths: { level: string; slug: string }[] = [];
  Object.keys(learningContent).forEach((level) => {
    const contentLevel = learningContent[level as Level];
    contentLevel.topics.forEach((topic) => {
      if (topic.slug) {
        paths.push({
          level,
          slug: topic.slug,
        });
      }
    });
  });
  return paths;
}

export function generateMetadata({ params }: { params: { level: Level; slug: string } }) {
  const { topic } = getTopicData(params.level, params.slug);
  const title = topic.title.replace(/[\u{1F600}-\u{1F64F}\u{2600}-\u{26FF}]/gu, '').trim();
  return {
    title: `${title} | VibeLearn AI`,
    description: topic.details,
  };
}

export default function TopicPage({ params }: { params: { level: Level; slug: string } }) {
  const { topic, prevTopic, nextTopic } = getTopicData(params.level, params.slug);

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 -ml-4">
          <Link href="/learn">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmap
          </Link>
        </Button>
        <p className="text-sm font-medium text-primary capitalize">{params.level}</p>
         <h1 className="text-4xl font-bold font-headline">
          {topic.title}
        </h1>
      </div>

        <Card className="flex flex-col shadow-lg transition-shadow duration-300 bg-card/60">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-base">{topic.details}</p>

                {topic.examples && topic.examples.length > 0 && (
                  <Accordion type="single" collapsible className="w-full mt-4" defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <h4 className="font-semibold text-primary not-prose flex items-center text-lg">
                          <Lightbulb className="h-5 w-5 mr-2" />
                          Real-World Examples
                        </h4>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc space-y-4 pl-5">
                          {topic.examples.map((example, exIndex) => (
                            <li key={exIndex} className="text-muted-foreground">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>

      <div className="mt-12 flex justify-between items-center">
        {prevTopic ? (
          <Button asChild variant="outline">
            <Link href={`/learn/${prevTopic.level}/${prevTopic.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Topic
            </Link>
          </Button>
        ) : (
          <div /> 
        )}

        {nextTopic ? (
          <Button asChild>
            <Link href={`/learn/${nextTopic.level}/${nextTopic.slug}`}>
              Next Topic
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href="/quiz">Test your knowledge &rarr;</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
