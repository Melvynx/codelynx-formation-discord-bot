import type { ButtonRunContext, ButtonRunResult } from "arcscord";
import { anyToError } from "arcscord";
import { ButtonError } from "arcscord";
import { error,  ok } from "arcscord";
import { Button } from "arcscord";
import { VERIFY_BUTTON_ID } from "./verify_button.builder";
import { emailInputBuilder } from "../email_input/email_input.builder";

export class VerifyButton extends Button {

  customId = VERIFY_BUTTON_ID;

  name = "verify_button";

  async run(ctx: ButtonRunContext): Promise<ButtonRunResult> {
    try {
      await ctx.interaction.showModal(emailInputBuilder);
      return ok(true);
    } catch (e) {
      return error(new ButtonError({
        interaction: ctx.interaction,
        message: "failed to send email input modal",
        baseError: anyToError(e),
      }));
    }
  }

}