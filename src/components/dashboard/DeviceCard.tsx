
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lightbulb, Laptop, Tv, Refrigerator } from "lucide-react";

export interface DeviceData {
  id: string;
  name: string;
  consumption: number;
  type: "light" | "computer" | "tv" | "refrigerator" | "other";
  isActive: boolean;
}

interface DeviceCardProps {
  device: DeviceData;
  className?: string;
}

const DeviceCard = ({ device, className }: DeviceCardProps) => {
  const getDeviceIcon = () => {
    switch (device.type) {
      case "light":
        return <Lightbulb className="w-5 h-5" />;
      case "computer":
        return <Laptop className="w-5 h-5" />;
      case "tv":
        return <Tv className="w-5 h-5" />;
      case "refrigerator":
        return <Refrigerator className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all-300 hover:shadow-md",
      device.isActive 
        ? "border-l-4 border-l-primary" 
        : "opacity-80",
      className
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">
          {device.name}
        </CardTitle>
        <div className={cn(
          "p-1.5 rounded-full",
          device.isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {getDeviceIcon()}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold">{device.consumption}</span>
          <span className="ml-1 text-muted-foreground text-sm">W</span>
        </div>
        <div className="mt-1">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            device.isActive 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            {device.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
