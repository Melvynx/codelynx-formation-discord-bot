import type { GPTFunction } from "../x.type";
import { z } from "zod";
import { prisma } from "@/utils/prisma/prisma.util";
import { sqlQuery } from "./search_x.const";
import { searchLog } from "../../search.util";
import { anyToError } from "arcscord";

const params = z.object({
  query: z.string().describe("query with specifics words only"),
});

export const search: GPTFunction<typeof params> = {
  name: "search",
  params: params,
  description: "Search a subject in the database with words, please search only with importants words, return title, summary, rank and id",
  run: async(params): Promise<string> => {
    try {

      const result = await prisma.$queryRawUnsafe(sqlQuery, params.query);

      if (!Array.isArray(result)) {
        searchLog.error("don't get array for result in x query", [
          ["value", String(result)],
        ]);
        return "{\"error\": \"internal server error\"}";
      }

      if (result.length < 1) {
        return "[]";
      }

      return JSON.stringify(result);

    } catch (e) {
      searchLog.error("failed to execute search query", [anyToError(e).message]);
      return "{\"error\": \"internal server error\"}";
    }
  },
};