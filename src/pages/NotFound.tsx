
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="flex justify-center mb-6">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! We couldn't find that page.</p>
        
        <div className="flex justify-center">
          <Button asChild>
            <a href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
