import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ExternalLink, Bot, User, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Source {
  title: string;
  url: string;
  type: 'document' | 'chart' | 'news' | 'analysis';
}

interface AIAnswerCardProps {
  question: string;
  answer: string;
  sources?: Source[];
  timestamp: Date;
  onContactExpert: (question: string, answer: string) => void;
  className?: string;
}

export default function AIAnswerCard({
  question,
  answer,
  sources = [],
  timestamp,
  onContactExpert,
  className
}: AIAnswerCardProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const { t } = useLanguage();

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    if (type === 'not-helpful') {
      setShowEscalation(true);
    }
  };

  const handleContactExpert = () => {
    onContactExpert(question, answer);
    setShowEscalation(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span>{t('ai.assistantResponse')}</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {t('ai.generated')}
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 font-medium">
            "{question}"
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            {answer.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h4 key={index} className="font-semibold mt-3 mb-1 first:mt-0 text-foreground">{paragraph.slice(2, -2)}</h4>;
              }
              if (paragraph.startsWith('• ')) {
                return <li key={index} className="ml-4 list-disc text-foreground">{paragraph.slice(2)}</li>;
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="mb-2 last:mb-0 text-foreground">{paragraph}</p>;
            })}
          </div>

          {sources.length > 0 && (
            <div className="pt-3 border-t border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Sources:</p>
              {sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {source.type}
                  </Badge>
                  <a href={source.url} className="text-xs hover:underline flex items-center space-x-1 text-blue-600">
                    <span>{source.title}</span>
                    <ExternalLink className="w-2 h-2" />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{t('ai.wasThisHelpful')}</span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant={feedback === 'helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback('helpful')}
                    className="h-8 px-3"
                    aria-label="Mark as helpful"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {t('ai.helpful')}
                  </Button>
                  <Button
                    variant={feedback === 'not-helpful' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback('not-helpful')}
                    className="h-8 px-3"
                    aria-label="Mark as not helpful"
                  >
                    <ThumbsDown className="w-3 h-3 mr-1" />
                    {t('ai.notHelpful')}
                  </Button>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </span>
            </div>

            {showEscalation && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">{t('ai.needMoreHelp')}</h4>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                      {t('ai.aiLimitedContext')}
                    </p>
                    <Button
                      onClick={handleContactExpert}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white"
                    >
                      {t('ai.contactMacnicaExpert')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {feedback === 'helpful' && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-200 font-medium">{t('ai.thankYouFeedback')}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}