import { CircleHelp as HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CompatibilityScoreProps {
  score: number;
  className?: string;
  showProgressBar?: boolean;
}

const getCompatibilityMessage = (score: number): string => {
  if (score >= 95) {
    return "Drop-in replacement (95–100%).";
  } else if (score >= 85) {
    return "Minor changes needed (85–94%).";
  } else {
    return "Redesign required (<85%).";
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 95) {
    return "text-green-600";
  } else if (score >= 85) {
    return "text-yellow-600";
  } else {
    return "text-orange-600";
  }
};

const getProgressBarColor = (score: number): string => {
  if (score >= 95) {
    return "bg-green-500";
  } else if (score >= 85) {
    return "bg-yellow-500";
  } else {
    return "bg-orange-500";
  }
};

export default function CompatibilityScore({ 
  score, 
  className,
  showProgressBar = false 
}: CompatibilityScoreProps) {
  const message = getCompatibilityMessage(score);
  const scoreColor = getScoreColor(score);
  const progressColor = getProgressBarColor(score);

  return (
    <TooltipProvider>
      <div className={cn("flex items-center space-x-2", className)}>
        {showProgressBar && (
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div
              className={cn("h-2 rounded-full", progressColor)}
              style={{ width: `${score}%` }}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <span className={cn("text-sm font-medium", scoreColor)}>
            {score}%
          </span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center"
                aria-label="Compatibility definition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-xs bg-white border shadow-md rounded-md p-2"
            >
              <p className="text-sm text-gray-700">
                {message}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}