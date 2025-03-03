
import { DeviceData } from "@/components/dashboard/DeviceCard";
import { UsageDataPoint } from "@/components/dashboard/UsageChart";

// Mock data for frontend development
// In a real app, this would connect to our backend API

// Daily usage data
export const fetchDailyUsage = (): Promise<UsageDataPoint[]> => {
  const mockData: UsageDataPoint[] = [
    { time: "00:00", usage: 2.1 },
    { time: "03:00", usage: 1.5 },
    { time: "06:00", usage: 2.3 },
    { time: "09:00", usage: 3.2 },
    { time: "12:00", usage: 4.1 },
    { time: "15:00", usage: 3.8 },
    { time: "18:00", usage: 4.5 },
    { time: "21:00", usage: 3.2 },
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 800);
  });
};

// Weekly usage data
export const fetchWeeklyUsage = (): Promise<UsageDataPoint[]> => {
  const mockData: UsageDataPoint[] = [
    { time: "Mon", usage: 22.5 },
    { time: "Tue", usage: 21.3 },
    { time: "Wed", usage: 25.2 },
    { time: "Thu", usage: 28.4 },
    { time: "Fri", usage: 30.1 },
    { time: "Sat", usage: 32.5 },
    { time: "Sun", usage: 24.8 },
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 800);
  });
};

// Device data
export const fetchDevices = (): Promise<DeviceData[]> => {
  const mockData: DeviceData[] = [
    { id: "1", name: "Living Room Lights", consumption: 45, type: "light", isActive: true },
    { id: "2", name: "Kitchen Refrigerator", consumption: 120, type: "refrigerator", isActive: true },
    { id: "3", name: "Home Office PC", consumption: 210, type: "computer", isActive: true },
    { id: "4", name: "Living Room TV", consumption: 130, type: "tv", isActive: false },
    { id: "5", name: "Bedroom Lights", consumption: 30, type: "light", isActive: false },
    { id: "6", name: "Kitchen TV", consumption: 90, type: "tv", isActive: false },
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 1000);
  });
};

// Energy summary
export interface EnergySummary {
  currentUsage: number;
  dailyAverage: number;
  weeklyTotal: number;
  monthlyProjection: number;
  savingsPercentage: number;
}

export const fetchEnergySummary = (): Promise<EnergySummary> => {
  const mockData: EnergySummary = {
    currentUsage: 2.3,
    dailyAverage: 24.5,
    weeklyTotal: 171.5,
    monthlyProjection: 735,
    savingsPercentage: 8.5,
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 600);
  });
};

// Mock authentication
export interface User {
  id: string;
  name: string;
  email: string;
}

export const login = (email: string, password: string): Promise<User> => {
  // In a real app, this would check credentials with the backend
  if (email && password) {
    const mockUser: User = {
      id: "user-123",
      name: "Demo User",
      email: email
    };
    
    // Save to sessionStorage for persistence
    sessionStorage.setItem("user", JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  }
  
  return Promise.reject(new Error("Invalid credentials"));
};

export const logout = (): Promise<void> => {
  sessionStorage.removeItem("user");
  return Promise.resolve();
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
