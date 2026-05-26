import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ElementType } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  description?: string;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, description, color = 'text-primary' }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`w-4 h-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
