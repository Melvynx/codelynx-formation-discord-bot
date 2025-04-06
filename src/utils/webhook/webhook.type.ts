import { z } from "zod";

const webHookTypeSchema = z.enum(["purchase", "refund"]);
const productTypeSchema = z.enum(["product", "bundle", "tier"]);

export const productSchema = z.object({
  userId: z.string(),
  userDiscordId: z.string().optional(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  amount: z.number(),
  currency: z.string(),

  // Item can be a product or a bundle
  itemId: z.string(),
  itemSlug: z.string().optional(),
  itemTitle: z.string(),
  itemType: productTypeSchema,
  ip: z.string().ip().optional(),
  userAgent: z.string().optional(),
});
export type Product = z.infer<typeof productSchema>;

export const WebhookPayloadSchema = z.object({
  type: webHookTypeSchema,
  secret: z.string(),
  data: productSchema,
});
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
