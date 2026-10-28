import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import mentorRoutes from "./modules/mentor/mentor.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

// Root welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Project Review Board API!",
    data: {
      name: "Project Review Board API",
      description:
        "A platform for students to submit projects and mentors to review them.",
      version: "1.0.0",
      status: "Running",
      endpoints: {
        auth: "/api/auth",
        projects: "/api/projects",
        mentor: "/api/mentor",
      },
    },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mentor", mentorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
