import type { XThread } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";

// eslint-disable-next-line max-len
const promptV0 = `Hello, im a code that sort threads, your mission is to give a title, a summery and tags for X threads of a web developper. If the thread is not in french, reply only with {"error": "NOFRENCH"}, else reply in json in this format : {
  "title": string,
  "summery": string,
  "tags": string[],
  "error": null,
}
reply only with json object`;


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  const start = Date.now();
  const prisma = new PrismaClient();

  const openai = new OpenAI();

  const rawThreads = await prisma.xThread.findMany();
  const subjects = await prisma.xSubject.findMany();

  const threads = rawThreads.filter((thread) => subjects.findIndex((subject) => subject.threadId === thread.id) === -1);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const loadSubject = async(thread: XThread, repeat = 0) => {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: promptV0,
      },
      {
        role: "user",
        content: thread.fullContent,
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      // eslint-disable-next-line camelcase
      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      console.error(`don't get content als response for thread ${thread.id}`);
      return;
    }

    const schema = z.object({
      title: z.string(),
      summery: z.string(),
      tags: z.array(z.string()),
      error: z.null(),
    }).or(
      z.object({
        error: z.string(),
      })
    );
    try {
      const data = JSON.parse(content);
      const infos = schema.safeParse(data);

      if (!infos.success) {
        console.error(infos.error, thread.id, content);
        return;
      }

      if (infos.data.error !== null) {
        console.error(`thread with id ${thread.id} ignored because ${infos.data.error}`);
        return;
      }
      try {

        await prisma.xSubject.create({
          data: {
            id: thread.id,
            postId: thread.id,
            threadId: thread.id,
            title: infos.data.title,
            summary: infos.data.summery,
            tags: infos.data.tags.map(tag => tag.toLowerCase()),
          },
        });

        await prisma.xPrompt.create({
          data: {
            id: thread.id + "v0",
            version: 0,
            subjectId: thread.id,
            send: JSON.stringify(messages),
            result: content,
            sendTokenUsed: completion.usage?.prompt_tokens || 0,
            receiveTokenUsed: completion.usage?.completion_tokens || 0,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } catch (e) {
      if (repeat === 3) {
        console.error(e, content);
      } else {
        console.log(`repeat ${repeat + 1} time for thread ${thread.id}`);
        await loadSubject(thread, repeat + 1);
      }
    }
  };

  let i = 0;
  let lastPercent = -1;

  for (const thread of threads) {
    i++;
    await loadSubject(thread);

    const percent = Math.floor((i / threads.length) * 100);
    if (percent > lastPercent) {
      lastPercent = percent;
      console.log(`updating posts ${percent}%... (${i}/${threads.length})`);
    }
  }
  console.log(`FINISHED in ${Math.round((Date.now() - start) / 1000)}s`);

}

void main();