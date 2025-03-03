
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, LayoutDashboard, PiggyBank, History, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/services/api";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-semibold">EnergyHarmony</h1>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Smarter energy for your smart home
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Monitor, analyze, and optimize your home's energy consumption with our intelligent IoT platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="transition-all-200 hover:shadow-md"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="transition-all-200"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 shadow-2xl animate-float">
                <div className="glass-effect rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Energy Dashboard</h3>
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-md animate-pulse-subtle"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-20 bg-primary/10 rounded-md"></div>
                      <div className="h-20 bg-primary/10 rounded-md"></div>
                      <div className="h-20 bg-primary/10 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-16 w-16 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-primary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Smarter Energy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm transition-all-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track your energy usage in real-time with intuitive visualizations and dashboards.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm transition-all-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Historical Analysis</h3>
                <p className="text-muted-foreground">
                  Analyze your energy consumption patterns over time to identify opportunities for savings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm transition-all-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Energy Budgeting</h3>
                <p className="text-muted-foreground">
                  Set energy budgets and receive alerts when you're approaching your limits.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm transition-all-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Smart Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations to optimize your energy usage and reduce costs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-xl p-8 shadow-sm border max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to optimize your energy usage?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of smart homeowners who are saving energy and reducing their carbon footprint.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="transition-all-200 hover:shadow-md"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">EnergyHarmony</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 EnergyHarmony. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
