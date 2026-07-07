import fs from 'fs';
import mongoose from 'mongoose';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const mongoUrl = env.split('\n').find(l => l.startsWith('MONGODB_URL=')).split('=')[1].replace(/\"/g, '').trim();
  await mongoose.connect(mongoUrl);
  
  const User = mongoose.connection.collection('users');
  const users = await User.find({}).toArray();
  console.log('Users:', users.map(u => u.email));
  
  const CustomDesign = mongoose.connection.collection('customdesigns');
  const designs = await CustomDesign.find({}).toArray();
  console.log('Custom Designs Emails:', designs.map(d => d.email));
  
  process.exit(0);
}
run();
