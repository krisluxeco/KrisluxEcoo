import mongoose from 'mongoose';
import fs from 'fs';

async function run() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const mongoUrlMatch = env.match(/MONGODB_URL=(.+)/);
    if (!mongoUrlMatch) throw new Error('MONGODB_URL not found in .env.local');
    const mongoUrl = mongoUrlMatch[1].trim();

    await mongoose.connect(mongoUrl);
    const CustomDesign = mongoose.connection.collection('customdesigns');
    const reqs = await CustomDesign.find({}).sort({createdAt: -1}).limit(5).toArray();
    console.log(JSON.stringify(reqs, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
