import type { Text, ContinuousText } from "../types";
import { buildChapter, buildRhymedChapter } from "./builder";
import { chap1Data } from "./chapters/chap1";
import { chap2Data } from "./chapters/chap2";
import { chap1RhymedData } from "./chapters/chap1Rhymed";
import { chap2RhymedData } from "./chapters/chap2Rhymed";

/* ============================================================================
 * Huainanzi 淮南子 — main text (continuous / unsegmented format)
 *
 * Each chapter stores its full text as a single string per language.
 * Parallel references are encoded as character-index ranges within that string.
 * ==========================================================================*/

const chap1Built = buildChapter(chap1Data);
const chap2Built = buildChapter(chap2Data);
const chap1Rhymed = buildRhymedChapter(chap1RhymedData);
const chap2Rhymed = buildRhymedChapter(chap2RhymedData);

const huainanzi: ContinuousText = {
  id: "huainanzi",
  title: { zh: "淮南子", en: "Huainanzi" },
  chapters: [
    {
      id: "chap-1",
      title: { zh: "原道訓", en: "Yuandao Xun — Originating in the Way" },
      text: chap1Built.text,
      inlineParallels: chap1Built.inlineParallels,
      rhymed: chap1Rhymed,
    },
    {
      id: "chap-2",
      title: { zh: "俶真訓", en: "Chuzhen Xun — Activating the Genuine" },
      text: chap2Built.text,
      inlineParallels: chap2Built.inlineParallels,
      rhymed: chap2Rhymed,
    },
  ],
};

/* ============================================================================
 * Parallel texts — kept as segment-based Text objects for lookup
 * ==========================================================================*/

const laozi: Text = {
  id: "laozi",
  title: { zh: "老子", en: "Laozi" },
  colorKey: "laozi",
  chapters: [
    {
      id: "laozi-66",
      title: { zh: "第六十六章", en: "66" },
      segments: [
        { id: "lz-66-01", content: { zh: "是以聖人處上而民不重", en: "" } },
        { id: "lz-66-r01", content: { zh: "是以聖人處上而民不重", en: "" } },
      ],
    },
    {
      id: "laozi-37",
      title: { zh: "第三十七章", en: "37" },
      segments: [
        { id: "lz-37-01", content: { zh: "道常無為而無不為", en: "" } },
        { id: "lz-37-r01", content: { zh: "道常無為而無不為", en: "" } },
      ],
    },
    {
      id: "laozi-48",
      title: { zh: "第四十八章", en: "48" },
      segments: [{ id: "lz-48-01", content: { zh: "無為而無不為", en: "" } }, { id: "lz-48-r01", content: { zh: "無為而無不為", en: "" } }],
    },
    {
      id: "laozi-39",
      title: { zh: "第三十九章", en: "39" },
      segments: [
        {
          id: "lz-39-01",
          content: { zh: "故貴以賤為本，高以下為基", en: "" },
        },
        { id: "lz-39-r01", content: { zh: "故貴以賤為本，高以下為基", en: "" } },
      ],
    },
    {
      id: "laozi-76",
      title: { zh: "第七十六章", en: "76" },
      segments: [
        {
          id: "lz-76-01",
          content: { zh: "故堅強者死之徒，柔弱者生之徒", en: "" },
        },
        { id: "lz-76-r01", content: { zh: "故堅強者死之徒，柔弱者生之徒", en: "" } },
      ],
    },
    {
      id: "laozi-57",
      title: { zh: "第五十七章", en: "57" },
      segments: [
        { id: "lz-57-01", content: { zh: "吾何以知其然哉", en: "" } },
        { id: "lz-57-02", content: { zh: "吾何以知其然哉", en: "" } },
        { id: "lz-57-r01", content: { zh: "吾何以知其然哉", en: "" } },
        { id: "lz-57-r02", content: { zh: "吾何以知其然哉", en: "" } },
      ],
    },
    {
      id: "laozi-78",
      title: { zh: "第七十八章", en: "78" },
      segments: [
        { id: "lz-78-01", content: { zh: "天下莫柔弱於水", en: "" } },
        { id: "lz-78-r01", content: { zh: "天下莫柔弱於水", en: "" } },
      ],
    },
    {
      id: "laozi-50",
      title: { zh: "第五十章", en: "50" },
      segments: [{ id: "lz-50-01", content: { zh: "出生入死", en: "" } }, { id: "lz-50-r01", content: { zh: "出生入死", en: "" } }],
    },
    {
      id: "laozi-40",
      title: { zh: "第四十章", en: "40" },
      segments: [{ id: "lz-40-01", content: { zh: "有生於無", en: "" } }, { id: "lz-40-02", content: { zh: "天下萬物", en: "" } }, { id: "lz-40-r01", content: { zh: "有生於無", en: "" } }, { id: "lz-40-r02", content: { zh: "天下萬物", en: "" } }],
    },
    {
      id: "laozi-15",
      title: { zh: "第十五章", en: "15" },
      segments: [
        {
          id: "lz-15-01",
          content: {
            zh: "儼兮其若容",
            en: "",
          },
        },
        { id: "lz-15-r01", content: { zh: "儼兮其若容", en: "" } },
      ],
    },
    {
      id: "laozi-20",
      title: { zh: "第二十章", en: "20" },
      segments: [{ id: "lz-20-01", content: { zh: "澹兮其若海", en: "" } }, { id: "lz-20-r01", content: { zh: "澹兮其若海", en: "" } }],
    },
    {
      id: "laozi-03",
      title: { zh: "第三章", en: "3" },
      segments: [{ id: "lz-03-01", content: { zh: "是以聖人之治", en: "" } }, { id: "lz-03-r01", content: { zh: "是以聖人之治", en: "" } }],
    },
    {
      id: "laozi-38",
      title: { zh: "第三十八章", en: "38" },
      segments: [
        { id: "lz-38-01", content: { zh: "上仁為之而無以為", en: "" } },
        { id: "lz-38-r01", content: { zh: "上仁為之而無以為", en: "" } },
      ],
    },
    {
      id: "laozi-29",
      title: { zh: "第二十九章", en: "29" },
      segments: [
        {
          id: "lz-29-01",
          content: { zh: "天下神器，不可為也，為者敗之，執者失之", en: "" },
        },
        { id: "lz-29-r01", content: { zh: "天下神器，不可為也，為者敗之，執者失之", en: "" } },
      ],
    },
    {
      id: "laozi-14",
      title: { zh: "第十四章", en: "14" },
      segments: [{ id: "lz-14-01", content: { zh: "此三者不可", en: "" } }, { id: "lz-14-r01", content: { zh: "此三者不可", en: "" } }],
    },
    {
      id: "laozi-40",
      title: { zh: "第四十章", en: "40" },
      segments: [{ id: "lz-40-01", content: { zh: "天下萬物", en: "" } }],
    },
  ],
};

