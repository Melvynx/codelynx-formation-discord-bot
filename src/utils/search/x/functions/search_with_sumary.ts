import type { GPTFunction } from "../x.type";
import { z } from "zod";
import { prisma } from "../../../prisma/prisma.util";
import { searchLog } from "../../search.util";
import { anyToError } from "arcscord";

const params = z.object({
  query: z.string().describe("the summary to search, exemple: 'Terminal couleur"),
});

export const searchWithSummary: GPTFunction<typeof params> = {
  params: params,
  name: "search_with_summary",
  description: "Search a thread by summary, search in the database word by word relevance sorted."
    + " return an array of objects with title, id, summary and tags",
  run: async(params) => {
    try {
      const threads = await prisma.xSubject.findMany({
        where: {
          summary: {
            search: params.query.split(" ").join(" | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: "summary",
            sort: "asc",
            search: params.query.split(" ").join(" | "),
          },
        },
        take: 10,
      });
      if (threads.length === 0) {
        return "{\"error\":\"No threads found\"}";
      }

      const threadData = threads.map(thread => {
        return {
          title: thread.title,
          id: thread.id,
          summary: thread.summary,
          tags: thread.tags,
        };
      });
      return JSON.stringify({
        threads: threadData,
      });
    } catch (e) {
      searchLog.error(anyToError(e).message);
      return "{\"error\":\"internal server error\"}";
    }
  },
};