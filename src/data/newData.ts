import type { Text, ContinuousText } from "../types";
import { buildChapter } from "./builder";
import { chap1Data } from "./chapters/chap1";

/* ============================================================================
 * Huainanzi 淮南子 — main text (continuous / unsegmented format)
 *
 * Each chapter stores its full text as a single string per language.
 * Parallel references are encoded as character-index ranges within that string.
 * ==========================================================================*/

const chap1Built = buildChapter(chap1Data);

const huainanzi: ContinuousText = {
  id: "huainanzi",
  title: { zh: "淮南子", en: "Huainanzi" },
  chapters: [
    {
      id: "chap-1",
      title: { zh: "原道訓", en: "Yuandao Xun — Originating in the Way" },
      text: chap1Built.text,
      inlineParallels: chap1Built.inlineParallels,
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
      title: { zh: "66", en: "" },
      segments: [
        { id: "lz-66-01", content: { zh: "是以聖人處上而民不重，", en: "" } },
      ],
    },
    {
      id: "laozi-37",
      title: { zh: "37", en: "" },
      segments: [
        { id: "lz-37-01", content: { zh: "道常無為而無不為。", en: "" } },
      ],
    },
    {
      id: "laozi-48",
      title: { zh: "48", en: "" },
      segments: [{ id: "lz-48-01", content: { zh: "無為而無不為。", en: "" } }],
    },
    {
      id: "laozi-39",
      title: { zh: "39", en: "" },
      segments: [
        {
          id: "lz-39-01",
          content: { zh: "故貴以賤為本，高以下為基。", en: "" },
        },
      ],
    },
    {
      id: "laozi-76",
      title: { zh: "76", en: "" },
      segments: [
        {
          id: "lz-76-01",
          content: { zh: "故堅強者死之徒，柔弱者生之徒。", en: "" },
        },
      ],
    },
    {
      id: "laozi-57",
      title: { zh: "57", en: "" },
      segments: [
        { id: "lz-57-01", content: { zh: "吾何以知其然哉？", en: "" } },
        { id: "lz-57-02", content: { zh: "吾何以知其然哉？", en: "" } },
      ],
    },
    {
      id: "laozi-78",
      title: { zh: "78", en: "" },
      segments: [
        { id: "lz-78-01", content: { zh: "天下莫柔弱於水，", en: "" } },
      ],
    },
    {
      id: "laozi-50",
      title: { zh: "50", en: "" },
      segments: [{ id: "lz-50-01", content: { zh: "出生入死。", en: "" } }],
    },
    {
      id: "laozi-40",
      title: { zh: "40", en: "" },
      segments: [{ id: "lz-40-01", content: { zh: "有生於無。", en: "" } }],
    },
    {
      id: "laozi-15",
      title: { zh: "15", en: "" },
      segments: [
        {
          id: "lz-15-01",
          content: {
            zh: "儼兮其若容； 敦兮其若樸；曠兮其若谷；混兮其若濁；",
            en: "",
          },
        },
      ],
    },
    {
      id: "laozi-20",
      title: { zh: "20", en: "" },
      segments: [{ id: "lz-20-01", content: { zh: "澹兮其若海，", en: "" } }],
    },
    {
      id: "laozi-03",
      title: { zh: "3", en: "" },
      segments: [{ id: "lz-03-01", content: { zh: "是以聖人之治，", en: "" } }],
    },
    {
      id: "laozi-38",
      title: { zh: "38", en: "" },
      segments: [
        { id: "lz-38-01", content: { zh: "上仁為之而無以為；", en: "" } },
      ],
    },
    {
      id: "laozi-29",
      title: { zh: "29", en: "" },
      segments: [
        {
          id: "lz-29-01",
          content: { zh: "天下神器，不可為也，為者敗之，執者失之。", en: "" },
        },
      ],
    },
    {
      id: "laozi-14",
      title: { zh: "14", en: "" },
      segments: [{ id: "lz-14-01", content: { zh: "此三者不可", en: "" } }],
    },
    {
      id: "laozi-40",
      title: { zh: "40", en: "" },
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
        { id: "xu-jz-01", content: { zh: "不言而信，不慮而知，", en: "" } },
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
      segments: [{ id: "lj-ly-01", content: { zh: "以天下為一家，", en: "" } }],
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
          content: { zh: "無為為之之謂天，無為言之之謂德，", en: "" },
        },
        { id: "zz-tia-02", content: { zh: "與物化", en: "" } },
        {
          id: "zz-tia-03",
          content: {
            zh: "至無而供其求，時騁而要其宿，大小、長短、修遠。」",
            en: "",
          },
        },
        {
          id: "zz-tia-04",
          content: { zh: "機心存於胸中，則純白不備；", en: "" },
        },
        { id: "zz-tia-05", content: { zh: "則必不勝任矣。", en: "" } },
        {
          id: "zz-tia-06",
          content: {
            zh: "若然者，藏金於山，藏珠於淵；不利貨財，不近貴富；",
            en: "",
          },
        },
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
          content: { zh: "天下莫大於秋豪之末，而大山為小；", en: "" },
        },
        { id: "zz-qwl-02", content: { zh: "不道之道？", en: "" } },
        {
          id: "zz-qwl-03",
          content: { zh: "如是皆有，為臣妾乎，其臣妾不足以相治乎。", en: "" },
        },
      ],
    },
    {
      id: "zz-mati",
      title: { zh: "馬蹄", en: "Mati" },
      segments: [
        { id: "zz-mati-01", content: { zh: "澤無舟梁；萬物群生，", en: "" } },
      ],
    },
    {
      id: "zz-keyi",
      title: { zh: "刻意", en: "Keyi" },
      segments: [
        { id: "zz-keyi-01", content: { zh: "不可為象，", en: "" } },
        { id: "zz-keyi-02", content: { zh: "感而後應，迫而後動，", en: "" } },
        { id: "zz-keyi-03", content: { zh: "澹然無極", en: "" } },
        {
          id: "zz-keyi-04",
          content: {
            zh: "故曰：悲樂者，德之邪；喜怒者，道之過；好惡者，德之失。故心不憂樂，德之至也；一而不變，靜之至也；無所於忤，虛之至也；不與物交，惔之至也；無所於逆，粹之至也。",
            en: "",
          },
        },
      ],
    },
    {
      id: "zz-xiaoyaoyou",
      title: { zh: "逍遙遊", en: "Xiaoyaoyou" },
      segments: [
        { id: "zz-xyy-01", content: { zh: "羊角而上", en: "" } },
        { id: "zz-xyy-02", content: { zh: "則所用之異也。", en: "" } },
      ],
    },
    {
      id: "zz-zhibeiyou",
      title: { zh: "知北遊", en: "Zhi beiyou" },
      segments: [
        { id: "zz-zby-01", content: { zh: "與物化", en: "" } },
        {
          id: "zz-zby-02",
          content: { zh: "終日視之而不見，聽之而不聞，搏之而不得也。", en: "" },
        },
        { id: "zz-zby-03", content: { zh: "惛然若亡而存，", en: "" } },
        {
          id: "zz-zby-04",
          content: { zh: "四肢彊，思慮恂達，耳目聰明，", en: "" },
        },
      ],
    },
    {
      id: "zz-zeyang",
      title: { zh: "則陽", en: "Zeyang" },
      segments: [
        { id: "zz-zy-01", content: { zh: "與物化", en: "" } },
        {
          id: "zz-zy-02",
          content: { zh: "萬物有乎生而莫見其根，有乎出而莫見其門。", en: "" },
        },
        {
          id: "zz-zy-03",
          content: {
            zh: "是以自外入者，有主而不執；由中出者，有正而不距。",
            en: "",
          },
        },
      ],
    },
    {
      id: "zz-dasheng",
      title: { zh: "大heng", en: "Dasheng" },
      segments: [{ id: "zz-ds-01", content: { zh: "與物化", en: "" } }],
    },
    {
      id: "zz-waiwu",
      title: { zh: "外物", en: "Waiwu" },
      segments: [
        {
          id: "zz-ww-01",
          content: { zh: "木與木相摩則然，金與火相守則流。", en: "" },
        },
      ],
    },
    {
      id: "zz-tianyun",
      title: { zh: "天運", en: "Tianyun" },
      segments: [
        { id: "zz-ty-01", content: { zh: "性不可易，", en: "" } },
        { id: "zz-ty-02", content: { zh: "由外入者，無主於中，", en: "" } },
        { id: "zz-ty-03", content: { zh: "性命之情", en: "" } },
        {
          id: "zz-ty-04",
          content: { zh: "望之而不能見也，逐之而不能及也，", en: "" },
        },
        { id: "zz-ty-05", content: { zh: "聽之不聞其聲，視之不見其形，", en: "" } },
      ],
    },
    {
      id: "zz-qiushui",
      title: { zh: "秋水", en: "Qiushui" },
      segments: [
        {
          id: "zz-qy-01",
          content: {
            zh: "井蛙不可以語於海者，拘於虛也；夏蟲不可以語於冰者，篤於時也；曲士不可以語於道者，束於教也。",
            en: "",
          },
        },
        { id: "zz-qy-02", content: { zh: "必不勝任矣。", en: "" } },
      ],
    },
    {
      id: "zz-gengsangchu",
      title: { zh: "庚桑楚", en: "Gengsang Chu" },
      segments: [{ id: "zz-gsc-01", content: { zh: "以其所好", en: "" } }],
    },
    {
      id: "zz-shanxing",
      title: { zh: "山木", en: "Shanxing" },
      segments: [{ id: "zz-sx-01", content: { zh: "是故安而不順。", en: "" } }],
    },
    {
      id: "zz-xuwugui",
      title: { zh: "徐無有", en: "Xu Wugui" },
      segments: [
        { id: "zz-xw-01", content: { zh: "彼之謂不道之道，", en: "" } },
        { id: "zz-xw-02", content: { zh: "性命之情", en: "" } },
      ],
    },
    {
      id: "zz-pianmu",
      title: { zh: "駢拇", en: "Pianmu" },
      segments: [
        {
          id: "zz-pm-01",
          content: { zh: "是得人之得而不自得其得者也，", en: "" },
        },
        { id: "zz-pm-02", content: { zh: "性命之情", en: "" } },
      ],
    },
    {
      id: "zz-zhile",
      title: { zh: "至樂", en: "Zhile" },
      segments: [{ id: "zz-zl-01", content: { zh: "夜以繼日，", en: "" } }],
    },
    {
      id: "zz-rangwang",
      title: { zh: "讓王", en: "Rangwang" },
      segments: [
        { id: "zz-rw-01", content: { zh: "必察其所以之，", en: "" } },
        { id: "zz-rw-02", content: { zh: "以自樂也", en: "" } },
        {
          id: "zz-rw-03",
          content: { zh: "環堵之室，茨以生草，蓬戶不完，桑以為樞", en: "" },
        },
        { id: "zz-rw-04", content: { zh: "以自樂也", en: "" } },
      ],
    },
    {
      id: "zz-zaiyou",
      title: { zh: "在宥", en: "Zaiyou" },
      segments: [{ id: "zz-zy-01", content: { zh: "夜以繼日，", en: "" } }],
    },
    {
      id: "zz-dazongshi",
      title: { zh: "大宗師", en: "Dazongshi" },
      segments: [
        { id: "zz-dqs-01", content: { zh: "入水不濡，入火不熱。", en: "" } },
      ],
    },
  ],
};

export const sampleContinuousMainText: ContinuousText = huainanzi;

export const sampleParallelTexts: Text[] = [laozi, zhuangzi, xunzi, liji];
