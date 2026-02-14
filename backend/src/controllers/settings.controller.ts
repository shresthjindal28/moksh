import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { supabase, assertOk } from "../config/supabase";
import { successRes, errorRes } from "../utils/response";
import { rowToCamel } from "../lib/rowMap";

export const updateSettingsValidation = [
  body("defaultWhatsappNumber").optional().trim(),
  body("whatsappMessageTemplate").optional().trim(),
];

async function getOrCreateSettings(): Promise<Record<string, unknown>> {
  const result = await supabase.from("Settings").select("*").limit(1).maybeSingle();
  let row = assertOk(result);
  if (!row) {
    const now = new Date().toISOString();
    const insertResult = await supabase
      .from("Settings")
      .insert({
        default_whatsapp_number: "",
        whatsapp_message_template: "Hi, I'm interested in {productName}",
        updated_at: now,
      })
      .select("*")
      .single();
    row = assertOk(insertResult);
  }
  return rowToCamel((row ?? {}) as Record<string, unknown>) ?? {};
}

export async function getPublicSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await getOrCreateSettings();
    successRes(res, {
      defaultWhatsappNumber: settings.defaultWhatsappNumber ?? "",
      whatsappMessageTemplate: settings.whatsappMessageTemplate ?? "Hi, I'm interested in {productName}",
    });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await getOrCreateSettings();
    successRes(res, settings);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { defaultWhatsappNumber, whatsappMessageTemplate } = req.body;
    const existing = await supabase.from("Settings").select("*").limit(1).maybeSingle();
    let row = assertOk(existing);
    if (!row) {
      const now = new Date().toISOString();
      const insertResult = await supabase
        .from("Settings")
        .insert({
          default_whatsapp_number: defaultWhatsappNumber ?? "",
          whatsapp_message_template: whatsappMessageTemplate ?? "Hi, I'm interested in {productName}",
          updated_at: now,
        })
        .select("*")
        .single();
      row = assertOk(insertResult);
    } else {
      const data: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (defaultWhatsappNumber !== undefined) data.default_whatsapp_number = defaultWhatsappNumber;
      if (whatsappMessageTemplate !== undefined) data.whatsapp_message_template = whatsappMessageTemplate;
      const updateResult = await supabase.from("Settings").update(data).eq("id", (row as { id: string }).id).select("*").single();
      row = assertOk(updateResult);
    }
    successRes(res, rowToCamel((row ?? {}) as Record<string, unknown>) ?? {});
  } catch (err) {
    next(err);
  }
}
