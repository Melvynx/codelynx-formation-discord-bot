import * as fs from "node:fs";
import { z } from "zod";
import { PrismaClient, type XPostType } from "@prisma/client";

const basicTweetSchema = z.object({
  id: z.string(),
  "full_text": z.string(),
  "created_at": z.string().transform((str) => new Date(str)),
  "in_reply_to_user_id": z.string().optional(),
  "in_reply_to_status_id_str": z.string().optional(),
});

const tweetsSchema = z.array(z.object({
  tweet: basicTweetSchema,
}));

type TweetInfos = {
  json: string;
  tweet: z.infer<typeof basicTweetSchema>;
  type: XPostType;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  const start = Date.now();

  const body = fs.readFileSync("./tweets.internal.json").toString();
  const data = JSON.parse(body) as unknown[];

  const baseTweets = tweetsSchema.parse(data);
  const tweets: TweetInfos[] = [];

  const isReplyToOtherOne = (tweet: z.infer<typeof basicTweetSchema>): boolean =>  {
    if (tweet.in_reply_to_user_id) {
      if (tweet.in_reply_to_user_id !== "1439893592248659975") {
        return true;
      }

      const beforeTweet = baseTweets.find((t) => t.tweet.id === tweet.in_reply_to_status_id_str || "");
      if (!beforeTweet) {
        return true;
      }
      return isReplyToOtherOne(beforeTweet.tweet);
    }

    return false;
  };

  for (let i = baseTweets.length; i > 0; i--) {
    const baseTweet = baseTweets[i - 1].tweet;
    let type: XPostType = "POST";

    if (baseTweet.in_reply_to_user_id) {
      if (isReplyToOtherOne(baseTweet)) {
        continue;
      }
      type = "REPLY";
    }

    if (baseTweet.full_text.startsWith("RT ")) {
      continue;
    }

    tweets.push({
      tweet: baseTweet,
      json: JSON.stringify(data[i - 1], undefined, 2),
      type: type,
    });
  }
  const sortedTweets = tweets.sort((a, b) => a.tweet.created_at.getTime() - b.tweet.created_at.getTime());

  const prisma = new PrismaClient();

  // key : postId, value : first postId/ThreadID
  const threadsIds: Map<string, string> = new Map();
  let i = 0;
  let lastPercent = -1;
  for (const tweet of sortedTweets) {
    if (tweet.tweet.in_reply_to_status_id_str && sortedTweets.find((t) => t.tweet.id === tweet.tweet.in_reply_to_status_id_str)) {

      const threadId = threadsIds.get(tweet.tweet.in_reply_to_status_id_str) || tweet.tweet.in_reply_to_status_id_str;

      if (!threadsIds.has(threadId)) {
        await prisma.xThread.upsert({
          where: { id: threadId },
          update: {
            fullContent: "",
          },
          create: {
            id: threadId,
            fullContent: "",
          },
        });
        threadsIds.set(threadId, threadId);
        await prisma.xPost.update({
          where: { id: threadId },
          data: {
            threadId: threadId,
          },
        });
      }

      await prisma.xPost.upsert({
        where: { id: tweet.tweet.id },
        update: {
          content: tweet.tweet.full_text,
          url: "https://x.com/melvynxdev/status/" + tweet.tweet.id,
          createAt: tweet.tweet.created_at,
          type: tweet.type,
          fullJson: tweet.json,
          threadId: threadId,
          previousPostId: tweet.tweet.in_reply_to_status_id_str,
        },
        create: {
          id: tweet.tweet.id,
          content: tweet.tweet.full_text,
          url: "https://x.com/melvynxdev/status/" + tweet.tweet.id,
          createAt: tweet.tweet.created_at,
          type: tweet.type,
          fullJson: tweet.json,
          threadId: threadId,
          previousPostId: tweet.tweet.in_reply_to_status_id_str,
        },
      });
      threadsIds.set(tweet.tweet.id, threadId);

    } else {
      await prisma.xPost.upsert({
        where: { id: tweet.tweet.id },
        update: {
          content: tweet.tweet.full_text,
          url: "https://x.com/melvynxdev/status/" + tweet.tweet.id,
          createAt: tweet.tweet.created_at,
          type: tweet.type,
          fullJson: tweet.json,
        },
        create: {
          id: tweet.tweet.id,
          content: tweet.tweet.full_text,
          url: "https://x.com/melvynxdev/status/" + tweet.tweet.id,
          createAt: tweet.tweet.created_at,
          type: tweet.type,
          fullJson: tweet.json,
        },
      });
    }
    i++;
    const percent = Math.floor((i / sortedTweets.length) * 100);
    if (percent > lastPercent) {
      lastPercent = percent;
      console.log(`updating posts ${percent}%... (${i}/${sortedTweets.length})`);
    }
  }

  console.log(`FINISHED in ${Math.round((Date.now() - start) / 1000)}s`);

}

void main();