import * as HangulJS from 'hangul-js';

class Hangul {
  private korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  constructor() {}

  public isKorean = (target: string): boolean => {
    return this.korean.test(target);
  };

  public hangulSearch = (target: string, text: string): boolean => {
    target = target.toUpperCase();
    text = text.toUpperCase();

    for (let i = 0; i < text.length; i++) {
      if (HangulJS.isJong(text[i])) {
        text = text.slice(0, i) + HangulJS.d(text[i]).join('') + text.slice(i + 1);
      }
    }

    const dTarget = HangulJS.d(target, true);
    const dText = HangulJS.d(text, true);

    const choTarget = dTarget.map(el => el[0]).join('');
    const choText = dText.map(el => el[0]).join('');
    let correctIdx = choTarget.indexOf(choText);
    let check = false;

    while (correctIdx >= 0) {
      check = true;

      for (let charIdx = 0; charIdx < dText.length; charIdx++) {
        const dTargetIdx = charIdx + correctIdx;

        for (let dIdx = 0; dIdx < dText[charIdx].length; dIdx++) {
          if (dTarget[dTargetIdx][dIdx] !== dText[charIdx][dIdx]) {
            check = false;

            if (
              dIdx === dText[charIdx].length - 1 &&
              HangulJS.isCho(dText[charIdx][dIdx]) &&
              dTarget[dTargetIdx + 1] &&
              dTarget[dTargetIdx + 1][0] === dText[charIdx][dIdx]
            )
              check = true;

            break;
          }
        }
        if (check === false) {
          correctIdx = choTarget.indexOf(choText, correctIdx + 1);
          break;
        }
      }
      if (check) break;
    }

    return check;
  };

  public getChosungSearchedData = <T extends Record<string, any>>(target: keyof T, data: T[], keyword: string): T[] => {
    return data.filter(value => this.hangulSearch(value[`${target as string}`], keyword));
  };
}

export { Hangul };
