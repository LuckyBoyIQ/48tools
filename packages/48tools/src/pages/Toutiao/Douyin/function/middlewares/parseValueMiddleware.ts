import { requestDouyinUser, requestDouyinVideo } from '../../../services/douyin';
import * as toutiaosdk from '../../../sdk/toutiaosdk';
import parser, { DouyinUrlType, type ParseResult } from '../parser';
import { requestTtwidCookie, requestAwemePostReturnType, requestAwemeDetailReturnType } from '../../../services/douyin';
import { douyinCookie } from '../DouyinCookieStore';
import type { GetVideoUrlOnionContext } from '../../../types';
import type { DouyinHtmlResponseType } from '../../../services/interface';

/**
 * 获取抖音的数据
 * @param { GetVideoUrlOnionContext } ctx
 * @param { string | undefined } cookie
 */
async function getDouyinData(ctx: GetVideoUrlOnionContext, cookie: string): Promise<DouyinHtmlResponseType | null> {
  let douyinResponse: DouyinHtmlResponseType | null = null; // 抖音请求的结果

  if (ctx.parseResult.type === DouyinUrlType.Video) {
    const signature: string = await toutiaosdk.acrawler('sign', ['', douyinCookie.toString()]);

    douyinResponse = await requestAwemeDetailReturnType(cookie, ctx.parseResult.id, signature);

    if (!(douyinResponse?.type === 'detailApi' && douyinResponse?.data)) {
      douyinResponse = await requestDouyinVideo((u: string) => `${ u }${ ctx.parseResult.id }`, cookie);
    }
  } else if (ctx.parseResult.type === DouyinUrlType.User) {
    // 先请求接口
    douyinResponse = await requestAwemePostReturnType(cookie, {
      secUserId: ctx.parseResult.id,
      maxCursor: new Date().getTime(),
      hasMore: 1
    });

    // 接口失败回退到html
    if (!(douyinResponse?.type === 'userApi' && douyinResponse?.data)) {
      douyinResponse = await requestDouyinUser((u: string) => `${ u }${ ctx.parseResult.id }`, cookie);
    }
  }

  return douyinResponse;
}

/**
 * 根据传入的值判断是视频还是用户
 * 视频：
 * https://www.douyin.com/user/MS4wLjABAAAAc6-xMO2J77mP_3h_pOdPT-47qE0cywiTLB7PF4csqPM?modal_id=7184782545546939709
 * https://www.douyin.com/video/7141964711570066722
 * 7184782545546939709
 * https://v.douyin.com/kt5s7j4/
 * 图文：
 * https://www.douyin.com/note/7160299412965657888
 * 7160299412965657888
 * https://v.douyin.com/StwKB7s/
 * 用户：
 * https://www.douyin.com/user/MS4wLjABAAAAc6-xMO2J77mP_3h_pOdPT-47qE0cywiTLB7PF4csqPM
 * MS4wLjABAAAAc6-xMO2J77mP_3h_pOdPT-47qE0cywiTLB7PF4csqPM
 * https://v.douyin.com/kG3Cu1b/
 *
 * 控制台获取数据：JSON.parse(decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML))
 */
async function parseValueMiddleware(ctx: GetVideoUrlOnionContext, next: Function): Promise<void> {
  let douyinResponse: DouyinHtmlResponseType | null = null; // 抖音请求的结果

  try {
    // 获取ttwid的cookie
    await requestTtwidCookie();

    // 解析url
    const parseResult: ParseResult | undefined = await parser(ctx.value, douyinCookie.toString());

    if (!parseResult) {
      ctx.setUrlLoading(false);

      return;
    }

    ctx.parseResult = parseResult;

    // 第一次请求，可能会有验证码
    douyinResponse = await getDouyinData(ctx, douyinCookie.toString());

    if (douyinResponse === null) {
      ctx.setUrlLoading(false);

      return;
    }

    // 根据请求的结果判断是否继续请求
    if (douyinResponse.type === 'cookie') {
      // 计算__ac_signature并获取html
      const acSignature: string = await toutiaosdk.acrawler('sign', ['', douyinResponse.cookie]);

      douyinCookie.setKV('__ac_nonce', douyinResponse.cookie);
      douyinCookie.setKV('__ac_signature', acSignature);

      douyinResponse = await getDouyinData(ctx, douyinCookie.toString());
    }

    if (douyinResponse === null) {
      ctx.setUrlLoading(false);

      return;
    }

    if (douyinResponse.type === 'userApi' || douyinResponse.type === 'detailApi') {
      ctx.data = douyinResponse.data;
      ctx.dataType = douyinResponse.type;
    } else {
      ctx.html = douyinResponse.html; // 可能是验证码中间页
    }

    next();
  } catch (err) {
    console.error(err);
    ctx.messageApi.error('视频地址解析失败！');
    ctx.setUrlLoading(false);
  }
}

export default parseValueMiddleware;