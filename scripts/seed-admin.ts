import "dotenv/config";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db, queryClient } from "@/db/client";
import { users } from "@/db/schema";

const adminName = process.env.SEED_ADMIN_NAME;
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adminTitle = process.env.SEED_ADMIN_TITLE;

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

async function seedAdmin() {
  const name = requireEnv("SEED_ADMIN_NAME", adminName);
  const email = requireEnv("SEED_ADMIN_EMAIL", adminEmail);
  const password = requireEnv("SEED_ADMIN_PASSWORD", adminPassword);
  const title = requireEnv("SEED_ADMIN_TITLE", adminTitle);

  console.log(`Preparing admin user: ${email}`);

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await argon2.hash(password);

  await db.insert(users).values({
    role: "ADMIN",
    name,
    email,
    title,
    passwordHash,
  });
  console.log(`Admin user created: ${email}`);
}

async function main() {
  try {
    await seedAdmin();
  } finally {
    await queryClient.end();
  }
}

main();
