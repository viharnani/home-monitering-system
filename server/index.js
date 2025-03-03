
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/energy-harmony')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  consumption: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  timestamp: { type: Date, default: Date.now },
  usage: { type: Number, required: true }
});

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Device = mongoose.model('Device', deviceSchema);
const Usage = mongoose.model('Usage', usageSchema);
const Budget = mongoose.model('Budget', budgetSchema);

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Devices
app.get('/api/devices', authenticate, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user.id });
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/devices', authenticate, async (req, res) => {
  try {
    const { name, type, consumption, isActive } = req.body;
    
    const device = new Device({
      userId: req.user.id,
      name,
      type,
      consumption,
      isActive
    });
    
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/devices/:id', authenticate, async (req, res) => {
  try {
    const { name, type, consumption, isActive } = req.body;
    
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    device.name = name || device.name;
    device.type = type || device.type;
    device.consumption = consumption !== undefined ? consumption : device.consumption;
    device.isActive = isActive !== undefined ? isActive : device.isActive;
    
    await device.save();
    res.json(device);
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/devices/:id', authenticate, async (req, res) => {
  try {
    const result = await Device.deleteOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json({ message: 'Device deleted' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Usage data
app.get('/api/usage/daily', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usageData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: today }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' }
          },
          usage: { $sum: '$usage' }
        }
      },
      {
        $sort: { '_id.hour': 1 }
      }
    ]);
    
    // Format data for frontend
    const formattedData = usageData.map(entry => ({
      time: `${entry._id.hour}:00`,
      usage: parseFloat(entry.usage.toFixed(2))
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Get daily usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/usage/weekly', authenticate, async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const usageData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: weekStart }
        }
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$timestamp' }
          },
          usage: { $sum: '$usage' }
        }
      },
      {
        $sort: { '_id.dayOfWeek': 1 }
      }
    ]);
    
    // Convert day numbers to day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedData = usageData.map(entry => ({
      time: days[entry._id.dayOfWeek - 1],
      usage: parseFloat(entry.usage.toFixed(2))
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Get weekly usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/usage', authenticate, async (req, res) => {
  try {
    const { deviceId, usage } = req.body;
    
    // Validate device belongs to user if deviceId is provided
    if (deviceId) {
      const device = await Device.findOne({
        _id: deviceId,
        userId: req.user.id
      });
      
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
    }
    
    const usageRecord = new Usage({
      userId: req.user.id,
      deviceId: deviceId || null,
      usage
    });
    
    await usageRecord.save();
    res.status(201).json(usageRecord);
  } catch (error) {
    console.error('Create usage record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Budget
app.get('/api/budget', authenticate, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    
    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }
    
    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/budget', authenticate, async (req, res) => {
  try {
    const { amount, period } = req.body;
    
    const budget = new Budget({
      userId: req.user.id,
      amount,
      period: period || 'weekly'
    });
    
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Summary
app.get('/api/summary', authenticate, async (req, res) => {
  try {
    // Get current usage (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const currentUsageData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: oneDayAgo }
        }
      },
      {
        $group: {
          _id: null,
          usage: { $sum: '$usage' }
        }
      }
    ]);
    
    const currentUsage = currentUsageData.length > 0 ? currentUsageData[0].usage : 0;
    
    // Get daily average (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyAverageData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          usage: { $sum: '$usage' }
        }
      }
    ]);
    
    const dailyAverage = dailyAverageData.length > 0 
      ? dailyAverageData.reduce((sum, day) => sum + day.usage, 0) / dailyAverageData.length
      : 0;
    
    // Get weekly total
    const weeklyTotalData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          usage: { $sum: '$usage' }
        }
      }
    ]);
    
    const weeklyTotal = weeklyTotalData.length > 0 ? weeklyTotalData[0].usage : 0;
    
    // Get previous week data for comparison
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const previousWeekData = await Usage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          usage: { $sum: '$usage' }
        }
      }
    ]);
    
    const previousWeekTotal = previousWeekData.length > 0 ? previousWeekData[0].usage : 0;
    
    // Calculate savings percentage
    let savingsPercentage = 0;
    if (previousWeekTotal > 0) {
      savingsPercentage = ((previousWeekTotal - weeklyTotal) / previousWeekTotal) * 100;
    }
    
    // Monthly projection
    const monthlyProjection = dailyAverage * 30;
    
    res.json({
      currentUsage: parseFloat(currentUsage.toFixed(2)),
      dailyAverage: parseFloat(dailyAverage.toFixed(2)),
      weeklyTotal: parseFloat(weeklyTotal.toFixed(2)),
      monthlyProjection: parseFloat(monthlyProjection.toFixed(2)),
      savingsPercentage: parseFloat(savingsPercentage.toFixed(2))
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
