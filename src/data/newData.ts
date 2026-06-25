import type { Text, ColorKey, ContinuousText } from '../types';
import { buildChapter } from './builder';
import { chap1Data } from './chapters/chap1';

/* ============================================================================
 * Huainanzi 淮南子 — main text (continuous / unsegmented format)
 *
 * Each chapter stores its full text as a single string per language.
 * Parallel references are encoded as character-index ranges within that string.
 * ==========================================================================*/

const chap1Built = buildChapter(chap1Data);

const huainanzi: ContinuousText = {
    id: 'huainanzi',
    title: { zh: '淮南子', en: 'Huainanzi' },
    chapters: [
        {
            id: 'chap-1',
            title: { zh: '原道訓', en: 'Yuandao Xun — Originating in the Way' },
            text: chap1Built.text,
            inlineParallels: chap1Built.inlineParallels,
        },
    ],
};

/* ============================================================================
 * Parallel texts — kept as segment-based Text objects for lookup
 * ==========================================================================*/

function mkText(
    id: string,
    zhTitle: string,
    enTitle: string,
    colorKey: ColorKey,
    chapterId: string,
    chapterZh: string,
    chapterEn: string,
    segments: Array<{ id: string; zh: string; en: string }>
): Text {
    return {
        id,
        title: { zh: zhTitle, en: enTitle },
        colorKey,
        chapters: [
            {
                id: chapterId,
                title: { zh: chapterZh, en: chapterEn },
                segments: segments.map((s) => ({
                    id: s.id,
                    content: { zh: s.zh, en: s.en },
                    parallels: [],
                })),
            },
        ],
    };
}

const laozi: Text = {
    id: 'laozi',
    title: { zh: '老子', en: 'Laozi' },
    colorKey: 'laozi',
    chapters: [
        {
            id: 'laozi-66',
            title: { zh: '66', en: '' },
            segments: [
                { id: 'lz-66-01', content: { zh: '是以聖人處上而民不重，', en: '' } },
            ],
        },
        {
            id: 'laozi-37',
            title: { zh: '37', en: '' },
            segments: [
                { id: 'lz-37-01', content: { zh: '道常無為而無不為。', en: '' } },
            ],
        },
        {
            id: 'laozi-48',
            title: { zh: '48', en: '' },
            segments: [
                { id: 'lz-48-01', content: { zh: '無為而無不為。', en: '' } },
            ],
        },
        {
            id: 'laozi-39',
            title: { zh: '39', en: '' },
            segments: [
                { id: 'lz-39-01', content: { zh: '故貴以賤為本，高以下為基。', en: '' } },
            ],
        },
        {
            id: 'laozi-76',
            title: { zh: '76', en: '' },
            segments: [
                { id: 'lz-76-01', content: { zh: '故堅強者死之徒，柔弱者生之徒。', en: '' } },
            ],
        },
        {
            id: 'laozi-57',
            title: { zh: '57', en: '' },
            segments: [
                { id: 'lz-57-01', content: { zh: '吾何以知其然哉？', en: '' } },
            ],
        },
        {
            id: 'laozi-78',
            title: { zh: '78', en: '' },
            segments: [
                { id: 'lz-78-01', content: { zh: '天下莫柔弱於水，', en: '' } },
            ],
        },
        {
            id: 'laozi-50',
            title: { zh: '50', en: '' },
            segments: [
                { id: 'lz-50-01', content: { zh: '出生入死。', en: '' } },
            ],
        },
        {
            id: 'laozi-40',
            title: { zh: '40', en: '' },
            segments: [
                { id: 'lz-40-01', content: { zh: '有生於無。', en: '' } },
            ],
        },
        {
            id: 'laozi-15',
            title: { zh: '15', en: '' },
            segments: [
                { id: 'lz-15-01', content: { zh: '儼兮其若容； 敦兮其若樸；曠兮其若谷；混兮其若濁；', en: '' } },
            ],
        },
        {
            id: 'laozi-20',
            title: { zh: '20', en: '' },
            segments: [
                { id: 'lz-20-01', content: { zh: '澹兮其若海，', en: '' } },
            ],
        },
        {
            id: 'laozi-03',
            title: { zh: '3', en: '' },
            segments: [
                { id: 'lz-03-01', content: { zh: '是以聖人之治，', en: '' } },
            ],
        },
    ]
};

