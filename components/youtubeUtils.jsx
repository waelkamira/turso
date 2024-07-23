// utils/videoUtils.js
'use client';

export const getVideoIdAndPlatform = (url) => {
  let videoId = null;
  let platform = null;

  // Match youtu.be URLs
  const youtuRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^& \n<]+)/;
  const youtuMatch = url?.match(youtuRegex);
  if (youtuMatch && youtuMatch[1]) {
    videoId = youtuMatch[1];
    platform = 'youtube';
  }

  // Match regular youtube.com URLs
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^& \n<]+)/;
  const youtubeMatch = url?.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    videoId = youtubeMatch[1];
    platform = 'youtube';
  }

  // Match YouTube Shorts URLs
  const shortsRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^& \n<]+)/;
  const shortsMatch = url?.match(shortsRegex);
  if (shortsMatch && shortsMatch[1]) {
    videoId = shortsMatch[1];
    platform = 'youtube';
  }

  // Match TikTok URLs
  const tiktokRegex =
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|embed\/|)(\d+)/;
  const tiktokMatch = url?.match(tiktokRegex);
  if (tiktokMatch && tiktokMatch[1]) {
    videoId = tiktokMatch[1];
    platform = 'tiktok';
  }

  // Match Facebook video URLs
  const facebookRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:.*\/videos\/|watch\/\?v=|video\.php\?v=|fb\.watch\/))([^& \n<]+)/;
  const facebookMatch = url?.match(facebookRegex);
  if (facebookMatch && facebookMatch[1]) {
    videoId = facebookMatch[1];
    platform = 'facebook';
  }

  return { videoId, platform };
};
