import type { GPTFunction } from "../x.type";
import { z } from "zod";
import { prisma } from "../../../prisma/prisma.util";
import { searchLog } from "../../search.util";
import { anyToError } from "arcscord";

const params = z.object({
  title: z.string().describe("the title to search, exemple: 'Typescript: Types VS Interfaces'"),
});

export const searchWitTitle: GPTFunction<typeof params> = {
  params: params,
  name: "search_with_title",
  description: "search a thread with word in a title, remove common word like 'un' or 'avec' from the query"
    + " return a array of objects with title, id, summary and tags",
  run: async(params) => {
    try {
      const threads = await prisma.xSubject.findMany({
        where: {
          title: {
            search: params.title.split(" ").join(" | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: "title",
            sort: "asc",
            search: params.title.split(" ").join(" | "),
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