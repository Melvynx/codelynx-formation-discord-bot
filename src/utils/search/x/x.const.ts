import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const responseSchema = z.object({
  status: z.boolean().describe("only false if a error happend, no result is not a error"),
  error: z.string().optional().describe("details of the error if exist"),
  ids: z.array(z.string().describe("thread id")).describe("list of threads found sorted by reverence"),
});

export const searchPrompt = "Your are a search system for a french react, nextjs, javascript, typescript former."
  + "Your mission is to find threads that reply to the search query, sorted by reverence if multiples threads passed."
  + "you can call tools give at disposition, and if you found one or multiples match, or if a error happen"
  + `reply with a json object that respect this format : ${JSON.stringify(zodToJsonSchema(responseSchema))}`
  + "\nAlways simplify searching, like 'react quels sont ses avantages' to 'react avantages'."
  + "you can also make multiple query in one time als you want.";