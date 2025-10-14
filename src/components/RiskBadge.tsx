import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  type: 'eol' | 'lead-time' | 'price' | 'factory' | 'moq' | 'low' | 'medium' | 'high' | 'critical';
  children: React.ReactNode;
  className?: string;
}

const riskColors = {
  eol: 'bg-red-100 text-red-800 border-red-200',
  'lead-time': 'bg-orange-100 text-orange-800 border-orange-200',
  price: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  factory: 'bg-purple-100 text-purple-800 border-purple-200',
  moq: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

export default function RiskBadge({ type, children, className }: RiskBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'border',
        riskColors[type],
        className
      )}
    >
      {children}
    </Badge>
  );
}