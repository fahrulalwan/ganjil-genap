import { cn } from '@/lib/utils';
import type { FC, Ref } from 'react';

interface AdSensePlaceholderProps {
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const AdSensePlaceholder: FC<AdSensePlaceholderProps> = ({
  className = '',
  ref,
}) => {
  return (
    <div ref={ref} className={cn('p-4 text-center bg-background', className)}>
      <p className="text-muted-foreground">AdSense Placeholder</p>
      <p className="text-sm text-muted-foreground">
        Ads will be displayed here based on your configuration
      </p>
    </div>
  );
};

export default AdSensePlaceholder;
