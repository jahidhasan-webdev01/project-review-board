import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { prisma } from "../../lib/prisma.js";
import { projectQuerySchema, reviewSchema } from "./mentor.validation.js";

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  const parsed = projectQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0].message,
    });
  }

  try {
    const { page, limit, status } = parsed.data;
    const where = status ? { status } : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          reviewedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const reviewProject = async (req: AuthRequest, res: Response) => {
  const parsed = reviewSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0].message,
    });
  }

  try {
    const { status, reviewNote } = parsed.data;

    const existingProject = await prisma.project.findUnique({
      where: { id: req.params.id as string },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (existingProject.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This project has already been reviewed",
      });
    }

    const project = await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedById: req.user!.id,
        reviewedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Project ${status.toLowerCase()} successfully`,
      data: project,
    });
  } catch (error) {
    console.error("Review project error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProjectStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "PENDING" } }),
      prisma.project.count({ where: { status: "APPROVED" } }),
      prisma.project.count({ where: { status: "REJECTED" } }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Project statistics fetched successfully",
      data: { total, pending, approved, rejected },
    });
  } catch (error) {
    console.error("Get project stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
