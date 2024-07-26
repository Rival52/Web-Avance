import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

// 🏚️ Default Route
// This is the Default Route of the API
app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Hello from Express Prisma Boilerplate!" });
});

// Create new user
// This is the Route for creating a new user via POST Method
app.post("/student", async (req: Request, res: Response) => {
  //get name and email from the request body
  const { nom, email, prenom, programme } = req.body;

  const student = await prisma.student.create({
    data: {
      nom,
      prenom,
      email,
      programme,
    },
  });
  res.json({ message: "success", data: student });
});

app.get("/student", async (req: Request, res: Response) => {
  const student = await prisma.student.findMany();
  res.json({ message: "success", data: student });
});

app.delete("/student/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(id);

  await prisma.student.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: "success" });
});

app.patch("/student/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nom, email, prenom, programme } = req.body;

  const user = await prisma.student.update({
    where: {
      id: Number(id),
    },
    data: { nom, email, prenom, programme },
  });
  res.json({ message: "success", data: user });
});

app.get("/search_student", async (req: Request, res: Response) => {
  const { query } = req.query;

  console.log(query);

  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { nom: { contains: query as string } },
          { prenom: { contains: query as string } },
          { email: { contains: query as string } },
          { programme: { contains: query as string } },
        ],
      },
    });

    res.json({ message: "success", data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "error", error: (error as any).message });
  }
});

// // Get single user
// // This is the Route for getting a single user via GET Method
// app.get("/users/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const user = await prisma.student.findUnique({
//     where: {
//       id: Number(id),
//     },
//   });
//   res.json({ message: "success", data: user });
// });

// // Get all users
// // This is the Route for getting all users via GET Method
// app.get("/users", async (req: Request, res: Response) => {
//   const users = await prisma.student.findMany();
//   res.json({ message: "success", data: users });
// });

// // Update user with id
// // This is the Route for updating a user via Patch Method
// app.patch("/users/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, email } = req.body;
//   const user = await prisma.student.update({
//     where: {
//       id: Number(id),
//     },
//     data: {
//       name: String(name),
//       email: String(email),
//     },
//   });
//   res.json({ message: "success", data: user });
// });

// // Delete user with id
// // This is the Route for deleting a user via DELETE Method
// app.delete("/users/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await prisma.student.delete({
//     where: {
//       id: Number(id),
//     },
//   });
//   res.json({ message: "success" });
// });

app.listen(4000, () => {
  console.log("Express server is running on port 4000");
});
