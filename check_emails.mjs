import fs from 'fs';
import mongoose from 'mongoose';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const mongoUrl = env.split('\n').find(l => l.startsWith('MONGODB_URL=')).split('=')[1].replace(/\"/g, '');
  await mongoose.connect(mongoUrl);
  const CustomDesign = mongoose.connection.collection('customdesigns');
  const reqs = await CustomDesign.find({}).sort({createdAt: -1}).limit(2).toArray();
  console.log(JSON.stringify(reqs, null, 2));
  process.exit(0);
}
run();
