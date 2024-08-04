import type { Result } from "arcscord";
import { anyToError } from "arcscord";
import { error } from "arcscord";
import { ok } from "arcscord";
import { OpenAIError } from "../../error/openai_error.class";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import { Chat } from "openai/resources";
import { responseSchema, searchPrompt } from "./x.const";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/src/resources/chat/completions";
import { searchWitTitle } from "./functions/search_with_title";
import { zodToJsonSchema } from "zod-to-json-schema";
import { searchWithTags } from "./functions/search_with_tags";
import { searchWithSummary } from "./functions/search_with_sumary";
import { search } from "./functions/search";
import ChatCompletion = Chat.ChatCompletion;
import { prisma } from "../../prisma/prisma.util";
import { generateId } from "../../id/id.util";
import { searchLog } from "../search.util";

const client = new OpenAI();

const executeFunction = async(call: ChatCompletionMessageToolCall.Function): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unsavedArgs = JSON.parse(call.arguments);
  switch (call.name) {
    case searchWitTitle.name: {
      const args = searchWitTitle.params.safeParse(unsavedArgs);
      if (!args.success) {
        return `{"error": "${args.error.message}"`;
      }
      return searchWitTitle.run(args.data);
    }

    case searchWithTags.name: {
      const args = searchWithTags.params.safeParse(unsavedArgs);
      if (!args.success) {
        return `{"error": "${args.error.message}"`;
      }
      return searchWithTags.run(args.data);
    }

    case searchWithSummary.name: {
      const args = searchWithSummary.params.safeParse(unsavedArgs);
      if (!args.success) {
        return `{"error": "${args.error.message}"`;
      }
      return searchWithSummary.run(args.data);
    }
    case search.name: {
      const args = search.params.safeParse(unsavedArgs);
      if (!args.success) {
        return `{"error": "${args.error.message}"`;
      }
      return search.run(args.data);
    }

    default: {
      return "{\"error\":\"function don't exist\"}";
    }
  }
};

const pushToDB = async(completion: ChatCompletion, messages: ChatCompletionMessageParam[]) => {
  try {
    await prisma.xPrompt.create({
      data: {
        id: generateId(),
        version: 0,
        send: JSON.stringify(messages),
        result: JSON.stringify(completion.choices[0]?.message || {}),
        sendTokenUsed: completion.usage?.prompt_tokens || 0,
        receiveTokenUsed: completion.usage?.completion_tokens || 0,
        type: "SEARCH",
      },
    });
  } catch (e) {
    searchLog.error(`failed to create db : ${anyToError(e).message}`);
  }
};

export const searchX = async(term: string): Promise<Result<string[], OpenAIError>> => {

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: search.name,
        description: search.description,
        parameters: zodToJsonSchema(search.params),
      },
    },
    /** {
      type: "function",
      function: {
        name: searchWithTags.name,
        description: searchWithTags.description,
        parameters: zodToJsonSchema(searchWithTags.params),
      },
    },
    {
      type: "function",
      function: {
        name: searchWithSummary.name,
        description: searchWithSummary.description,
        parameters: zodToJsonSchema(searchWithSummary.params),
      },
    }, **/
  ];

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: searchPrompt,
    },
    {
      role: "user",
      content: term,
    },
  ];

  let i = 0;
  while (i <= 6) {

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: tools,
      // eslint-disable-next-line camelcase
      response_format: {
        type: "json_object",
      },
      // eslint-disable-next-line camelcase
      tool_choice: i < 5 ? "auto" : "none",
    });

    const message = completion.choices[0]?.message;
    if (!message) {
      void pushToDB(completion, messages);
      return error(new OpenAIError({
        message: "get nul content",
        model: completion.model,
        send: JSON.stringify(messages),
        receive: "",
        usedTokens: {
          send: completion.usage?.prompt_tokens || 0,
          receive: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0,
        },
      }));
    }

    if (message.tool_calls && message.tool_calls.length > 0) {
      messages.push(message);
      for (const toolCall of message.tool_calls) {
        const response = await executeFunction(toolCall.function);
        console.log(toolCall.function.name, toolCall.function.arguments);
        console.log(response);
        messages.push({
          role: "tool",
          // eslint-disable-next-line camelcase
          tool_call_id: toolCall.id,
          content: response,
        });
      }
      i++;
      continue;
    }

    const content = message.content;
    if (content === null) {
      void pushToDB(completion, messages);
      return error(new OpenAIError({
        message: "get null content",
        model: completion.model,
        send: JSON.stringify(messages),
        receive: JSON.stringify(message),
        usedTokens: {
          send: completion.usage?.prompt_tokens || 0,
          receive: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0,
        },
      }));
    }

    try {
      const data = responseSchema.parse(JSON.parse(content));

      if (!data.status) {
        void pushToDB(completion, messages);
        return error(new OpenAIError({
          message: `a error has occurred : ${data.error || ""}`,
          model: completion.model,
          send: JSON.stringify(messages),
          receive: JSON.stringify(message),
          usedTokens: {
            send: completion.usage?.prompt_tokens || 0,
            receive: completion.usage?.completion_tokens || 0,
            total: completion.usage?.total_tokens || 0,
          },
        }));
      }

      void pushToDB(completion, messages);
      return ok(data.ids);

    } catch (e) {
      void pushToDB(completion, messages);
      return error(new OpenAIError({
        message: "invalid response format",
        model: completion.model,
        send: JSON.stringify(messages),
        receive: JSON.stringify(message),
        usedTokens: {
          send: completion.usage?.prompt_tokens || 0,
          receive: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0,
        },
        baseError: anyToError(e),
      }));
    }
  }

  return ok([term]);
};