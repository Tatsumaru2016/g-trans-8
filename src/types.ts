export interface SceneConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  visuals: string[];
}

export interface LanguageDef {
  code: string;
  name: string;
  greeting: string;
  coords: [number, number, number]; // 3D coordinates on Globe
  color: string;
}

export interface NetworkNode {
  id: string;
  position: [number, number, number];
  color: string;
  size: number;
  label?: string;
  type: 'human' | 'nation' | 'planet';
}

export interface ConnectionLink {
  id: string;
  source: [number, number, number];
  target: [number, number, number];
  color: string;
  speed: number;
}
