import express, { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

// Replace 'YOUR_ACTUAL_MONGODB_CONNECTION_STRING_HERE' with your actual MongoDB connection string
const uri = 'mongodb+srv://admin:HZYHj5zrTqTk58yU@hotelconnect-db.uwsluy3.mongodb.net/?retryWrites=true&w=majority';

if (!uri) {
  console.error('MongoDB URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const userSchema = new mongoose.Schema<User>({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
});

const User = mongoose.model<User>('User', userSchema);

app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
//   console.log($PORT});
});