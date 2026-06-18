import { create } from "zustand";
import type { Video } from "@/lib/video-data.ts";

type UploadedVideosStore = {
  videos: Video[];
  addVideo: (video: Video) => void;
};

export const useUploadedVideos = create<UploadedVideosStore>((set) => ({
  videos: [],
  addVideo: (video) =>
    set((state) => ({ videos: [video, ...state.videos] })),
}));
