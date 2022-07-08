declare class Hangul {
  private korean;
  constructor();
  isKorean: (target: string) => boolean;
  hangulSearch: (target: string, text: string) => boolean;
  getChosungSearchedData: <T extends Record<string, any>>(target: keyof T, data: T[], keyword: string) => T[];
}
export { Hangul };
