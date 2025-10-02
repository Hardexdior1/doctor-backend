import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './mongoose/schema/user.js';

const migratePasswords = async () => {
  try {
    await mongoose.connect('your_mongo_uri', { dbName: 'doctor' });
    const users = await User.find({});
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) { // Check if password is not hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        console.log(`Updated password for ${user.username}`);
      }
    }
    console.log('Migration complete');
    mongoose.disconnect();
  } catch (error) {
    console.error('Migration error:', error);
  }
};

migratePasswords();