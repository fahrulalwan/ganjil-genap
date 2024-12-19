import { Card, CardContent } from '@/components/ui/card';

interface AdSensePlaceholderProps {
  className?: string;
}

export default function AdSensePlaceholder({
  className = '',
}: Readonly<AdSensePlaceholderProps>) {
  return (
    <Card className={className}>
      <CardContent className="p-4 text-center">
        <p className="text-muted-foreground">AdSense Placeholder</p>
        <p className="text-sm text-muted-foreground">
          Ads will be displayed here based on your configuration
        </p>
      </CardContent>
    </Card>
  );
}
