export type FabMode = 'photo' | 'video' | 'mixed' | 'disabled';

export interface LiquidFabProps {
  mode: FabMode;
  onUpload: (files: FileList | null) => void;
  onDisabledClick: () => void;
}

export interface Ripple {
  x: number;
  y: number;
  id: number;
}
