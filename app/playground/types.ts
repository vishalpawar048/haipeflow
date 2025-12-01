
export enum AppCategory {
  FINANCE = 'Finance',
  UTILITY = 'Utility',
  HEALTH = 'Health',
  SOCIAL = 'Social',
  ECOMMERCE = 'E-commerce',
  GAMING = 'Gaming'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  ENERGETIC = 'Energetic',
  MINIMALIST = 'Minimalist',
  DRAMATIC = 'Dramatic'
}

export enum AspectRatio {
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  SQUARE = '1:1',
  CUSTOM = 'Custom'
}

export enum VideoDuration {
  SHORT = '15s', // 2 scenes
  LONG = '30s'   // 4 scenes
}

export enum PreviewPlatform {
  INSTAGRAM_REEL = 'Instagram Reel',
  TIKTOK = 'TikTok',
  YOUTUBE_SHORTS = 'YouTube Shorts',
  YOUTUBE_VIDEO = 'YouTube Video',
  META_ADS = 'Meta Ads (Feed)'
}

export enum PreviewDevice {
  MOBILE = 'Mobile',
  DESKTOP = 'Desktop'
}

export interface AppDetails {
  name: string;
  category: AppCategory;
  themeColor: string;
  sellingPoint: string;
  tone: Tone;
  logo: string | null; // base64
  screenshots: string[]; // array of base64
  aspectRatio: AspectRatio;
  customWidth?: number;
  customHeight?: number;
  duration: VideoDuration;
}

export interface ServiceDetails {
  brandName: string;
  serviceType: string;
  themeColor: string;
  sellingPoint: string;
  tone: Tone;
  logo: string | null; // base64
  servicePhotos: string[]; // array of base64
  aspectRatio: AspectRatio;
  customWidth?: number;
  customHeight?: number;
  duration: VideoDuration;
}

export interface ProductDetails {
  productName: string;
  productType: string;
  themeColor: string;
  sellingPoint: string; // used for description
  tone: Tone;
  logo: string | null; // base64
  productPhotos: string[]; // array of base64
  aspectRatio: AspectRatio;
  customWidth?: number;
  customHeight?: number;
  duration: VideoDuration;
}

export interface GeneratedConcept {
  id: string;
  startFrame: string; // base64
  endFrame: string; // base64
  script: {
    scene1: string;
    scene2: string;
    scene3?: string;
    scene4?: string;
  };
  description: string;
}

export enum GenerationState {
  IDLE = 'IDLE',
  GENERATING_CONCEPTS = 'GENERATING_CONCEPTS',
  AWAITING_SELECTION = 'AWAITING_SELECTION',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GenerationProgress {
  currentStep: number;
  totalSteps: number;
  message: string;
}

export interface VideoResult {
  videoUrl: string;
  script: string;
  aspectRatio: string; // To control player size
}

