import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin", 10),
    isAdmin: true,
  },
  {
    name: "Aninda",
    email: "aninda@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Noyon",
    email: "noyon@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
