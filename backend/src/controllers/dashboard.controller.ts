import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { successRes } from "../utils/response";

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalProducts, totalCategories, totalLeads, recentLeads, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.lead.count(),
      prisma.lead.findMany({
        include: { product: { select: { name: true } } },
        orderBy: { clickedAt: "desc" },
        take: 10,
      }),
      prisma.product.findMany({
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    successRes(res, {
      totalProducts,
      totalCategories,
      totalLeads,
      recentActivity: {
        leads: recentLeads,
        products: recentProducts,
      },
    });
  } catch (err) {
    next(err);
  }
}