const xunzi: Text = {
    id: 'xunzi',
    title: { zh: '荀子', en: 'Xunzi' },
    colorKey: 'xunzi',
    chapters: [
        {
            id: 'junzi',
            title: { zh: '君子', en: 'Junzi' },
            segments: [
                { id: 'xu-jz-01', content: { zh: '不言而信，不慮而知，', en: '' } },
            ],
        },
    ]
};

const zhuangzi: Text = {
    id: 'zhuangzi',
    title: { zh: '莊子', en: 'Zhuāngzǐ' },
    colorKey: 'zhuangzi',
    chapters: [
        {
            id: 'zz-tiandi',
            title: { zh: '天地', en: 'Heaven and Earth' },
            segments: [
                { id: 'zz-tia-01', content: { zh: '無為為之之謂天，無為言之之謂德，有萬不同之謂富。', en: '' } },
                { id: 'zz-tia-02', content: { zh: '與物化', en: '' } },
                { id: 'zz-tia-03', content: { zh: '至無而供其求，時騁而要其宿，大小、長短、修遠。」', en: '' } },
                { id: 'zz-tia-04', content: { zh: '機心存於胸中，則純白不備；', en: '' } },
            ],
        },
        {
            id: 'zz-qiwu-lun',
            title: { zh: '齊物論', en: 'Qiwu Lun — Discourse on the Equalisation of Things' },
            segments: [
                { id: 'zz-qwl-01', content: { zh: '天下莫大於秋豪之末，而大山為小；', en: '' } },
                { id: 'zz-qwl-02', content: { zh: '不道之道？', en: '' } },
            ],
        },
        {
            id: 'zz-mati',
            title: { zh: '馬蹄', en: 'Mati' },
            segments: [
                { id: 'zz-mati-01', content: { zh: '澤無舟梁；萬物群生，', en: '' } },
            ],
        },
        {
            id: 'zz-keyi',
            title: { zh: '刻意', en: 'Keyi' },
            segments: [
                { id: 'zz-keyi-01', content: { zh: '不可為象，', en: '' } },
                { id: 'zz-keyi-02', content: { zh: '感而後應，迫而後動，', en: '' } },
                { id: 'zz-keyi-03', content: { zh: '澹然無極', en: '' } },
                { id: 'zz-keyi-04', content: { zh: '故曰：悲樂者，德之邪；喜怒者，道之過；好惡者，德之失。故心不憂樂，德之至也；一而不變，靜之至也；無所於忤，虛之至也；不與物交，惔之至也；無所於逆，粹之至也。', en: '' } },
            ],
        },
        {
            id: 'zz-xiaoyaoyou',
            title: { zh: '逍遙遊', en: 'Xiaoyaoyou — Free and Easy Wandering' },
            segments: [
                { id: 'zz-xyy-01', content: { zh: '羊角而上', en: '' } },
            ],
        },
        {
            id: 'zz-zhibeiyou',
            title: { zh: '知北遊', en: 'Zhibeiyou — Knowing Before the North' },
            segments: [
                { id: 'zz-zby-01', content: { zh: '與物化', en: '' } },
                { id: 'zz-zby-02', content: { zh: '聽之不聞其聲，視之不見其形，', en: '' } },
                { id: 'zz-zby-03', content: { zh: '惛然若亡而存，', en: '' } },
            ],
        },
        {
            id: 'zz-zeyang',
            title: { zh: '則陽', en: 'Zeyang' },
            segments: [
                { id: 'zz-zy-01', content: { zh: '與物化', en: '' } },
                { id: 'zz-zy-02', content: { zh: '萬物有乎生而莫見其根，有乎出而莫見其門。', en: '' } },
            ],
        },
        {
            id: 'zz-dasheng',
            title: { zh: '大heng', en: 'Dasheng' },
            segments: [
                { id: 'zz-ds-01', content: { zh: '與物化', en: '' } },
            ],
        },
        {
            id: 'zz-waiwu',
            title: { zh: '外物', en: 'Waiwu' },
            segments: [
                { id: 'zz-ww-01', content: { zh: '木與木相摩則然，金與火相守則流。', en: '' } },
            ],
        },
        {
            id: 'zz-tianyun',
            title: { zh: '天運', en: 'Tianyun' },
            segments: [
                { id: 'zz-ty-01', content: { zh: '性不可易，', en: '' } },
            ],
        },
        {
            id: 'zz-qiushui',
            title: { zh: '秋水', en: 'Qiushui' },
            segments: [
                { id: 'zz-qy-01', content: { zh: '井蛙不可以語於海者，拘於虛也；夏蟲不可以語於冰者，篤於時也；曲士不可以語於道者，束於教也。', en: '' } },
            ],
        },
        {
            id: 'zz-gengsangchu',
            title: { zh: '庚桑楚', en: 'Gengsang Chu' },
            segments: [
                { id: 'zz-gsc-01', content: { zh: '以其所好', en: '' } },
            ],
        },
        {
            id: 'zz-shanxing',
            title: { zh: '山木', en: 'Shanxing' },
            segments: [
                { id: 'zz-sx-01', content: { zh: '是故安而不順。', en: '' } },
            ],
        },
        {
            id: 'zz-xuwugui',
            title: { zh: '徐無有', en: 'Xu Wugui' },
            segments: [
                { id: 'zz-xw-01', content: { zh: '彼之謂不道之道，', en: '' } },
            ],
        },
    ],
};

