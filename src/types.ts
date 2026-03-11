export type Asset = {
  id: string;
  type: 'logo' | 'product';
  name: string;
  data: string;
  mimeType: string;
};

export type PlacedLayer = {
  uid: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type GeneratedMockup = {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
  layers: PlacedLayer[];
  productId: string;
};

export type AppView = 'dashboard' | 'assets' | 'studio' | 'gallery';

export type LoadingState = {
  isGenerating: boolean;
  message: string;
};
