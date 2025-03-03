
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface EnergyBudgetProps {
  currentUsage: number;
  className?: string;
}

const EnergyBudget = ({ currentUsage, className }: EnergyBudgetProps) => {
  const [budget, setBudget] = useState<number>(300);
  const { toast } = useToast();
  
  const usagePercentage = (currentUsage / budget) * 100;
  
  const handleSliderChange = (value: number[]) => {
    setBudget(value[0]);
  };
  
  const getStatusColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-amber-500";
    return "bg-primary";
  };
  
  const handleSave = () => {
    toast({
      title: "Budget Updated",
      description: `Your energy budget has been set to ${budget} kWh`,
    });
  };

  return (
    <Card className={cn("overflow-hidden transition-all-300", className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">Energy Budget</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Current Usage</span>
              <span className="font-medium">{currentUsage} kWh of {budget} kWh</span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-2"
              indicatorClassName={getStatusColor()}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm">Adjust Budget</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">100</span>
              <Slider
                value={[budget]}
                min={100}
                max={500}
                step={10}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">500</span>
            </div>
          </div>
          
          <div className="py-1 px-2 bg-secondary rounded-md">
            <p className="text-xs text-muted-foreground">
              {usagePercentage >= 90 
                ? "Warning: You are close to exceeding your budget!" 
                : usagePercentage >= 75 
                  ? "Caution: You have used over 75% of your budget."
                  : "Your energy usage is within the budget."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button 
          onClick={handleSave} 
          className="w-full transition-all-200 hover:shadow-md"
        >
          Save Budget
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnergyBudget;
