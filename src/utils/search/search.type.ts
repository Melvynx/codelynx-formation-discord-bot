import type { XSubject } from "@prisma/client";

export type SearchResult = {
  youtubeVideos: string[];
  xPosts: XSubject[];
}