const xunzi: Text = {
  id: "xunzi",
  title: { zh: "荀子", en: "Xunzi" },
  colorKey: "xunzi",
  chapters: [
    {
      id: "junzi",
      title: { zh: "君子", en: "Junzi" },
      segments: [
        { id: "xu-jz-01", content: { zh: "不言而信，不慮而知", en: "" } },
        { id: "xu-jz-02", content: { zh: "等貴賤", en: "" } },
        { id: "xu-jz-r01", content: { zh: "不言而信，不慮而知", en: "" } },
        { id: "xu-jz-r02", content: { zh: "等貴賤", en: "" } },
      ],
    },
    {
      id: "jundao",
      title: { zh: "君道", en: "Jundao" },
      segments: [{ id: "xu-jd-01", content: { zh: "明親疏", en: "" } }, { id: "xu-jd-r01", content: { zh: "明親疏", en: "" } }],
    },
    {
      id: "qiangguo",
      title: { zh: "強國", en: "Qiangguo" },
      segments: [
        { id: "xu-qg-01", content: { zh: "仁人之所羞而不為也", en: "" } },
        { id: "xu-qg-r01", content: { zh: "仁人之所羞而不為也", en: "" } },
      ],
    },
  ],
};

const shenzi: Text = {
  id: "shenzi",
  title: { zh: "慎子", en: "Shenzi" },
  colorKey: "shenzi",
  chapters: [
    {
      id: "shenzi-yiwen",
      title: { zh: "逸文", en: "Yiwen" },
      segments: [
        { id: "sz-yw-01", content: { zh: "鳥飛於空，魚游於淵", en: "" } },
        { id: "sz-yw-02", content: { zh: "始吾未生之時，焉知生之為樂也；今吾未死，又焉知死之為不樂也", en: "" } },
        { id: "sz-yw-r01", content: { zh: "鳥飛於空，魚游於淵", en: "" } },
        { id: "sz-yw-r02", content: { zh: "始吾未生之時，焉知生之為樂也；今吾未死，又焉知死之為不樂也", en: "" } },
      ],
    },
  ],
};

const hanfeizi: Text = {
  id: "hanfeizi",
  title: { zh: "韓非子", en: "Han Feizi" },
  colorKey: "hanfeizi",
  chapters: [
    {
      id: "hf-heshi",
      title: { zh: "和氏", en: "He shi" },
      segments: [{ id: "hf-hs-01", content: { zh: "三日三夜", en: "" } }, { id: "hf-hs-r01", content: { zh: "三日三夜", en: "" } }],
    },
  ],
};

const zhanguoce: Text = {
  id: "zhanguoce",
  title: { zh: "戰國策", en: "Zhanguo ce" },
  colorKey: "zhanguoce",
  chapters: [
    {
      id: "zgc-qin-jiuding",
      title: { zh: "秦與師臨周而求九鼎", en: "Qin yu Shi lin Zhou er qiu jiu ding" },
      segments: [{ id: "zgc-qjd-01", content: { zh: "夫存危國", en: "" } }, { id: "zgc-qjd-r01", content: { zh: "夫存危國", en: "" } }],
    },
    {
      id: "zgc-suqin-chu",
      title: { zh: "蘇秦為趙合從說楚威王", en: "Su Qin wei Zhao he zongshuo Chu Wei Wang" },
      segments: [{ id: "zgc-sqc-01", content: { zh: "存危國", en: "" } }, { id: "zgc-sqc-r01", content: { zh: "存危國", en: "" } }],
    },
  ],
};

const lunyu: Text = {
  id: "lunyu",
  title: { zh: "論語", en: "Lun yu" },
  colorKey: "lunyu",
  chapters: [
    {
      id: "ly-yaoyue",
      title: { zh: "堯曰", en: "Yao yue" },
      segments: [{ id: "ly-yy-01", content: { zh: "繼絕世", en: "" } }, { id: "ly-yy-r01", content: { zh: "繼絕世", en: "" } }],
    },
  ],
};

