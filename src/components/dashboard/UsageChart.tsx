
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface UsageDataPoint {
  time: string;
  usage: number;
}

interface UsageChartProps {
  data: UsageDataPoint[];
  title: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-2 rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          {payload[0].value} kWh
        </p>
      </div>
    );
  }

  return null;
};

const UsageChart = ({ data, title, className }: UsageChartProps) => {
  const [chartData, setChartData] = useState<UsageDataPoint[]>([]);

  // Animate data loading
  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <Card className={cn("overflow-hidden transition-all-300", className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dx={-10}
              tickFormatter={(value) => `${value}kWh`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="usage" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorUsage)"
              strokeWidth={2}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
