import { parse, serialize } from 'cookie';
import { rStr } from '../../../../utils/utils';

/* 抖音cookie的相关存储 */
class DouyinCookieStore {
  #cookieMap: Map<string, string> = new Map();

  constructor() {
    this.#setDefaultCookie();
  }

  #setDefaultCookie(): void {
    const passportCsrfToken: string = rStr(32);

    this.#cookieMap.set('passport_csrf_token', passportCsrfToken);
    this.#cookieMap.set('passport_csrf_token_default', passportCsrfToken);
  }

  // 解析cookie
  set(string: string): void {
    const cookies: Record<string, string> = parse(string);

    Object.keys(cookies).forEach((key: string): void => {
      this.#cookieMap.set(key, cookies[key]);
    });
  }

  // 添加cookie
  setKV(key: string, value: string): void {
    this.#cookieMap.set(key, value);
  }

  // 转换成cookie字符串
  toString(): string {
    let cookieString: string = '';

    this.#cookieMap.forEach((value: string, key: string): void => {
      const setCookie: string = serialize(key, value);

      cookieString += `${ setCookie }; `;
    });

    return cookieString;
  }

  // 重置cookie
  reset(): void {
    this.#cookieMap.clear();
    this.#setDefaultCookie();
  }
}

export const douyinCookie: DouyinCookieStore = new DouyinCookieStore();