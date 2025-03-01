import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase URL or API key. Please check your .env file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers(
  userRole: "sales" | "team_leader" | "admin",
  email: string
) {
  // const email = faker.internet.email().toLowerCase();
  const password = "testing";
  const name = faker.person.fullName();
  const dob = faker.date.birthdate();
  const phone = faker.phone.number({ style: "international" });

  const roles = ["sales", "team_leader", "admin"];

  const payload = {
    email: email,
    password: password,
    options: {
      data: {
        phone: phone,
        name: name,
        full_name: name,
        dob: dob,
        roles,
      },
    },
  };

  const { error: signUpError } = await supabase.auth.signUp(payload);

  if (signUpError) {
    console.error("Error signing up user:", signUpError);
    process.exit(1);
  }

  const { error } = await supabase.from("users").insert({
    email: email,
    role: userRole,
    provider: "email",
  });

  if (error) {
    console.error("Error inserting users:", error);
    process.exit(1);
  }

  console.log(`Successfully created user: ${email}`);
}

console.log("Seeding sales user");
seedUsers("sales", "testingsales@hotmail.com")
  .catch(console.error)
  .finally(() => process.exit());

// seedUsers("sales", "sales@hotmail.com")
//   .catch(console.error)
//   .finally(() => process.exit());

// console.log("Seeding team leader user");
// seedUsers("team_leader", "team_leader@hotmail.com")
//   .catch(console.error)
//   .finally(() => process.exit());

// console.log("Seeding admin user");
// seedUsers("admin", "admin@hotmail.com")
//   .catch(console.error)
//   .finally(() => process.exit());
