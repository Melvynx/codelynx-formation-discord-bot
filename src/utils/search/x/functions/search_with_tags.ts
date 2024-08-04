import type { GPTFunction } from "../x.type";
import { z } from "zod";
import { prisma } from "../../../prisma/prisma.util";
import { searchLog } from "../../search.util";
import { anyToError } from "arcscord";

const paramsWithTag = z.object({
  tags: z.array(z.string()).describe("the tag to search, example: 'useEffect'"),
});

export const searchWithTags: GPTFunction<typeof paramsWithTag> = {
  params: paramsWithTag,
  name: "search_with_tags",
  description: "search a thread by tags, search in the database relevance sorted."
    + " return an array of objects with title, id, summary and tags",
  run: async(params) => {
    try {
      const threads = await prisma.xSubject.findMany({
        where: {
          tags: {
            hasSome: params.tags,
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