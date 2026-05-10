// types.ts
export interface UserDocument {
  label?: string;
  type?: string;
  pictures?: string[];
  file?: { uri: string; name: string; mimeType?: string };
}
