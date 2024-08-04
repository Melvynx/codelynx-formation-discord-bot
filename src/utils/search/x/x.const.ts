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
  + "in priority search with title, and then with summary, simplify searching, like 'react quels sont ses avantages' to 'react avantages'."
  + "Functions search with perfect match of the word, so try to make some words is plurals if not pertinents results found"
  + "you can also use multiple tools in one time, but not for search the same thing, and you can use tools in while up to 5 times"
  + `reply with a json object that respect this format : ${JSON.stringify(zodToJsonSchema(responseSchema))}`;