const mengzi: Text = {
  id: "mengzi",
  title: { zh: "孟子", en: "Mengzi" },
  colorKey: "mengzi",
  chapters: [
    {
      id: "mz-jinxin-xia",
      title: { zh: "盡心下", en: "jinxin xia" },
      segments: [
        { id: "mz-jx-01", content: { zh: "口之於味也，目之於色也，耳之於聲也，鼻之於臭也", en: "" } },
        { id: "mz-jx-r01", content: { zh: "口之於味也，目之於色也，耳之於聲也，鼻之於臭也", en: "" } },
      ],
    },
  ],
};

const guanzi: Text = {
  id: "guanzi",
  title: { zh: "管子", en: "Guanzi" },
  colorKey: "guanzi",
  chapters: [
    {
      id: "gz-xiaocheng",
      title: { zh: "小稱", en: "Xiao cheng" },
      segments: [
        { id: "gz-xc-01", content: { zh: "君猶不能行也", en: "" } },
        { id: "gz-xc-02", content: { zh: "君猶不能行也", en: "" } },
        { id: "gz-xc-r01", content: { zh: "君猶不能行也", en: "" } },
        { id: "gz-xc-r02", content: { zh: "君猶不能行也", en: "" } },
      ],
    },
  ],
};

const liji: Text = {
  id: "liji",
  title: { zh: "禮記", en: "Li ji" },
  colorKey: "liji",
  chapters: [
    {
      id: "lj-liyun",
      title: { zh: "禮運", en: "Liyun" },
      segments: [{ id: "lj-ly-01", content: { zh: "以天下為一家", en: "" } }, { id: "lj-ly-r01", content: { zh: "以天下為一家", en: "" } }],
    },
  ],
};

