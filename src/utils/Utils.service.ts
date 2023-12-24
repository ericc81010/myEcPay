import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UtilsService {
  constructor() {}

  createCheckMacValue(
    params: Record<string, string | number | Date>,
    hashKey: string,
    hashIV: string,
  ): string {
    // 1. 照傳遞的參數 A — Z 排序
    const sortedParamsKeys = Object.keys(params).sort((l, r) =>
      l > r ? 1 : -1,
    );

    // 2. 用 & 串接每個參數
    const sortedParamsString = sortedParamsKeys
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    // 3. 參數最前面加上HashKey、最後面加上HashIV
    const hashString = `HashKey=${hashKey}&${sortedParamsString}&HashIV=${hashIV}`;

    // 4. 將整串字串進行URL encode,並轉為小寫
    let encodedString = encodeURIComponent(hashString).toLowerCase();
    encodedString = this.replaceUrlEncode(encodedString);

    // 5. 使用 sha256 加密，並轉換為大寫
    const checkMacValue = crypto
      .createHash('sha256')
      .update(encodedString)
      .digest('hex')
      .toUpperCase();

    return checkMacValue;
  }

  replaceUrlEncode(encodedStr: string): string {
    return encodedStr
      .replace(/%20/g, '+')
      .replace(/%2D/g, '-')
      .replace(/%5F/g, '_')
      .replace(/%2E/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2A/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%40/g, '@');
  }

  getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  isValidURL(url: string): boolean {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  }
}