const lushiChunqiu = mkText(
    'lushi-chunqiu',
    '呂氏春秋',
    'Lǚshì Chūnqiū',
    'lushi-chunqiu',
    'lsc-gui-gong',
    '貴公',
    'Honouring the Public Good',
    [
        { id: 'lsc-01', zh: '昔先聖王之治天下也，必先公。', en: 'In governing the world the ancient sage-kings always put the public good first.' },
        { id: 'lsc-02', zh: '公則天下平矣。', en: 'When the public is honoured, the world is at peace.' },
        { id: 'lsc-03', zh: '平得於公。', en: 'Peace is gained through impartiality.' },
        { id: 'lsc-04', zh: '嘗試觀於上志。', en: 'Try to consider the records of the ancients.' },
        { id: 'lsc-05', zh: '有得天下者眾矣，其得之以公，其失之必以偏。', en: 'Many have gained the world; those who gained it did so through impartiality, those who lost it always through bias.' },
        { id: 'lsc-06', zh: '凡主之立也，生於公。', en: 'The establishment of any ruler is born of the public good.' },
        { id: 'lsc-07', zh: '故《鴻範》曰：「無偏無黨，王道蕩蕩。」', en: 'The Hong Fan says: "Without bias, without partisanship — the kingly Way is broad and open."' },
        { id: 'lsc-08', zh: '天無私覆也，地無私載也。', en: 'Heaven covers without favour, Earth bears up without favour.' },
        { id: 'lsc-09', zh: '日月無私照也，四時無私行也。', en: 'Sun and moon shine without favour, the four seasons run without favour.' },
        { id: 'lsc-10', zh: '行其德而萬物得遂長焉。', en: 'They practise their virtue and the myriad things accomplish their growth.' },
        { id: 'lsc-11', zh: '黃帝言曰：「聲禁重，色禁重，衣禁重，香禁重，味禁重，室禁重。」', en: 'The Yellow Emperor said: "Beware of excess in sound, in colour, in dress, in fragrance, in flavour, in dwelling."' },
        { id: 'lsc-12', zh: '故先王不安逸樂，從便能也。', en: 'Therefore the former kings did not rest in ease, but followed what they were able to do.' },
        { id: 'lsc-13', zh: '無偏無頗，遵王之義。', en: 'Without bias, without partiality — follow the principle of the king.' },
        { id: 'lsc-14', zh: '故知天之所道者，可以為治。', en: 'Therefore one who knows what Heaven\'s Way is can govern.' },
        { id: 'lsc-15', zh: '萬物之化，無不有也。', en: 'Among the transformations of the myriad things, nothing is absent.' },
    ]
);