const zhuangzi: Text = {
  id: "zhuangzi",
  title: { zh: "莊子", en: "Zhuangzi" },
  colorKey: "zhuangzi",
  chapters: [
    {
      id: "zz-tiandi",
      title: { zh: "天地", en: "Tiandi" },
      segments: [
        {
          id: "zz-tia-01",
          content: { zh: "無為為之之謂天，無為言之之謂德", en: "" },
        },
        { id: "zz-tia-02", content: { zh: "與物化", en: "" } },
        {
          id: "zz-tia-03",
          content: {
            zh: "至無而供其求，時騁而要其宿，大小、長短、修遠",
            en: "",
          },
        },
        {
          id: "zz-tia-04",
          content: { zh: "機心存於胸中，則純白不備", en: "" },
        },
        { id: "zz-tia-05", content: { zh: "則必不勝任矣", en: "" } },
        {
          id: "zz-tia-06",
          content: {
            zh: "若然者，藏金於山，藏珠於淵；不利貨財，不近貴富",
            en: "",
          },
        },
        { id: "zz-tia-07", content: { zh: "天地者乎？賜亦可", en: "" } },
        { id: "zz-tia-08", content: { zh: "雖以天下譽之", en: "" } },
        { id: "zz-tia-09", content: { zh: "視乎冥冥，聽乎無聲。冥冥之中，獨見曉焉；無聲之中，獨聞和焉", en: "" } },
        { id: "zz-tia-10", content: { zh: "百年之木，破為犧尊，青黃而文之，其斷在溝中。比犧尊於溝中之斷，則美惡有間矣，其於失性一也", en: "" } },
        { id: "zz-tia-11", content: { zh: "至德之世", en: "" } },
        { id: "zz-tia-12", content: { zh: "吾非不知，羞而不為也", en: "" } },
        { id: "zz-tia-r01", content: { zh: "無為為之之謂天，無為言之之謂德", en: "" } },
        { id: "zz-tia-r02", content: { zh: "與物化", en: "" } },
        { id: "zz-tia-r03", content: { zh: "至無而供其求，時騁而要其宿，大小、長短、修遠", en: "" } },
        { id: "zz-tia-r04", content: { zh: "機心存於胸中，則純白不備", en: "" } },
        { id: "zz-tia-r05", content: { zh: "若然者，藏金於山，藏珠於淵；不利貨財，不近貴富", en: "" } },
        { id: "zz-tia-r06", content: { zh: "天地者乎？賜亦可", en: "" } },
        { id: "zz-tia-r07", content: { zh: "雖以天下譽之", en: "" } },
        { id: "zz-tia-r08", content: { zh: "視乎冥冥，聽乎無聲。冥冥之中，獨見曉焉；無聲之中，獨聞和焉", en: "" } },
        { id: "zz-tia-r09", content: { zh: "百年之木，破為犧尊，青黃而文之，其斷在溝中。比犧尊於溝中之斷，則美惡有間矣，其於失性一也", en: "" } },
        { id: "zz-tia-r10", content: { zh: "至德之世", en: "" } },
        { id: "zz-tia-r11", content: { zh: "吾非不知，羞而不為也", en: "" } },
      ],
    },
    {
      id: "zz-qiwu-lun",
      title: {
        zh: "齊物論",
        en: "Qiwu Lun",
      },
      segments: [
        {
          id: "zz-qwl-01",
          content: { zh: "天下莫大於秋豪之末，而大山為小", en: "" },
        },
        { id: "zz-qwl-02", content: { zh: "不道之道", en: "" } },
        {
          id: "zz-qwl-03",
          content: { zh: "如是皆有，為臣妾乎，其臣妾不足以相治乎", en: "" },
        },
        { id: "zz-qwl-04", content: { zh: "有始也者，有未始有始也者，有未始有夫未始有始也者。有有也者，有無也者，有未始有無也者，有未始有夫未始有無也者", en: "" } },
        { id: "zz-qwl-05", content: { zh: "有始也者", en: "" } },
        { id: "zz-qwl-06", content: { zh: "有未始有始也者", en: "" } },
        { id: "zz-qwl-07", content: { zh: "有未始有夫未始有始也者", en: "" } },
        { id: "zz-qwl-08", content: { zh: "有有也者", en: "" } },
        { id: "zz-qwl-09", content: { zh: "有無也者", en: "" } },
        { id: "zz-qwl-10", content: { zh: "有未始有無也者", en: "" } },
        { id: "zz-qwl-11", content: { zh: "有未始有夫未始有無也者", en: "" } },
        { id: "zz-qwl-12", content: { zh: "魚見之深入，鳥見之高飛", en: "" } },
        { id: "zz-qwl-13", content: { zh: "方其夢也，不知其夢也", en: "" } },
        { id: "zz-qwl-14", content: { zh: "而莫知其所萌", en: "" } },
        { id: "zz-qwl-15", content: { zh: "庸詎知吾所謂知之非不知邪", en: "" } },
        { id: "zz-qwl-r01", content: { zh: "天下莫大於秋豪之末，而大山為小", en: "" } },
        { id: "zz-qwl-r02", content: { zh: "不道之道", en: "" } },
        { id: "zz-qwl-r03", content: { zh: "如是皆有，為臣妾乎，其臣妾不足以相治乎", en: "" } },
        { id: "zz-qwl-r04", content: { zh: "夜以繼日", en: "" } },
        { id: "zz-qwl-r05", content: { zh: "有始也者，有未始有始也者，有未始有夫未始有始也者。有有也者，有無也者，有未始有無也者，有未始有夫未始有無也者", en: "" } },
        { id: "zz-qwl-r06", content: { zh: "有始也者", en: "" } },
        { id: "zz-qwl-r07", content: { zh: "有未始有始也者", en: "" } },
        { id: "zz-qwl-r08", content: { zh: "有未始有夫未始有始也者", en: "" } },
        { id: "zz-qwl-r09", content: { zh: "有有也者", en: "" } },
        { id: "zz-qwl-r10", content: { zh: "有無也者", en: "" } },
        { id: "zz-qwl-r11", content: { zh: "有未始有無也者", en: "" } },
        { id: "zz-qwl-r12", content: { zh: "有未始有夫未始有無也者", en: "" } },
        { id: "zz-qwl-r13", content: { zh: "魚見之深入，鳥見之高飛", en: "" } },
        { id: "zz-qwl-r14", content: { zh: "方其夢也，不知其夢也", en: "" } },
        { id: "zz-qwl-r15", content: { zh: "而莫知其所萌", en: "" } },
        { id: "zz-qwl-r16", content: { zh: "庸詎知吾所謂知之非不知邪", en: "" } },
      ],
    },
    {
      id: "zz-mati",
      title: { zh: "馬蹄", en: "Mati" },
      segments: [
        { id: "zz-mati-01", content: { zh: "澤無舟梁；萬物群生", en: "" } },
        { id: "zz-mati-02", content: { zh: "含哺而熙，鼓腹而遊", en: "" } },
        { id: "zz-mati-03", content: { zh: "故至德之世", en: "" } },
        { id: "zz-mati-r01", content: { zh: "澤無舟梁；萬物群生", en: "" } },
        { id: "zz-mati-r02", content: { zh: "含哺而熙，鼓腹而遊", en: "" } },
        { id: "zz-mati-r03", content: { zh: "至德之世", en: "" } },
      ],
    },
    {
      id: "zz-keyi",
      title: { zh: "刻意", en: "Keyi" },
      segments: [
        { id: "zz-keyi-01", content: { zh: "不可為象", en: "" } },
        { id: "zz-keyi-02", content: { zh: "感而後應，迫而後動", en: "" } },
        { id: "zz-keyi-03", content: { zh: "澹然無極", en: "" } },
        {
          id: "zz-keyi-04",
          content: {
            zh: "故曰：悲樂者，德之邪；喜怒者，道之過；好惡者，德之失。故心不憂樂，德之至也；一而不變，靜之至也；無所於忤，虛之至也；不與物交，惔之至也；無所於逆，粹之至也",
            en: "",
          },
        },
        { id: "zz-keyi-05", content: { zh: "純粹而不雜", en: "" } },
        { id: "zz-keyi-06", content: { zh: "語大功，立大名，禮君臣，正上下", en: "" } },
        { id: "zz-keyi-r01", content: { zh: "不可為象", en: "" } },
        { id: "zz-keyi-r02", content: { zh: "感而後應，迫而後動", en: "" } },
        { id: "zz-keyi-r03", content: { zh: "澹然無極", en: "" } },
        { id: "zz-keyi-r04", content: { zh: "故曰：悲樂者，德之邪；喜怒者，道之過；好惡者，德之失。故心不憂樂，德之至也；一而不變，靜之至也；無所於忤，虛之至也；不與物交，惔之至也；無所於逆，粹之至也", en: "" } },
        { id: "zz-keyi-r05", content: { zh: "純粹而不雜", en: "" } },
        { id: "zz-keyi-r06", content: { zh: "語大功，立大名，禮君臣，正上下", en: "" } },
      ],
    },
    {
      id: "zz-xiaoyaoyou",
      title: { zh: "逍遙遊", en: "Xiaoyaoyou" },
      segments: [
        { id: "zz-xyy-01", content: { zh: "羊角而上", en: "" } },
        { id: "zz-xyy-02", content: { zh: "則所用之異也", en: "" } },
        { id: "zz-xyy-03", content: { zh: "且舉世而譽之而不加勸，舉世而非之而不加沮，定乎內外之分，辯乎榮辱之竟", en: "" } },
        { id: "zz-xyy-04", content: { zh: "孰肯以物為事", en: "" } },
        { id: "zz-xyy-r01", content: { zh: "羊角而上", en: "" } },
        { id: "zz-xyy-r02", content: { zh: "則所用之異也", en: "" } },
        { id: "zz-xyy-r03", content: { zh: "且舉世而譽之而不加勸，舉世而非之而不加沮，定乎內外之分，辯乎榮辱之竟", en: "" } },
        { id: "zz-xyy-r04", content: { zh: "孰肯以物為事", en: "" } },
      ],
    },
    {
      id: "zz-zhibeiyou",
      title: { zh: "知北遊", en: "Zhi beiyou" },
      segments: [
        { id: "zz-zby-01", content: { zh: "與物化", en: "" } },
        {
          id: "zz-zby-02",
          content: { zh: "聽之不聞其聲，視之不見其形", en: "" },
        },
        { id: "zz-zby-03", content: { zh: "惛然若亡而存", en: "" } },
        {
          id: "zz-zby-04",
          content: { zh: "四肢彊，思慮恂達，耳目聰明", en: "" },
        },
        { id: "zz-zby-05", content: { zh: "終日視之而不見，聽之而不聞，搏之而不得也", en: "" } },
        { id: "zz-zby-06", content: { zh: "光曜問乎無有曰", en: "" } },
        { id: "zz-zby-07", content: { zh: "予能有無矣，而未能無無也，及為無有矣，何從至此哉", en: "" } },
        { id: "zz-zby-r01", content: { zh: "與物化", en: "" } },
        { id: "zz-zby-r02", content: { zh: "終日視之而不見，聽之而不聞，搏之而不得也", en: "" } },
        { id: "zz-zby-r03", content: { zh: "惛然若亡而存", en: "" } },
        { id: "zz-zby-r04", content: { zh: "四肢彊，思慮恂達，耳目聰明", en: "" } },
        { id: "zz-zby-r05", content: { zh: "終日視之而不見，聽之而不聞，搏之而不得也", en: "" } },
        { id: "zz-zby-r06", content: { zh: "光曜問乎無有曰", en: "" } },
        { id: "zz-zby-r07", content: { zh: "予能有無矣，而未能無無也，及為無有矣，何從至此哉", en: "" } },
      ],
    },
    {
      id: "zz-zeyang",
      title: { zh: "則陽", en: "Zeyang" },
      segments: [
        { id: "zz-zy-01", content: { zh: "與物化", en: "" } },
        {
          id: "zz-zy-02",
          content: { zh: "萬物有乎生而莫見其根，有乎出而莫見其門", en: "" },
        },
        {
          id: "zz-zy-03",
          content: {
            zh: "是以自外入者，有主而不執；由中出者，有正而不距",
            en: "",
          },
        },
        { id: "zz-zy-04", content: { zh: "故聖人，其窮也使家人忘其貧，其達也使王公忘其爵祿而化卑", en: "" } },
        { id: "zz-zy-05", content: { zh: "故或不言而飲人以和", en: "" } },
        { id: "zz-zy-06", content: { zh: "夫凍者假衣於春，暍者反冬乎冷風", en: "" } },
        { id: "zz-zy-r01", content: { zh: "與物化", en: "" } },
        { id: "zz-zy-r02", content: { zh: "萬物有乎生而莫見其根，有乎出而莫見其門", en: "" } },
        { id: "zz-zy-r03", content: { zh: "是以自外入者，有主而不執；由中出者，有正而不距", en: "" } },
        { id: "zz-zy-r04", content: { zh: "故聖人，其窮也使家人忘其貧，其達也使王公忘其爵祿而化卑", en: "" } },
        { id: "zz-zy-r05", content: { zh: "故或不言而飲人以和", en: "" } },
        { id: "zz-zy-r06", content: { zh: "夫凍者假衣於春，暍者反冬乎冷風", en: "" } },
      ],
    },
    {
      id: "zz-dasheng",
      title: { zh: "達生", en: "Dasheng" },
      segments: [
        { id: "zz-ds-01", content: { zh: "與物化", en: "" } },
        { id: "zz-ds-02", content: { zh: "芒然彷徨乎塵垢之外，逍遙乎無事之業", en: "" } },
        { id: "zz-ds-r01", content: { zh: "與物化", en: "" } },
        { id: "zz-ds-r02", content: { zh: "芒然彷徨乎塵垢之外，逍遙乎無事之業", en: "" } },
      ],
    },
    {
      id: "zz-waiwu",
      title: { zh: "外物", en: "Waiwu" },
      segments: [
        {
          id: "zz-ww-01",
          content: { zh: "木與木相摩則然，金與火相守則流", en: "" },
        },
        { id: "zz-ww-02", content: { zh: "聖人之所以駴天下，神人未嘗過而問焉；賢人所以駴世，聖人未嘗過而問焉", en: "" } },
        { id: "zz-ww-r01", content: { zh: "木與木相摩則然，金與火相守則流", en: "" } },
        { id: "zz-ww-r02", content: { zh: "聖人之所以駴天下，神人未嘗過而問焉；賢人所以駴世，聖人未嘗過而問焉", en: "" } },
      ],
    },
    {
      id: "zz-tianyun",
      title: { zh: "天運", en: "Tianyun" },
      segments: [
        { id: "zz-ty-01", content: { zh: "性不可易", en: "" } },
        { id: "zz-ty-02", content: { zh: "由外入者，無主於中", en: "" } },
        { id: "zz-ty-03", content: { zh: "性命之情", en: "" } },
        {
          id: "zz-ty-04",
          content: { zh: "望之而不能見也，逐之而不能及也", en: "" },
        },
        { id: "zz-ty-06", content: { zh: "聽之不聞其聲，視之不見其形", en: "" } },
        { id: "zz-ty-07", content: { zh: "性命之情", en: "" } },
        { id: "zz-ty-r01", content: { zh: "性不可易", en: "" } },
        { id: "zz-ty-r02", content: { zh: "由外入者，無主於中", en: "" } },
        { id: "zz-ty-r03", content: { zh: "性命之情", en: "" } },
        { id: "zz-ty-r04", content: { zh: "望之而不能見也，逐之而不能及也", en: "" } },
        { id: "zz-ty-r05", content: { zh: "聽之不聞其聲，視之不見其形", en: "" } },
        { id: "zz-ty-r06", content: { zh: "性命之情", en: "" } },
        { id: "zz-ty-r07", content: { zh: "聽之不聞其聲，視之不見其形", en: "" } },
      ],
    },
    {
      id: "zz-qiushui",
      title: { zh: "秋水", en: "Qiushui" },
      segments: [
        {
          id: "zz-qy-01",
          content: {
            zh: "井蛙不可以語於海者，拘於虛也；夏蟲不可以語於冰者，篤於時也；曲士不可以語於道者，束於教也",
            en: "",
          },
        },
        { id: "zz-qy-02", content: { zh: "必不勝任矣", en: "" } },
        { id: "zz-qy-03", content: { zh: "不足以舉其大", en: "" } },
        { id: "zz-qy-04", content: { zh: "不足以極其深", en: "" } },
        { id: "zz-qy-r01", content: { zh: "井蛙不可以語於海者，拘於虛也；夏蟲不可以語於冰者，篤於時也；曲士不可以語於道者，束於教也", en: "" } },
        { id: "zz-qy-r02", content: { zh: "必不勝任矣", en: "" } },
        { id: "zz-qy-r03", content: { zh: "不足以舉其大", en: "" } },
        { id: "zz-qy-r04", content: { zh: "不足以極其深", en: "" } },
        { id: "zz-qy-05", content: { zh: "三日三夜", en: "" } },
        { id: "zz-qy-r05", content: { zh: "三日三夜", en: "" } },
      ],
    },
    {
      id: "zz-gengsangchu",
      title: { zh: "庚桑楚", en: "Gengsang Chu" },
      segments: [
        { id: "zz-gsc-01", content: { zh: "以其所好", en: "" } },
        { id: "zz-gsc-02", content: { zh: "今吾日計之而不足，歲計之而有餘", en: "" } },
        { id: "zz-gsc-r01", content: { zh: "以其所好", en: "" } },
        { id: "zz-gsc-r02", content: { zh: "今吾日計之而不足，歲計之而有餘", en: "" } },
      ],
    },
    {
      id: "zz-shanxing",
      title: { zh: "繕性", en: "Shanxing" },
      segments: [
        { id: "zz-sx-01", content: { zh: "是故安而不順", en: "" } },
        { id: "zz-sx-02", content: { zh: "人雖有知，無所用之", en: "" } },
        { id: "zz-sx-r01", content: { zh: "是故安而不順", en: "" } },
        { id: "zz-sx-r02", content: { zh: "人雖有知，無所用之", en: "" } },
      ],
    },
    {
      id: "zz-xuwugui",
      title: { zh: "徐無鬼", en: "Xu Wugui" },
      segments: [
        { id: "zz-xw-01", content: { zh: "彼之謂不道之道", en: "" } },
        { id: "zz-xw-02", content: { zh: "性命之情", en: "" } },
        { id: "zz-xw-03", content: { zh: "古之真人", en: "" } },
        { id: "zz-xw-04", content: { zh: "抱德煬和", en: "" } },
        { id: "zz-xw-05", content: { zh: "其知之也似不知之也，不知而後知之", en: "" } },
        { id: "zz-xw-06", content: { zh: "性命之情", en: "" } },
        { id: "zz-xw-r01", content: { zh: "彼之謂不道之道", en: "" } },
        { id: "zz-xw-r02", content: { zh: "性命之情", en: "" } },
        { id: "zz-xw-r03", content: { zh: "古之真人", en: "" } },
        { id: "zz-xw-r04", content: { zh: "抱德煬和", en: "" } },
        { id: "zz-xw-r05", content: { zh: "其知之也似不知之也，不知而後知之", en: "" } },
        { id: "zz-xw-r06", content: { zh: "性命之情", en: "" } },
      ],
    },
    {
      id: "zz-pianmu",
      title: { zh: "駢拇", en: "Pianmu" },
      segments: [
        {
          id: "zz-pm-01",
          content: { zh: "是得人之得而不自得其得者也", en: "" },
        },
        { id: "zz-pm-02", content: { zh: "性命之情", en: "" } },
        { id: "zz-pm-03", content: { zh: "性命之情", en: "" } },
        { id: "zz-pm-r01", content: { zh: "是得人之得而不自得其得者也", en: "" } },
        { id: "zz-pm-r02", content: { zh: "性命之情", en: "" } },
        { id: "zz-pm-r03", content: { zh: "性命之情", en: "" } },
        { id: "zz-pm-04", content: { zh: "性命之情", en: "" } },
        { id: "zz-pm-r04", content: { zh: "性命之情", en: "" } },
      ],
    },
    {
      id: "zz-zhile",
      title: { zh: "至樂", en: "Zhile" },
      segments: [
        { id: "zz-zl-01", content: { zh: "夜以繼日", en: "" } },
        { id: "zz-zl-02", content: { zh: "塵垢也。死生為晝夜", en: "" } },
        { id: "zz-zl-r01", content: { zh: "塵垢也。死生為晝夜", en: "" } },
      ],
    },
    {
      id: "zz-rangwang",
      title: { zh: "讓王", en: "Rangwang" },
      segments: [
        { id: "zz-rw-01", content: { zh: "必察其所以之", en: "" } },
        { id: "zz-rw-02", content: { zh: "以自樂也", en: "" } },
        {
          id: "zz-rw-03",
          content: { zh: "環堵之室，茨以生草，蓬戶不完，桑以為樞", en: "" },
        },
        { id: "zz-rw-04", content: { zh: "以自樂也", en: "" } },
        { id: "zz-rw-05", content: { zh: "天寒既至，霜露既降", en: "" } },
        { id: "zz-rw-06", content: { zh: "身在江海之上，心居乎魏闕之下", en: "" } },
        { id: "zz-rw-07", content: { zh: "於治天下也", en: "" } },
        { id: "zz-rw-r01", content: { zh: "必察其所以之", en: "" } },
        { id: "zz-rw-r02", content: { zh: "以自樂也", en: "" } },
        { id: "zz-rw-r03", content: { zh: "則必不勝任矣", en: "" } },
        { id: "zz-rw-r04", content: { zh: "環堵之室，茨以生草，蓬戶不完，桑以為樞", en: "" } },
        { id: "zz-rw-r05", content: { zh: "以自樂也", en: "" } },
        { id: "zz-rw-r06", content: { zh: "天寒既至，霜露既降", en: "" } },
        { id: "zz-rw-r07", content: { zh: "身在江海之上，心居乎魏闕之下", en: "" } },
        { id: "zz-rw-r08", content: { zh: "於治天下也", en: "" } },
      ],
    },
    {
      id: "zz-zaiyou",
      title: { zh: "在宥", en: "Zaiyou" },
      segments: [
        { id: "zz-zy-01", content: { zh: "性命之情", en: "" } },
        { id: "zz-zay-01", content: { zh: "使天下欣欣焉人樂其性，是不恬也", en: "" } },
        { id: "zz-zay-02", content: { zh: "儒、墨乃始", en: "" } },
        { id: "zz-zay-03", content: { zh: "性命之情", en: "" } },
        { id: "zz-zay-r01", content: { zh: "性命之情", en: "" } },
        { id: "zz-zay-r02", content: { zh: "使天下欣欣焉人樂其性，是不恬也", en: "" } },
        { id: "zz-zay-r03", content: { zh: "儒、墨乃始", en: "" } },
        { id: "zz-zay-r04", content: { zh: "性命之情", en: "" } },
      ],
    },
    {
      id: "zz-dazongshi",
      title: { zh: "大宗師", en: "Dazongshi" },
      segments: [
        { id: "zz-dqs-01", content: { zh: "入水不濡，入火不熱", en: "" } },
        { id: "zz-dqs-02", content: { zh: "夫大塊載我以形，勞我以生，佚我以老，息我以死。故善吾生者，乃所以善吾死也。夫藏舟於壑，藏山於澤，謂之固矣。然而夜半有力者負之而走，昧者不知也。藏大小有宜，猶有所遯。若夫藏天下於天下，而不得所遯，是恆物之大情也。特犯人之形而猶喜之，若人之形者，萬化而未始有極也，其為樂可勝計邪", en: "" } },
        { id: "zz-dqs-03", content: { zh: "且汝夢為鳥而厲乎天，夢為魚而沒於淵", en: "" } },
        { id: "zz-dqs-04", content: { zh: "魚相忘乎江湖，人相忘乎道術", en: "" } },
        { id: "zz-dqs-05", content: { zh: "其所待者特未定也。庸詎知吾所謂天之非人乎", en: "" } },
        { id: "zz-dqs-06", content: { zh: "芒然彷徨乎塵垢之外，逍遙乎無為之業", en: "" } },
        { id: "zz-dqs-07", content: { zh: "殺生者不死", en: "" } },
        { id: "zz-dqs-r01", content: { zh: "入水不濡，入火不熱", en: "" } },
        { id: "zz-dqs-r02", content: { zh: "夫大塊載我以形，勞我以生，佚我以老，息我以死。故善吾生者，乃所以善吾死也。夫藏舟於壑，藏山於澤，謂之固矣。然而夜半有力者負之而走，昧者不知也。藏大小有宜，猶有所遯。若夫藏天下於天下，而不得所遯，是恆物之大情也。特犯人之形而猶喜之，若人之形者，萬化而未始有極也，其為樂可勝計邪", en: "" } },
        { id: "zz-dqs-r03", content: { zh: "且汝夢為鳥而厲乎天，夢為魚而沒於淵", en: "" } },
        { id: "zz-dqs-r04", content: { zh: "魚相忘乎江湖，人相忘乎道術", en: "" } },
        { id: "zz-dqs-r05", content: { zh: "其所待者特未定也。庸詎知吾所謂天之非人乎", en: "" } },
        { id: "zz-dqs-r06", content: { zh: "芒然彷徨乎塵垢之外，逍遙乎無為之業", en: "" } },
        { id: "zz-dqs-r07", content: { zh: "殺生者不死", en: "" } },
        { id: "zz-dqs-08", content: { zh: "古之真人", en: "" } },
        { id: "zz-dqs-r08", content: { zh: "古之真人", en: "" } },
      ],
    },
    {
      id: "zz-dechongfu",
      title: { zh: "德充符", en: "Dechongfu" },
      segments: [
        { id: "zz-dcf-01", content: { zh: "不足以滑和", en: "" } },
        { id: "zz-dcf-02", content: { zh: "立不教，坐不議", en: "" } },
        { id: "zz-dcf-03", content: { zh: "自其異者視之，肝膽楚越也；自其同者視之，萬物皆一也", en: "" } },
        { id: "zz-dcf-04", content: { zh: "且不知耳目之所宜，而游心於德之和", en: "" } },
        { id: "zz-dcf-05", content: { zh: "人莫鑑於流水，而鑑於止水", en: "" } },
        { id: "zz-dcf-06", content: { zh: "鑑明則塵垢不止", en: "" } },
        { id: "zz-dcf-07", content: { zh: "故聖人有所遊", en: "" } },
        { id: "zz-dcf-08", content: { zh: "而知不能規", en: "" } },
        { id: "zz-dcf-r01", content: { zh: "不足以滑和", en: "" } },
        { id: "zz-dcf-r02", content: { zh: "立不教，坐不議，虛而往，實而歸", en: "" } },
        { id: "zz-dcf-r03", content: { zh: "自其異者視之，肝膽楚越也；自其同者視之，萬物皆一也", en: "" } },
        { id: "zz-dcf-r04", content: { zh: "且不知耳目之所宜，而游心於德之和", en: "" } },
        { id: "zz-dcf-r05", content: { zh: "人莫鑑於流水，而鑑於止水", en: "" } },
        { id: "zz-dcf-r06", content: { zh: "鑑明則塵垢不止", en: "" } },
        { id: "zz-dcf-r07", content: { zh: "故聖人有所遊", en: "" } },
        { id: "zz-dcf-r08", content: { zh: "而知不能規", en: "" } },
      ],
    },
    {
      id: "zz-shanmu",
      title: { zh: "山木", en: "Shanmu" },
      segments: [
        { id: "zz-sm-01", content: { zh: "一龍一蛇，與時俱化", en: "" } },
        { id: "zz-sm-02", content: { zh: "夫萬物之", en: "" } },
        { id: "zz-sm-r01", content: { zh: "一龍一蛇，與時俱化", en: "" } },
        { id: "zz-sm-r02", content: { zh: "夫萬物之", en: "" } },
      ],
    },
    {
      id: "zz-renjianshi",
      title: { zh: "人間世", en: "Renjianshi" },
      segments: [
        { id: "zz-rjs-01", content: { zh: "猶足以養其身", en: "" } },
        { id: "zz-rjs-02", content: { zh: "虛室生白，吉祥止止", en: "" } },
        { id: "zz-rjs-r01", content: { zh: "猶足以養其身", en: "" } },
        { id: "zz-rjs-r02", content: { zh: "虛室生白，吉祥止止", en: "" } },
      ],
    },
    {
      id: "zz-quqie",
      title: { zh: "胠篋", en: "Quqie" },
      segments: [
        { id: "zz-qq-01", content: { zh: "至德之世", en: "" } },
        { id: "zz-qq-02", content: { zh: "聖人哉！然而", en: "" } },
        { id: "zz-qq-r01", content: { zh: "至德之世", en: "" } },
        { id: "zz-qq-r02", content: { zh: "聖人哉！然而", en: "" } },
      ],
    },
    {
      id: "zz-tianzifang",
      title: { zh: "田子方", en: "Tian Zifang" },
      segments: [
        { id: "zz-tzf-01", content: { zh: "古之真人", en: "" } },
        { id: "zz-tzf-r01", content: { zh: "古之真人", en: "" } },
      ],
    },
  ],
};

const lushichunqiu: Text = {
  id: "lushi-chunqiu",
  title: { zh: "呂氏春秋", en: "Lüshi Chunqiu" },
  colorKey: "lushi-chunqiu",
  chapters: [
    {
      id: "lsc-zhizhong",
      title: { zh: "志忠", en: "Zhizhong" },
      segments: [
        { id: "lsc-zz-01", content: { zh: "三日三夜", en: "" } },
        { id: "lsc-zz-r01", content: { zh: "三日三夜", en: "" } },
      ],
    },
  ],
};

export const sampleContinuousMainText: ContinuousText = huainanzi;

export const sampleParallelTexts: Text[] = [
  laozi,
  zhuangzi,
  xunzi,
  liji,
  shenzi,
  hanfeizi,
  zhanguoce,
  lunyu,
  mengzi,
  guanzi,
  lushichunqiu,
];