export enum POV {
  FirstPerson = "1인칭 주인공 시점 (I did...)",
  ThirdPersonLimited = "3인칭 관찰자 시점 (He/She did...)",
  ThirdPersonOmniscient = "3인칭 전지적 작가 시점 (God view)",
}

export interface NovelSettings {
  synopsis: string;
  pov: POV;
  targetLength: number; // Target character count (Korean characters)
  referenceText: string; // Style learning material
  isMature: boolean; // For safety settings
}

export interface GenerationState {
  isLoading: boolean;
  generatedText: string;
  error: string | null;
}

export const DEFAULT_SETTINGS: NovelSettings = {
  synopsis: "",
  pov: POV.ThirdPersonLimited,
  targetLength: 3000,
  referenceText: "",
  isMature: false,
};