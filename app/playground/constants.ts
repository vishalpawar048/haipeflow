
import { AppCategory, Tone, AspectRatio, VideoDuration, PreviewPlatform } from './types';

export const CATEGORIES = Object.values(AppCategory);
export const TONES = Object.values(Tone);
export const ASPECT_RATIOS = Object.values(AspectRatio);

export const VIDEO_DURATIONS = [
  { label: '15 Seconds (2 Scenes)', value: VideoDuration.SHORT, icon: 'Timer' },
  { label: '30 Seconds (4 Scenes)', value: VideoDuration.LONG, icon: 'TimerReset' },
];

export const PREVIEW_PLATFORMS = [
  { value: PreviewPlatform.INSTAGRAM_REEL, label: 'Instagram Reel', icon: 'Instagram' },
  { value: PreviewPlatform.TIKTOK, label: 'TikTok', icon: 'Music2' }, 
  { value: PreviewPlatform.YOUTUBE_SHORTS, label: 'YouTube Shorts', icon: 'Youtube' },
  { value: PreviewPlatform.META_ADS, label: 'Meta Ads', icon: 'Facebook' },
  { value: PreviewPlatform.YOUTUBE_VIDEO, label: 'YouTube Video', icon: 'Youtube' },
];

export const DEFAULT_THEME_COLOR = '#BEF753'; // Blue-500

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/400/225';

export const AI_MODELS = {
  IMAGE_GEN: 'gemini-2.5-flash-image', // "Nano Banana"
  // Switched to generate-preview (Standard) because fast-generate-preview often fails 
  // with "Input video must be... processed" errors during extension/editing steps.
  VIDEO_GEN: 'veo-3.1-generate-preview', 
  TEXT_GEN: 'gemini-2.5-flash',
  TTS: 'gemini-2.5-flash-preview-tts',
};

