interface IQuality {
  label: string;
  ordinal: number;
  isEnabled?: boolean;
  identifiers: string[];
  minBitRate?: number;
  maxBitRate?: number;
  preferLarger?: boolean;
}

export { IQuality };