const wenzi = mkText(
    'wenzi',
    '文子',
    'Wénzǐ',
    'wenzi',
    'wz-dao-yuan',
    '道原',
    'The Source of the Way',
    [
        { id: 'wz-01', zh: '老子曰：有物混成，先天地生。', en: 'Lao Zi said: there was something formed in chaos, born before Heaven and Earth.' },
        { id: 'wz-02', zh: '惟夷惟惚，寂兮寥兮。', en: 'Only level, only shadowy; silent and vast.' },
        { id: 'wz-03', zh: '舒之幎於六合，卷之不盈於一握。', en: 'Unfurled, it covers the six directions; rolled up, it does not fill the hand.' },
        { id: 'wz-04', zh: '約而能張，幽而能明。', en: 'Bound, it can spread; obscure, it can illuminate.' },
        { id: 'wz-05', zh: '柔弱而能剛強。', en: 'Soft and weak, yet capable of firm and strong.' },
        { id: 'wz-06', zh: '故無為者，道之宗也。', en: 'Therefore non-action is the ancestor of the Way.' },
        { id: 'wz-07', zh: '得道者外化而內不化。', en: 'Those who attain the Way transform outwardly yet do not change within.' },
        { id: 'wz-08', zh: '無為為之，而通於道；無為言之，而通於德。', en: 'Act without acting, and one penetrates the Way; speak without speaking, and one penetrates Virtue.' },
        { id: 'wz-09', zh: '通於道者，反己。', en: 'Those who penetrate the Way return to themselves.' },
        { id: 'wz-10', zh: '反己則無欲。', en: 'Returning to oneself, one is without desire.' },
        { id: 'wz-11', zh: '無欲則靜。', en: 'Without desire, one is still.' },
        { id: 'wz-12', zh: '靜則明，明則通。', en: 'Still, one is clear; clear, one penetrates.' },
        { id: 'wz-13', zh: '通則無蔽。', en: 'Penetrating, one has no obscurity.' },
        { id: 'wz-14', zh: '聖人因時而動，順理而行。', en: 'The sage moves according to the season and acts according to the pattern.' },
        { id: 'wz-15', zh: '故能與天地相終始。', en: 'Therefore he can begin and end together with Heaven and Earth.' },
    ]
);

const guanzi = mkText(
    'guanzi',
    '管子',
    'Guǎnzǐ',
    'guanzi',
    'gz-bai-xin',
    '白心',
    'The Purified Mind',
    [
        { id: 'gz-01', zh: '建當立有，以靖為宗。', en: 'Establish what is fitting, set up what is, taking stillness as ancestor.' },
        { id: 'gz-02', zh: '以時為寶，以政為儀。', en: 'Take timing as treasure, take order as model.' },
        { id: 'gz-03', zh: '和則能久。', en: 'Harmony — and one can endure.' },
        { id: 'gz-04', zh: '非吾儀，雖利不為。', en: 'If it does not match my standard, even if profitable I will not do it.' },
        { id: 'gz-05', zh: '非吾常，雖利不行。', en: 'If it is not my constant, even if profitable I will not act on it.' },
        { id: 'gz-06', zh: '非吾道，雖利不取。', en: 'If it is not my Way, even if profitable I will not take it.' },
        { id: 'gz-07', zh: '原心而行，原行而事。', en: 'Begin with the heart-mind to act, begin with action to handle affairs.' },
        { id: 'gz-08', zh: '心安則國安，心治則國治。', en: 'When the heart is at peace, the state is at peace; when the heart is in order, the state is in order.' },
        { id: 'gz-09', zh: '治也者心也，安也者心也。', en: 'Order is in the heart; peace is in the heart.' },
        { id: 'gz-10', zh: '故能正其心者，能正其形。', en: 'Therefore one who can rectify the heart can rectify the form.' },
        { id: 'gz-11', zh: '能正其形者，能正其行。', en: 'One who can rectify the form can rectify conduct.' },
        { id: 'gz-12', zh: '故聖人之治也，靜身以待。', en: 'Therefore the sage governs by stilling himself and waiting.' },
        { id: 'gz-13', zh: '物至而名自治之。', en: 'Things arrive, and the name takes order of itself.' },
        { id: 'gz-14', zh: '正名自治，奇身名廢。', en: 'Right names take order of themselves; bent persons and names fall away.' },
        { id: 'gz-15', zh: '名正法備，則聖人無事。', en: 'When names are right and laws complete, the sage has no affairs.' },
    ]
);

