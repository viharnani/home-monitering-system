
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { login } from "@/services/api";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to EnergyHarmony dashboard",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("demo123");
    try {
      setLoading(true);
      await login("demo@example.com", "demo123");
      toast({
        title: "Demo mode active",
        description: "Logged in with demo account",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in with demo account",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold">EnergyHarmony</h1>
          </div>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Login to your account to view your energy dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full transition-all-200"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Demo Account
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
