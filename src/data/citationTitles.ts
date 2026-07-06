/**
 * GENERATED FILE — do not edit by hand.
 *
 * Maps the romanized inner text of a prose （…） citation to its full Chinese
 * display string, e.g. 'Zhuangzi "Qiwu lun"' -> '《莊子・齊物論》'.
 * Or-citations concatenate each alternative's 《…》 in citation order.
 *
 * Regenerate with:
 *   node --import ./register.mjs gen_citation_titles.ts
 * (from the scratchpad dir). Source of truth: gt_ch1_v3.json + gt_ch2_v3.json
 * prose units + the zh titles in src/data/newData.ts.
 */

/**
 * Normalize a citation's inner text (the text inside （…）, without the parens):
 * trim, collapse whitespace runs to a single space, and convert curly “” to
 * straight ". This makes chap1 (straight quotes, stray spaces) and chap2 (curly
 * quotes) forms of the same citation normalize identically.
 */
export function normalizeCitationKey(inner: string): string {
  return inner
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** normalized romanized citation inner text -> full Chinese display string */
export const citationZhByKey: Record<string, string> = {
  "Guanzi \"Xiao cheng\"": "《管子・小稱》",
  "Han Feizi \"He shi\"": "《韓非子・和氏》",
  "Laozi 14": "《老子・第十四章》",
  "Laozi 15 or 20": "《老子・第十五章》《老子・第二十章》",
  "Laozi 29": "《老子・第二十九章》",
  "Laozi 3": "《老子・第三章》",
  "Laozi 37 or 48": "《老子・第三十七章》《老子・第四十八章》",
  "Laozi 38": "《老子・第三十八章》",
  "Laozi 39": "《老子・第三十九章》",
  "Laozi 40": "《老子・第四十章》",
  "Laozi 50": "《老子・第五十章》",
  "Laozi 57": "《老子・第五十七章》",
  "Laozi 66": "《老子・第六十六章》",
  "Laozi 76": "《老子・第七十六章》",
  "Laozi 78": "《老子・第七十八章》",
  "Li ji \"Liyun\"": "《禮記・禮運》",
  "Lun yu \"Yao yue\"": "《論語・堯曰》",
  "Mengzi \"jinxin xia\"": "《孟子・盡心下》",
  "Shenzi \"Yiwen\"": "《慎子・逸文》",
  "Xunzi \"Jundao\"": "《荀子・君道》",
  "Xunzi \"Junzi\"": "《荀子・君子》",
  "Zhanguo ce \"Qin yu Shi lin Zhou er qiu jiu ding\" or \"Su Qin wei Zhao he zongshuo Chu Wei Wang\"": "《戰國策・秦與師臨周而求九鼎》《戰國策・蘇秦為趙合從說楚威王》",
  "Zhuangzi \" Tiandi\"": "《莊子・天地》",
  "Zhuangzi \"Dasheng\" or \"Dazongshi\"": "《莊子・達生》《莊子・大宗師》",
  "Zhuangzi \"Dasheng,\" \"Tiandi,\" \"Zhi beiyou,\" \"Zeyang\"": "《莊子・達生》《莊子・天地》《莊子・知北遊》《莊子・則陽》",
  "Zhuangzi \"Dazongshi\"": "《莊子・大宗師》",
  "Zhuangzi \"Dazongshi\"or \"Qiwu lun\" or Shenzi \"Yiwen\"": "《莊子・大宗師》《莊子・齊物論》《慎子・逸文》",
  "Zhuangzi \"Dechongfu\"": "《莊子・德充符》",
  "Zhuangzi \"Gengsang Chu\"": "《莊子・庚桑楚》",
  "Zhuangzi \"Keyi\"": "《莊子・刻意》",
  "Zhuangzi \"Mati\"": "《莊子・馬蹄》",
  "Zhuangzi \"Mati,\" \"Tiandi,\" or \"Quqie\"": "《莊子・馬蹄》《莊子・天地》《莊子・胠篋》",
  "Zhuangzi \"Pianmu\"": "《莊子・駢拇》",
  "Zhuangzi \"Pianmu,\" \"Zaiyou,\" \"Tianyun,\" or \"Xu Wugui\"": "《莊子・駢拇》《莊子・在宥》《莊子・天運》《莊子・徐無鬼》",
  "Zhuangzi \"Qiushui\"": "《莊子・秋水》",
  "Zhuangzi \"Qiwu lun\"": "《莊子・齊物論》",
  "Zhuangzi \"Qiwulun\"": "《莊子・齊物論》",
  "Zhuangzi \"Quqie\"": "《莊子・胠篋》",
  "Zhuangzi \"Rangwang\"": "《莊子・讓王》",
  "Zhuangzi \"Renjianshi\"": "《莊子・人間世》",
  "Zhuangzi \"Shanmu\"": "《莊子・山木》",
  "Zhuangzi \"Shanxing\"": "《莊子・繕性》",
  "Zhuangzi \"Tiandi\"": "《莊子・天地》",
  "Zhuangzi \"Tiandi\" or \"Qiushui\"": "《莊子・天地》《莊子・秋水》",
  "Zhuangzi \"Tiandi\" or Xunzi \"Qiangguo\"": "《莊子・天地》《荀子・強國》",
  "Zhuangzi \"Tianyun\"": "《莊子・天運》",
  "Zhuangzi \"Tianyun\" or \"Zeyang\"": "《莊子・天運》《莊子・則陽》",
  "Zhuangzi \"Waiwu\"": "《莊子・外物》",
  "Zhuangzi \"Xiaoyaoyou\"": "《莊子・逍遙遊》",
  "Zhuangzi \"Xu Wugui\"": "《莊子・徐無鬼》",
  "Zhuangzi \"Xu Wugui\" or \"Qiwu lun\"": "《莊子・徐無鬼》《莊子・齊物論》",
  "Zhuangzi \"Zaiyou\"": "《莊子・在宥》",
  "Zhuangzi \"Zeyang\"": "《莊子・則陽》",
  "Zhuangzi \"Zhi beiyou\"": "《莊子・知北遊》",
  "Zhuangzi \"Zhi beiyou\" or \"Tianyun\"": "《莊子・知北遊》《莊子・天運》",
  "Zhuangzi \"Zhile\"": "《莊子・至樂》",
  "Zhuangzi\"Dechongfu\"": "《莊子・德充符》",
  "Zhuangzi\"Zaiyou\"": "《莊子・在宥》",
};
