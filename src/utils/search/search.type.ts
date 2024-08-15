import type { VideoInfo } from "./youtube/youtube.type";

export type SearchResult = {
  youtubeVideos: VideoInfo[];
  xPosts: PostInfos[];
  id: string;
}

export type PostInfos = {
  title: string;
  url: string;
}