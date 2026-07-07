import fs from 'fs';
import mongoose from 'mongoose';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const mongoUrl = env.split('\n').find(l => l.startsWith('MONGODB_URL=')).split('=')[1].replace(/\"/g, '').trim();
  await mongoose.connect(mongoUrl);
  
  const CustomDesign = mongoose.connection.collection('customdesigns');
  await CustomDesign.updateMany({ email: 'panipuri@gmail.com' }, { $set: { email: 'krisluxeco@gmail.com' } });
  await CustomDesign.updateMany({ email: 'alok@example.com' }, { $set: { email: 'krisluxeco@gmail.com' } });
  
  console.log('Updated emails to krisluxeco@gmail.com');
  
  process.exit(0);
}
run();
