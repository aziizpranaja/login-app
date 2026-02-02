import bcrypt from "bcrypt";
import { db } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const password = "password123";

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
    ["admin@test.com", "admin", hash]
  );

  console.log("✅ User berhasil ditambahkan");
  process.exit();
};

run();
