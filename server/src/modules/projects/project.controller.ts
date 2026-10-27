import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { prisma } from "../../lib/prisma.js";
import { projectSchema } from "./project.validation.js";

export const createProject = async (req: AuthRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0].message,
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        studentId: req.user!.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project submitted successfully",
      data: project,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "This repository URL or live URL has already been submitted",
      });
    }

    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        studentId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Get my projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