const hanfeizi = mkText(
    'hanfeizi',
    '韓非子',
    'Hánfēizǐ',
    'hanfeizi',
    'hfz-jie-lao',
    '解老',
    'Explaining the Laozi',
    [
        { id: 'hfz-01', zh: '德者，內也；得者，外也。', en: 'Virtue is what is inside; gaining is what is outside.' },
        { id: 'hfz-02', zh: '上德不德，言其神不淫於外也。', en: '"Superior virtue does not virtue" means the spirit does not stray outward.' },
        { id: 'hfz-03', zh: '神不淫於外則身全。', en: 'When the spirit does not stray outward, the body is whole.' },
        { id: 'hfz-04', zh: '身全之謂德。', en: 'A whole body is what is meant by virtue.' },
        { id: 'hfz-05', zh: '德者，得身也。', en: 'Virtue is gaining oneself.' },
        { id: 'hfz-06', zh: '凡德者，以無為集，以無欲成。', en: 'All virtue gathers through non-action and completes through non-desire.' },
        { id: 'hfz-07', zh: '以不思安，以不用固。', en: 'Through not thinking it is at peace; through not using it is firm.' },
        { id: 'hfz-08', zh: '為之欲之，則德無舍。', en: 'If one acts upon it and desires it, virtue has no lodging.' },
        { id: 'hfz-09', zh: '德無舍則不全。', en: 'If virtue has no lodging, it is not whole.' },
        { id: 'hfz-10', zh: '用之思之，則不固。', en: 'If one uses it and thinks of it, it is not firm.' },
        { id: 'hfz-11', zh: '不固則無功。', en: 'If not firm, there is no merit.' },
        { id: 'hfz-12', zh: '無功則生於德。', en: 'No merit — yet it is born from virtue.' },
        { id: 'hfz-13', zh: '德則無德，不德則在有德。', en: 'When virtue is, there is no virtue; when no virtue is sought, then virtue is present.' },
        { id: 'hfz-14', zh: '故曰：「上德不德，是以有德。」', en: 'Therefore it is said: "Superior virtue does not virtue, and therefore has virtue."' },
        { id: 'hfz-15', zh: '所以貴無為無思以為虛者，謂其意無所制也。', en: 'What we honour in non-action and non-thinking, taking them as empty, is that the will is unconstrained.' },
    ]
);

const shanhaijing = mkText(
    'shanhaijing',
    '山海經',
    'Shānhǎijīng',
    'shanhaijing',
    'shj-nan-shan',
    '南山經',
    'Classic of the Southern Mountains',
    [
        { id: 'shj-01', zh: '南山經之首曰䧿山。', en: 'The first of the Classic of the Southern Mountains is called Que Mountain.' },
        { id: 'shj-02', zh: '其首曰招搖之山，臨于西海之上。', en: 'Its first peak is called Zhaoyao, overlooking the western sea.' },
        { id: 'shj-03', zh: '多桂，多金玉。', en: 'It has many cassia trees, much gold and jade.' },
        { id: 'shj-04', zh: '有草焉，其狀如韭而青華。', en: 'There is a plant there shaped like leek with blue-green flowers.' },
        { id: 'shj-05', zh: '其名曰祝餘，食之不饑。', en: 'It is called zhuyu; those who eat it do not hunger.' },
        { id: 'shj-06', zh: '有木焉，其狀如穀而黑理。', en: 'There is a tree there shaped like a paper-mulberry with black markings.' },
        { id: 'shj-07', zh: '其華四照。', en: 'Its blossoms shine in four directions.' },
        { id: 'shj-08', zh: '其名曰迷穀，佩之不迷。', en: 'It is called migu; wearing it, one does not lose one\'s way.' },
        { id: 'shj-09', zh: '有獸焉，其狀如禺而白耳。', en: 'There is a beast there shaped like an ape with white ears.' },
        { id: 'shj-10', zh: '伏行人走，其名曰狌狌。', en: 'It walks on all fours and runs upright; it is called the xingxing.' },
        { id: 'shj-11', zh: '食之善走。', en: 'Eating it, one runs swiftly.' },
        { id: 'shj-12', zh: '麗𪊨之水出焉，而西流注于海。', en: 'The river Lijiao rises here and flows west into the sea.' },
        { id: 'shj-13', zh: '其中多育沛，佩之無瘕疾。', en: 'In it are many yupei; wearing them, one has no stomach disease.' },
        { id: 'shj-14', zh: '又東三百里，曰堂庭之山。', en: 'Three hundred li further east, called Tangting Mountain.' },
        { id: 'shj-15', zh: '多棪木，多白猿。', en: 'It has many yan trees and many white gibbons.' },
    ]
);

