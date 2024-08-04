import OpenAI from "openai";
import type { Result } from "arcscord";
import { ok } from "arcscord";
import { ArcLogger } from "arcscord";
import { anyToError, BaseError, error } from "arcscord";
import type { PostInfos, SearchResult } from "./search.type";
import type { ChatCompletionMessageParam } from "openai/resources";
import { cleanPrompt } from "./search.const";
import { OpenAIError } from "../error/openai_error.class";
import { prisma } from "../prisma/prisma.util";
import { generateId } from "../id/id.util";
import { searchX } from "./x/x.util";

const openAIClient = new OpenAI();

export const searchLog = new ArcLogger("search");

export const cleanSearch = async(text: string): Promise<Result<string, BaseError>> => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: cleanPrompt,
    },
    {
      role: "user",
      content: text,
    },
  ];
  try {


    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    const clean = response.choices[0]?.message.content;
    if (!clean) {
      return error(new OpenAIError({
        message: "get nul content",
        model: response.model,
        send: JSON.stringify(messages),
        receive: "",
        usedTokens: {
          send: response.usage?.prompt_tokens || 0,
          receive: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        },
      }));
    }

    try {
      await prisma.xPrompt.create({
        data: {
          id: generateId(),
          type: "CLEAN",
          send: JSON.stringify(messages),
          result: clean,
          sendTokenUsed: response.usage?.prompt_tokens || 0,
          receiveTokenUsed: response.usage?.completion_tokens || 0,
          version: 0,
        },
      });
    } catch (err) {
      searchLog.error("failed update db for search clean", [anyToError(err).message]);
    }
    return ok(clean);

  } catch (err) {
    return error(new BaseError({
      message: "failed to clean search",
      baseError: anyToError(err),
    }));
  }

};


export const search = async(searchTerm: string, cleanSearchingTerm = false): Promise<Result<SearchResult, BaseError>> => {
  if (cleanSearchingTerm) {
    const [clean, err] = await cleanSearch(searchTerm);
    if (err) {
      return error(err);
    }
    searchTerm = clean;
  }
  const [ids, err] = await searchX(searchTerm);
  if (err) {
    return error(err);
  }

  const threads = await prisma.xSubject.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      Thread: true,
      InitalPost: true,
    },
  });

  const cleanThreads: PostInfos[] = [];
  for (const id of ids) {
    const thread = threads.find((thread) => thread.id === id);
    if (!thread) {
      continue;
    }

    cleanThreads.push({
      title: thread.title,
      url: thread.InitalPost.url,
    });
  }
  return ok({
    youtubeVideos: [],
    xPosts: cleanThreads,
  });
};