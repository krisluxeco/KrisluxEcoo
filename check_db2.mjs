import mongoose from 'mongoose';
import fs from 'fs';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const mongoUrlMatch = env.match(/MONGODB_URL=\"(.+)\"/);
  const mongoUrl = mongoUrlMatch[1].trim();

  await mongoose.connect(mongoUrl);
  const CustomDesign = mongoose.connection.collection('customdesigns');
  const reqs = await CustomDesign.find({}).sort({createdAt: -1}).limit(2).toArray();
  console.log(JSON.stringify(reqs, null, 2));
  process.exit(0);
}
run();