const shiji = mkText(
    'shiji',
    '史記',
    'Shǐjì',
    'shiji',
    'sj-lao-zhuang',
    '老子韓非列傳',
    'Biographies of Laozi and Han Feizi',
    [
        { id: 'sj-01', zh: '老子者，楚苦縣厲鄉曲仁里人也。', en: 'Laozi was a man of Quren in Lixiang, Ku county, Chu.' },
        { id: 'sj-02', zh: '姓李氏，名耳，字聃。', en: 'His surname was Li, his name Er, his style name Dan.' },
        { id: 'sj-03', zh: '周守藏室之史也。', en: 'He was the keeper of the archives of the Zhou.' },
        { id: 'sj-04', zh: '孔子適周，將問禮於老子。', en: 'Confucius went to Zhou and was about to ask Laozi about ritual.' },
        { id: 'sj-05', zh: '老子曰：「子所言者，其人與骨皆已朽矣。」', en: 'Laozi said: "Those of whom you speak — both the men and their bones have long since decayed."' },
        { id: 'sj-06', zh: '「獨其言在耳。」', en: '"Only their words remain in our ears."' },
        { id: 'sj-07', zh: '老子修道德，其學以自隱無名為務。', en: 'Laozi cultivated the Way and Virtue; his teaching took self-effacement and namelessness as its task.' },
        { id: 'sj-08', zh: '居周久之，見周之衰，乃遂去。', en: 'Long had he dwelt in Zhou; seeing the Zhou decline, he then departed.' },
        { id: 'sj-09', zh: '至關，關令尹喜曰：「子將隱矣，強為我著書。」', en: 'When he reached the pass, the keeper Yin Xi said: "Master, you are about to withdraw — please write a book for me."' },
        { id: 'sj-10', zh: '於是老子乃著書上下篇，言道德之意五千餘言而去。', en: 'Thereupon Laozi composed an upper and lower book, expounding the meaning of the Way and Virtue in more than five thousand words, and departed.' },
        { id: 'sj-11', zh: '莫知其所終。', en: 'No one knows where he ended.' },
        { id: 'sj-12', zh: '或曰：老萊子亦楚人也。', en: 'Some say: Lao Laizi was also a man of Chu.' },
        { id: 'sj-13', zh: '著書十五篇，言道家之用。', en: 'He composed fifteen chapters expounding the use of the Daoist school.' },
        { id: 'sj-14', zh: '與孔子同時云。', en: 'It is said he was contemporary with Confucius.' },
        { id: 'sj-15', zh: '蓋老子百有六十餘歲，或言二百餘歲。', en: 'Some say Laozi lived more than 160 years; others, more than 200.' },
    ]
);

export const sampleContinuousMainText: ContinuousText = huainanzi;

export const sampleParallelTexts: Text[] = [
    laozi,
    zhuangzi,
    lushiChunqiu,
    wenzi,
    guanzi,
    hanfeizi,
    shanhaijing,
    shiji,
    xunzi,
];