import type { FC } from 'react';
import { Button } from '@/components/ui/button';

const MapSimulationCard: FC<{
  handleTimeChange: (hour: number, minute: number, day?: number) => void;
  currentTime: Date;
}> = ({ handleTimeChange, currentTime }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Morning Policy (06:00-10:00)
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => handleTimeChange(8, 0)}>
            During (8:00)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(9, 45)}>
            Ending Soon (9:45)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(5, 15)}>
            Starting Soon (5:15)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(4, 0)}>
            Before (4:00)
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Between Policies
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => handleTimeChange(10, 15)}>
            After Morning (10:15)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(12, 0)}>
            Midday (12:00)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(14, 0)}>
            Before Evening (14:00)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(11, 30)}>
            Late Morning (11:30)
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Evening Policy (16:00-21:00)
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => handleTimeChange(17, 0)}>
            During (17:00)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(20, 45)}>
            Ending Soon (20:45)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(15, 15)}>
            Starting Soon (15:15)
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(22, 0)}>
            After (22:00)
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Weekend (No Policy)
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => handleTimeChange(8, 0, 6)}>
            Saturday 8:00
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(17, 0, 6)}>
            Saturday 17:00
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(8, 0, 7)}>
            Sunday 8:00
          </Button>
          <Button size="sm" onClick={() => handleTimeChange(17, 0, 7)}>
            Sunday 17:00
          </Button>
        </div>
      </div>

      <div className="text-xs text-center text-muted-foreground">
        Current Time:{' '}
        {currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}{' '}
        {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MapSimulationCard;
