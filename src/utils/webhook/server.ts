import type { FastifyInstance } from "fastify";
import * as process from "node:process";
import { serve } from "@hono/node-server";
import { anyToError, defaultLogger } from "arcscord";
import Fastify from "fastify";
import { Hono } from "hono";
import { env } from "../env/env.util";
import { LynxLogger } from "../log/log.util";
import {
  onProductPurchaseAsync,
  onProductRefundAsync,
} from "./codeline-webhook.utils";
import { productSchema, WebhookPayloadSchema } from "./webhook.type";

const app = new Hono();

export function startWebhookServer() {
  return serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) ?? 3000,
  });
}

app.get("/health", async (c) => {
  return c.json({ message: "OK" }, 200);
});

app.post("/api/webhooks/codeline", async (c) => {
  const result = WebhookPayloadSchema.safeParse(await c.req.parseBody());
  defaultLogger.info(
    `Codeline Webhook received : \n : ${JSON.stringify(
      {
        ...result,
        data: {
          ...result.data,
          secret: "********",
        },
      },
      null,
      2,
    )}`,
  );

  if (!result.success) {
    LynxLogger.warn(
      `Codeline Webhook invalid payload : \`\`\`
      ${anyToError(result.error).message}
      \`\`\``,
    );
    return c.json(
      {
        message: "Invalid payload",
      },
      400,
    );
  }

  const body = result.data;

  if (body.secret !== env.CODELINE_WEBHOOK_SECRET) {
    LynxLogger.warn(`Codeline Webhook invalid secret.
  Secret : \`${body.secret}\``);
    return c.json(
      {
        message: "Invalid secret",
      },
      401,
    );
  }

  try {
    switch (body.type) {
      case "purchase":
        await onProductPurchaseAsync(productSchema.parse(body.data));
        return c.json({ message: "Customer product updated" }, 200);
      case "refund":
        await onProductRefundAsync(body.data);
        return c.json({ message: "Customer product updated" }, 200);

      default:
        return c.json({ message: "Invalid type" }, 404);
    }
  }
  catch (error) {
    defaultLogger.error(anyToError(error).message);
    return c.json({ message: "Internal server error" }, 500);
  }
});
