import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const mongoUri = process.env.MONGODB_URI;

  if (!email || !password || !mongoUri) {
    throw new Error(
      "Missing ADMIN_EMAIL, ADMIN_PASSWORD, or MONGODB_URI in environment"
    );
  }

  await mongoose.connect(mongoUri);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user with email ${email} already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({ email, password: hashedPassword });

  console.log(`Admin user created: ${email}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});