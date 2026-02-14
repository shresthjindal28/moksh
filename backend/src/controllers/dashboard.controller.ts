import { Request, Response, NextFunction } from "express";
import { supabase, assertOk } from "../config/supabase";
import { successRes } from "../utils/response";
import { rowsToCamel } from "../lib/rowMap";

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [productsCount, categoriesCount, leadsCount, recentLeadsResult, recentProductsResult] = await Promise.all([
      supabase.from("Product").select("*", { count: "exact", head: true }),
      supabase.from("Category").select("*", { count: "exact", head: true }),
      supabase.from("Lead").select("*", { count: "exact", head: true }),
      supabase.from("Lead").select("*, product:Product(name)").order("clicked_at", { ascending: false }).limit(10),
      supabase.from("Product").select("*, category:Category(name)").order("created_at", { ascending: false }).limit(5),
    ]);

    const totalProducts = productsCount.count ?? 0;
    const totalCategories = categoriesCount.count ?? 0;
    const totalLeads = leadsCount.count ?? 0;
    const leadsData = assertOk(recentLeadsResult);
    const productsData = assertOk(recentProductsResult);
    const recentLeads = rowsToCamel(Array.isArray(leadsData) ? leadsData : []);
    const recentProducts = rowsToCamel(Array.isArray(productsData) ? productsData : []);

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
