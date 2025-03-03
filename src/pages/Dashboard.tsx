
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut, 
  Zap, 
  LineChart, 
  PiggyBank, 
  Home 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  fetchDailyUsage, 
  fetchWeeklyUsage, 
  fetchDevices, 
  fetchEnergySummary,
  logout, 
  getCurrentUser 
} from "@/services/api";
import EnergyCard from "@/components/dashboard/EnergyCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import UsageChart from "@/components/dashboard/UsageChart";
import EnergyBudget from "@/components/dashboard/EnergyBudget";
import { DeviceData } from "@/components/dashboard/DeviceCard";
import { UsageDataPoint } from "@/components/dashboard/UsageChart";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyUsage, setDailyUsage] = useState<UsageDataPoint[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<UsageDataPoint[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [summary, setSummary] = useState({
    currentUsage: 0,
    dailyAverage: 0,
    weeklyTotal: 0,
    monthlyProjection: 0,
    savingsPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Check authentication
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);
  
  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dailyData, weeklyData, deviceData, summaryData] = await Promise.all([
          fetchDailyUsage(),
          fetchWeeklyUsage(),
          fetchDevices(),
          fetchEnergySummary(),
        ]);
        
        setDailyUsage(dailyData);
        setWeeklyUsage(weeklyData);
        setDevices(deviceData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your energy data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const activeDevices = devices.filter(device => device.isActive);
  const currentPowerUsage = activeDevices.reduce(
    (total, device) => total + device.consumption, 
    0
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden sm:flex w-64 flex-col border-r p-4 bg-card">
        <div className="flex items-center space-x-2 mb-8">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-medium">EnergyHarmony</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setActiveTab("devices")}
          >
            <Home className="mr-2 h-4 w-4" />
            Devices
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setActiveTab("history")}
          >
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setActiveTab("budget")}
          >
            <PiggyBank className="mr-2 h-4 w-4" />
            Budget
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start mt-auto"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <div className="container mx-auto max-w-7xl animate-fade-in">
          {/* Mobile header */}
          <div className="flex justify-between items-center mb-6 sm:hidden">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-medium">EnergyHarmony</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="md:hidden mb-4">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview" className="text-xs">
                  <LayoutDashboard className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="devices" className="text-xs">
                  <Home className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Devices</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs">
                  <History className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="budget" className="text-xs">
                  <PiggyBank className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Budget</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="animate-slide-up">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-semibold">Energy Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <EnergyCard 
                  title="Current Usage" 
                  value={summary.currentUsage} 
                  unit="kWh"
                  icon={<Activity className="h-4 w-4" />}
                />
                <EnergyCard 
                  title="Daily Average" 
                  value={summary.dailyAverage} 
                  unit="kWh"
                  icon={<LineChart className="h-4 w-4" />}
                  trend={{ value: 5.2, isPositive: false }}
                />
                <EnergyCard 
                  title="Weekly Total" 
                  value={summary.weeklyTotal} 
                  unit="kWh"
                  icon={<LineChart className="h-4 w-4" />}
                />
                <EnergyCard 
                  title="Active Power" 
                  value={currentPowerUsage} 
                  unit="W"
                  icon={<Zap className="h-4 w-4" />}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <UsageChart 
                  data={dailyUsage} 
                  title="Today's Energy Usage" 
                  className="lg:col-span-2"
                />
                <EnergyBudget currentUsage={summary.weeklyTotal} />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Active Devices</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDevices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Devices Tab */}
            <TabsContent value="devices" className="animate-slide-up">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-semibold">Connected Devices</h2>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map(device => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history" className="animate-slide-up">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-semibold">Energy History</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Day</Button>
                  <Button variant="default" size="sm">Week</Button>
                  <Button variant="outline" size="sm">Month</Button>
                </div>
              </div>
              
              <UsageChart data={weeklyUsage} title="Weekly Energy Usage" />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Insights</h3>
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm">
                    Your energy usage has {summary.savingsPercentage > 0 ? "decreased" : "increased"} by{" "}
                    <span className={summary.savingsPercentage > 0 ? "text-green-500" : "text-red-500"}>
                      {Math.abs(summary.savingsPercentage)}%
                    </span>{" "}
                    compared to last week. {summary.savingsPercentage > 0 
                      ? "Great job on saving energy!" 
                      : "Consider reviewing your usage patterns to save energy."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Budget Tab */}
            <TabsContent value="budget" className="animate-slide-up">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-semibold">Energy Budget</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnergyBudget currentUsage={summary.weeklyTotal} />
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-medium">Monthly Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold">{summary.monthlyProjection}</span>
                        <span className="ml-1 text-muted-foreground text-sm">kWh</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on your current usage patterns, your projected monthly consumption is {summary.monthlyProjection} kWh.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-medium">Budget Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Set your thermostat to an efficient temperature
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Unplug devices when not in use
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Use energy-efficient appliances
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          Schedule appliance usage during off-peak hours
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
