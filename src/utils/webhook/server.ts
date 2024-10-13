import { anyToError, defaultLogger } from "arcscord";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { env } from "../env/env.util";
import { LynxLogger } from "../log/log.util";
import {
  onProductPurchaseAsync,
  onProductRefundAsync,
} from "./codeline-webhook.utils";
import { productSchema, WebhookPayloadSchema } from "./webhook.type";

export const fastifyServer = Fastify({
  logger: false,
});

export const startWebhookServer = (fastifyServer: FastifyInstance): void =>
  fastifyServer.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    defaultLogger.info(`Webhooks serveur start on ${address}`);
  });

fastifyServer.post("/api/webhooks/codeline", async (req, res) => {
  const result = WebhookPayloadSchema.safeParse(req.body);

  if (!result.success) {
    LynxLogger.warn(
      `Codeline Webhook invalid payload : \`\`\`
      ${anyToError(result.error).message}
      \`\`\``
    );
    return res.status(400).send("Invalid payload");
  }

  const body = result.data;

  if (body.secret !== env.CODELINE_WEBHOOK_SECRET) {
    LynxLogger.warn(`Codeline Webhook invalid secret.
  Secret : \`${body.secret}\`
  Ip: \`${req.ip}\``);
    return res.status(401).send("Invalid secret");
  }

  try {
    switch (body.type) {
      case "purchase":
        await onProductPurchaseAsync(productSchema.parse(body.data));
        return res.status(200).send("Customer product updated");
      case "refund":
        await onProductRefundAsync(body.data);
        return res.status(201).send("Customer product updated");

      default:
        return res.status(404).send("Invalid type");
    }
  } catch (error) {
    defaultLogger.error(anyToError(error).message);
    return res.status(500).send("Internal server error");
  }
});
