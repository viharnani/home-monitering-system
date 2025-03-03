
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnergyCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const EnergyCard = ({ title, value, unit, icon, className, trend }: EnergyCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-all-300 hover:shadow-md", className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold">{value}</span>
          {unit && <span className="ml-1 text-muted-foreground text-sm">{unit}</span>}
        </div>
        
        {trend && (
          <div className="flex items-center mt-1 text-xs">
            <span className={cn(
              "inline-flex",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-muted-foreground">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyCard;
