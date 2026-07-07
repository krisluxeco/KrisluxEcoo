import fs from 'fs';
import mongoose from 'mongoose';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const mongoUrl = env.split('\n').find(l => l.startsWith('MONGODB_URL=')).split('=')[1].replace(/\"/g, '').trim();
  await mongoose.connect(mongoUrl);
  
  const CustomDesign = mongoose.connection.collection('customdesigns');
  await CustomDesign.updateMany({ email: 'krisluxeco@gmail.com' }, { $set: { email: 'alokranjankolaalok@gmail.com' } });
  
  console.log('Updated emails to alokranjankolaalok@gmail.com');
  
  process.exit(0);
}
run();
