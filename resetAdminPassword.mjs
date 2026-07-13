import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URL = process.env.MONGODB_URL;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function reset() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to DB");
    
    const email = "krisluxeco@gmail.com";
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("Admin user not found. Creating one...");
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        firstName: "Krislux",
        lastName: "Admin",
        email: email,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created successfully. Password: Admin@123");
    } else {
      console.log("Admin user found. Resetting password...");
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      user.password = hashedPassword;
      user.role = "admin";
      await user.save();
      console.log("Admin password reset successfully. Password: Admin@123");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

reset();
