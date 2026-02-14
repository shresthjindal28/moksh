import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/db";
import { successRes, errorRes } from "../utils/response";

export const updateSettingsValidation = [
  body("defaultWhatsappNumber").optional().trim(),
  body("whatsappMessageTemplate").optional().trim(),
];

export async function getPublicSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          defaultWhatsappNumber: "",
          whatsappMessageTemplate: "Hi, I'm interested in {productName}",
        },
      });
    }
    successRes(res, {
      defaultWhatsappNumber: settings.defaultWhatsappNumber,
      whatsappMessageTemplate: settings.whatsappMessageTemplate,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          defaultWhatsappNumber: "",
          whatsappMessageTemplate: "Hi, I'm interested in {productName}",
        },
      });
    }
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
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          defaultWhatsappNumber: defaultWhatsappNumber ?? "",
          whatsappMessageTemplate: whatsappMessageTemplate ?? "Hi, I'm interested in {productName}",
        },
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...(defaultWhatsappNumber !== undefined && { defaultWhatsappNumber }),
          ...(whatsappMessageTemplate !== undefined && { whatsappMessageTemplate }),
        },
      });
    }
    successRes(res, settings);
  } catch (err) {
    next(err);
  }
}
