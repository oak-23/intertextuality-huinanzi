import type { Text, ColorKey } from '../types';

/* ============================================================================
 * Huainanzi 淮南子 — main text
 * ==========================================================================*/

const huainanzi: Text = {
  id: 'huainanzi',
  title: { zh: '淮南子', en: 'Huainanzi' },
  chapters: [
    {
      id: 'yuan-dao',
      title: { zh: '原道訓', en: 'Yuandao Xun — Originating in the Way' },
      segments: [
        {
          id: 'yd-01',
          content: {
            zh: '夫道者，覆天載地，廓四方，柝八極，高不可際，深不可測，包裹天地，稟授無形。',
            en: 'The Way covers Heaven and bears up the Earth, extends the four directions and splits the eight ultimates, so high it cannot be reached, so deep it cannot be plumbed; it embraces Heaven and Earth and bestows form upon the formless.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-01-02', colorKey: 'laozi' },
          ],
        },
        {
          id: 'yd-02',
          content: {
            zh: '原流泉浡，沖而徐盈；混混滑滑，濁而徐清。',
            en: 'Like a rising spring it surges forth, void yet gradually filling; turbid and roiling, muddy yet gradually clearing.',
          },
          parallels: [],
        },
        {
          id: 'yd-03',
          content: {
            zh: '故植之而塞於天地，橫之而彌於四海；施之無窮，而無所朝夕。',
            en: 'Set it upright and it fills Heaven and Earth; set it crosswise and it covers the four seas. Apply it without exhaustion, and it knows no morning or evening.',
          },
          parallels: [],
        },
        {
          id: 'yd-04',
          content: {
            zh: '舒之幎於六合，卷之不盈於一握。',
            en: 'Unfurled, it wraps the six directions; rolled up, it does not fill the hand.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-01-04', colorKey: 'laozi' },
            { textId: 'wenzi', chapterId: 'wz-dao-yuan', segmentId: 'wz-03', colorKey: 'wenzi' },
          ],
        },
        {
          id: 'yd-05',
          content: {
            zh: '約而能張，幽而能明，弱而能強，柔而能剛。',
            en: 'Bound, it can extend; obscure, it can illuminate; weak, it can be strong; soft, it can be hard.',
          },
          parallels: [],
        },
        {
          id: 'yd-06',
          content: {
            zh: '橫四維而含陰陽，紘宇宙而章三光。',
            en: 'It crosses the four cardinals and embraces yin and yang; it bounds the cosmos and brightens the three lights.',
          },
          parallels: [],
        },
        {
          id: 'yd-07',
          content: {
            zh: '甚淖而滒，甚纖而微。',
            en: 'So watery it pools and flows; so fine it is barely perceptible.',
          },
          parallels: [],
        },
        {
          id: 'yd-08',
          content: {
            zh: '山以之高，淵以之深，獸以之走，鳥以之飛。',
            en: 'Mountains by it stand high, abysses by it run deep; beasts by it run, birds by it fly.',
            zhRhymed: '山以高，淵以深，獸以走，鳥以飛。',
            enRhymed: 'By it the mountains rise, by it the chasms drop; by it the beasts can run, by it the birds aloft.',
          },
          parallels: [
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-05', colorKey: 'zhuangzi' },
          ],
        },
        {
          id: 'yd-09',
          content: {
            zh: '日月以之明，星辰以之行，麟以之游，鳳以之翔。',
            en: 'The sun and moon by it shine, the stars by it course; the unicorn by it roams, the phoenix by it soars.',
            zhRhymed: '日月以明，星辰以行；麟以游，鳳以翔。',
            enRhymed: 'By it sun and moon are bright, by it the stars in flight; the unicorn doth pace, the phoenix takes its grace.',
          },
          parallels: [],
        },
        {
          id: 'yd-10',
          content: {
            zh: '泰古二皇，得道之柄，立於中央，神與化游，以撫四方。',
            en: 'In high antiquity the Two August Ones grasped the handle of the Way, stood in the centre, and roamed with the spirit of transformation to soothe the four directions.',
          },
          parallels: [
            { textId: 'guanzi', chapterId: 'gz-bai-xin', segmentId: 'gz-04', colorKey: 'guanzi' },
          ],
        },
        {
          id: 'yd-11',
          content: {
            zh: '是故能天運地滯，輪轉而無廢；水流而不息，與萬物終始。',
            en: 'Therefore Heaven can revolve and Earth abide, the wheel turn without halting; water flow on unceasing, beginning and ending with the myriad things.',
          },
          parallels: [],
        },
        {
          id: 'yd-12',
          content: {
            zh: '風興雲蒸，事無不應；雷聲雨降，並應無窮。',
            en: 'Wind rises, clouds gather: nothing fails to answer. Thunder peals and rain descends, responding without end.',
          },
          parallels: [
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-08', colorKey: 'zhuangzi' },
            { textId: 'lushi-chunqiu', chapterId: 'lsc-gui-gong', segmentId: 'lsc-02', colorKey: 'lushi-chunqiu' },
            { textId: 'guanzi', chapterId: 'gz-bai-xin', segmentId: 'gz-07', colorKey: 'guanzi' },
          ],
        },
        {
          id: 'yd-13',
          content: {
            zh: '鬼出電入，龍興鸞集；鈞旋轂轉，週而復匝。',
            en: 'Ghosts appear and lightning flees; dragons rise and luan-birds flock. The potter\'s wheel spins, the axle turns, and round again it goes.',
          },
          parallels: [],
        },
        {
          id: 'yd-14',
          content: {
            zh: '已雕已琢，還反於樸。',
            en: 'Carved and polished, it returns to the uncarved block.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-28', colorKey: 'laozi' },
          ],
        },
        {
          id: 'yd-15',
          content: {
            zh: '無為為之而合於道，無為言之而通乎德。',
            en: 'Act on it without acting, and it accords with the Way; speak of it without speaking, and it penetrates Virtue.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-37', colorKey: 'laozi' },
            { textId: 'wenzi', chapterId: 'wz-dao-yuan', segmentId: 'wz-08', colorKey: 'wenzi' },
          ],
        },
        {
          id: 'yd-16',
          content: {
            zh: '恬愉無矜而得於和，有萬不同而便於性。',
            en: 'Calm, content, and unboastful, one attains harmony; though the myriad things differ, all are at ease in their nature.',
          },
          parallels: [],
        },
        {
          id: 'yd-17',
          content: {
            zh: '神托於秋豪之末，而大宇宙之總，其德優天地而和陰陽。',
            en: 'Spirit lodges at the tip of an autumn hair yet encompasses the whole cosmos; its virtue exceeds Heaven and Earth and harmonises yin and yang.',
          },
          parallels: [
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-11', colorKey: 'zhuangzi' },
          ],
        },
        {
          id: 'yd-18',
          content: {
            zh: '節四時而調五行，呴諭覆育，萬物群生。',
            en: 'It regulates the four seasons and tunes the five phases; sighing it nurtures, covering and rearing the myriad living things.',
          },
          parallels: [],
        },
        {
          id: 'yd-19',
          content: {
            zh: '潤於草木，浸於金石，禽獸碩大，毫毛潤澤。',
            en: 'It moistens the grasses and trees, soaks into metal and stone; birds and beasts grow large, their down and fur all glossy.',
          },
          parallels: [],
        },
        {
          id: 'yd-20',
          content: {
            zh: '羽翼奮也，角觡生也；獸胎不殰，鳥卵不毈。',
            en: 'Feathers and wings beat, antlers and horns grow; beasts in womb do not miscarry, eggs in shell do not addle.',
          },
          parallels: [
            { textId: 'wenzi', chapterId: 'wz-dao-yuan', segmentId: 'wz-12', colorKey: 'wenzi' },
          ],
        },
        {
          id: 'yd-21',
          content: {
            zh: '父無喪子之憂，兄無哭弟之哀；童子不孤，婦人不孀。',
            en: 'No father grieves the loss of a son, no elder brother weeps a younger; children are not orphaned, wives are not widowed.',
          },
          parallels: [],
        },
        {
          id: 'yd-22',
          content: {
            zh: '虹蜺不出，賊星不行，含德之所致也。',
            en: 'No rainbows of ill omen appear, no rogue stars wander — such is what the embrace of Virtue brings about.',
          },
          parallels: [],
        },
        {
          id: 'yd-23',
          content: {
            zh: '夫太上之道，生萬物而不有，成化像而弗宰。',
            en: 'The supreme Way gives birth to the myriad things without owning them; it completes the work of transformation without lording over them.',
            zhRhymed: '生萬物而不有，成化像而弗宰。',
            enRhymed: 'It brings forth all, yet claims no due; it shapes the world, yet bows to none.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-02-04', colorKey: 'laozi' },
          ],
        },
        {
          id: 'yd-24',
          content: {
            zh: '跂行喙息，蠉飛蠕動，待而後生，莫之知德；待而後死，莫之能怨。',
            en: 'Creeping things and breathing creatures, fluttering and crawling, all depend on it for life — yet none thank its virtue; all depend on it for death — yet none reproach it.',
          },
          parallels: [
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-14', colorKey: 'zhuangzi' },
          ],
        },
        {
          id: 'yd-25',
          content: {
            zh: '得之者不誾，失之者不譽。收聚畜積而不加富，布施稟受而不益貧。',
            en: 'Those who gain it do not glorify; those who lose it do not begrudge. Hoard and amass — it grows no richer; distribute and bestow — it grows no poorer.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-22', colorKey: 'laozi' },
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-17', colorKey: 'zhuangzi' },
          ],
        },
        {
          id: 'yd-26',
          content: {
            zh: '忽兮恍兮，不可為象兮；恍兮忽兮，用不屈兮。',
            en: 'Vague and shadowy — it cannot be imaged; shadowy and vague — yet its use is inexhaustible.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-21', colorKey: 'laozi' },
          ],
        },
        {
          id: 'yd-27',
          content: {
            zh: '幽兮冥兮，應於無形兮；遂兮洞兮，不虛動兮。',
            en: 'Hidden and dark — it answers what has no form; flowing and pierced through — it never moves in vain.',
          },
          parallels: [],
        },
        {
          id: 'yd-28',
          content: {
            zh: '與剛柔卷舒兮，與陰陽俯仰兮。',
            en: 'With the hard and the soft it rolls and unrolls; with yin and yang it bows and rises.',
          },
          parallels: [],
        },
        {
          id: 'yd-29',
          content: {
            zh: '泰古二皇，得道之柄，立於中央，神與化遊，以撫四方。',
            en: 'The Two August Ones of high antiquity grasped the handle of the Way, stood in the centre, and roamed with transformation to soothe the four quarters.',
          },
          parallels: [
            { textId: 'guanzi', chapterId: 'gz-bai-xin', segmentId: 'gz-10', colorKey: 'guanzi' },
          ],
        },
        {
          id: 'yd-30',
          content: {
            zh: '是故能天運地滯，週而復匝。',
            en: 'Thus Heaven can revolve and Earth abide, round again and again it goes.',
          },
          parallels: [],
        },
      ],
    },
    {
      id: 'chu-zhen',
      title: { zh: '俶真訓', en: 'Chuzhen Xun — Activating the Genuine' },
      segments: [
        {
          id: 'cz-01',
          content: {
            zh: '有始者，有未始有有始者，有未始有夫未始有有始者。',
            en: 'There is a beginning; there is a not-yet-having-a-beginning; there is a not-yet-having-the-not-yet-having-a-beginning.',
          },
          parallels: [
            { textId: 'zhuangzi', chapterId: 'zz-da-zong-shi', segmentId: 'zz-19', colorKey: 'zhuangzi' },
          ],
        },
        {
          id: 'cz-02',
          content: {
            zh: '有有者，有無者，有未始有有無者，有未始有夫未始有有無者。',
            en: 'There is being, there is non-being; there is a not-yet-having-being-and-non-being; there is a not-yet-having-the-not-yet-having-being-and-non-being.',
          },
          parallels: [],
        },
        {
          id: 'cz-03',
          content: {
            zh: '夫聖人之心，靜乎天地之鑒，萬物之鏡也。',
            en: 'The sage\'s heart-mind, in stillness, is the mirror of Heaven and Earth, the looking-glass of the myriad things.',
          },
          parallels: [
            { textId: 'hanfeizi', chapterId: 'hfz-jie-lao', segmentId: 'hfz-02', colorKey: 'hanfeizi' },
          ],
        },
        {
          id: 'cz-04',
          content: {
            zh: '虛靜恬淡，寂寞無為，此天地之平而道德之至。',
            en: 'Empty, still, calm, plain; silent, void, non-acting — this is the level of Heaven and Earth and the perfection of the Way and Virtue.',
          },
          parallels: [],
        },
        {
          id: 'cz-05',
          content: {
            zh: '故帝王聖人休焉。',
            en: 'Therefore the sage-emperors and -kings rest here.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-29', colorKey: 'laozi' },
          ],
        },
        {
          id: 'cz-06',
          content: {
            zh: '休則虛，虛則實，實者倫矣。',
            en: 'Resting, they are empty; empty, they are full; what is full is in order.',
          },
          parallels: [],
        },
        {
          id: 'cz-07',
          content: {
            zh: '虛則靜，靜則動，動則得矣。',
            en: 'Empty, they are still; still, they move; moving, they attain.',
          },
          parallels: [
            { textId: 'shiji', chapterId: 'sj-lao-zhuang', segmentId: 'sj-03', colorKey: 'shiji' },
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-37', colorKey: 'laozi' },
          ],
        },
        {
          id: 'cz-08',
          content: {
            zh: '靜則無為，無為也，則任事者責矣。',
            en: 'Still, they are without action; without action, those entrusted with affairs bear the responsibility.',
          },
          parallels: [],
        },
        {
          id: 'cz-09',
          content: {
            zh: '無為則愉愉，愉愉者憂患不能處。',
            en: 'Without action, they are at ease; being at ease, no grief or care can lodge in them.',
          },
          parallels: [
            { textId: 'hanfeizi', chapterId: 'hfz-jie-lao', segmentId: 'hfz-05', colorKey: 'hanfeizi' },
          ],
        },
        {
          id: 'cz-10',
          content: {
            zh: '故鏡水之與形接也，不設智故，而方圓曲直弗能逃也。',
            en: 'When mirror and water meet form, they devise no schemes — yet square and round, crooked and straight, cannot escape them.',
          },
          parallels: [],
        },
        {
          id: 'cz-11',
          content: {
            zh: '是故響不肆應，景不一設。',
            en: 'Therefore an echo does not stretch to answer; a shadow does not set itself uniformly.',
          },
          parallels: [
            { textId: 'shanhaijing', chapterId: 'shj-nan-shan', segmentId: 'shj-04', colorKey: 'shanhaijing' },
          ],
        },
        {
          id: 'cz-12',
          content: {
            zh: '叫呼仿佛，默然自得。',
            en: 'Calling out vaguely, in silence one finds oneself.',
          },
          parallels: [],
        },
        {
          id: 'cz-13',
          content: {
            zh: '所以貴道者，以其無形也。',
            en: 'What we honour in the Way is its formlessness.',
          },
          parallels: [
            { textId: 'laozi', chapterId: 'ddj-1', segmentId: 'ddj-14', colorKey: 'laozi' },
          ],
        },
        {
          id: 'cz-14',
          content: {
            zh: '無形則無制也，無制故莫能應。',
            en: 'Without form, it cannot be regulated; uncontrolled, nothing can resist it.',
          },
          parallels: [],
        },
        {
          id: 'cz-15',
          content: {
            zh: '是以聖人藏於無原，故其情不可得而觀。',
            en: 'Therefore the sage hides at the origin of no-origin, so his feelings cannot be observed.',
          },
          parallels: [
            { textId: 'shiji', chapterId: 'sj-lao-zhuang', segmentId: 'sj-08', colorKey: 'shiji' },
          ],
        },
      ],
    },
  ],
};

/* ============================================================================
 * Parallel texts
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

const laozi = mkText(
  'laozi',
  '老子',
  'Lǎozǐ — Dào Dé Jīng',
  'laozi',
  'ddj-1',
  '道經',
  'Book of the Way',
  [
    { id: 'ddj-01-01', zh: '道可道，非常道。', en: 'The Way that can be spoken is not the constant Way.' },
    { id: 'ddj-01-02', zh: '名可名，非常名。', en: 'The name that can be named is not the constant name.' },
    { id: 'ddj-01-03', zh: '無，名天地之始；有，名萬物之母。', en: 'Nothing — the name of the beginning of Heaven and Earth. Being — the name of the mother of the myriad things.' },
    { id: 'ddj-01-04', zh: '故常無，欲以觀其妙；常有，欲以觀其徼。', en: 'In constant non-being, behold its mysteries; in constant being, behold its bounds.' },
    { id: 'ddj-02-04', zh: '生而不有，為而不恃，功成而弗居。', en: 'Give birth without possessing; act without claiming; succeed without dwelling on it.' },
    { id: 'ddj-14', zh: '視之不見名曰夷，聽之不聞名曰希，搏之不得名曰微。', en: 'Looked at but unseen — call it "level"; listened to but unheard — call it "rare"; grasped at but not held — call it "fine".' },
    { id: 'ddj-21', zh: '道之為物，惟恍惟惚。惚兮恍兮，其中有象。', en: 'The Way as a thing — only vague, only shadowy. Shadowy yet vague: within it there are images.' },
    { id: 'ddj-22', zh: '曲則全，枉則直，窪則盈，敝則新。', en: 'Bent, then whole; crooked, then straight; hollow, then full; worn, then new.' },
    { id: 'ddj-28', zh: '樸散則為器，聖人用之則為官長。', en: 'When the uncarved block is divided, it becomes vessels. The sage uses it and becomes the chief of officials.' },
    { id: 'ddj-29', zh: '是以聖人去甚，去奢，去泰。', en: 'Therefore the sage discards excess, discards extravagance, discards arrogance.' },
    { id: 'ddj-37', zh: '道常無為而無不為。', en: 'The Way is constantly without action, and yet there is nothing it does not do.' },
    { id: 'ddj-40', zh: '反者道之動；弱者道之用。', en: 'Reversal is the movement of the Way; weakness is the use of the Way.' },
    { id: 'ddj-42', zh: '道生一，一生二，二生三，三生萬物。', en: 'The Way gives birth to one; one to two; two to three; three to the myriad things.' },
    { id: 'ddj-48', zh: '為學日益，為道日損。', en: 'To pursue learning, daily increase; to pursue the Way, daily diminish.' },
    { id: 'ddj-56', zh: '知者不言，言者不知。', en: 'Those who know do not speak; those who speak do not know.' },
    { id: 'ddj-78', zh: '天下莫柔弱於水，而攻堅強者莫之能勝。', en: 'In all the world nothing is softer or weaker than water — yet for attacking the hard and strong nothing surpasses it.' },
  ]
);

const zhuangzi = mkText(
  'zhuangzi',
  '莊子',
  'Zhuāngzǐ',
  'zhuangzi',
  'zz-da-zong-shi',
  '大宗師',
  'The Great and Venerable Teacher',
  [
    { id: 'zz-01', zh: '知天之所為，知人之所為者，至矣。', en: 'To know what Heaven does and what man does — that is the utmost.' },
    { id: 'zz-02', zh: '夫道，有情有信，無為無形。', en: 'The Way has its essence and its sincerity; it has no acting, no form.' },
    { id: 'zz-03', zh: '可傳而不可受，可得而不可見。', en: 'It can be transmitted but not received, attained but not seen.' },
    { id: 'zz-04', zh: '自本自根，未有天地，自古以固存。', en: 'Self-rooted, self-based — before Heaven and Earth, from antiquity it stood firm.' },
    { id: 'zz-05', zh: '神鬼神帝，生天生地。', en: 'It made the gods and the spirits, gave birth to Heaven and Earth.' },
    { id: 'zz-06', zh: '在太極之先而不為高，在六極之下而不為深。', en: 'Above the supreme ultimate, yet not high; below the six ultimates, yet not deep.' },
    { id: 'zz-07', zh: '先天地生而不為久，長於上古而不為老。', en: 'Born before Heaven and Earth, yet not ancient; older than highest antiquity, yet not aged.' },
    { id: 'zz-08', zh: '希韋氏得之，以挈天地；伏戲氏得之，以襲氣母。', en: 'Xiwei obtained it, and held up Heaven and Earth; Fuxi obtained it, and harmonised the mother of breath.' },
    { id: 'zz-09', zh: '維斗得之，終古不忒。', en: 'The Dipper obtained it, and from antiquity has not erred.' },
    { id: 'zz-10', zh: '日月得之，終古不息。', en: 'The sun and moon obtained it, and from antiquity have not ceased.' },
    { id: 'zz-11', zh: '堪坏得之，以襲崑崙。', en: 'Kanpi obtained it, and dwelt on Mount Kunlun.' },
    { id: 'zz-12', zh: '禺強得之，立乎北極。', en: 'Yu Qiang obtained it, and stood at the north pole.' },
    { id: 'zz-13', zh: '西王母得之，坐乎少廣。', en: 'The Queen Mother of the West obtained it, and sat at Shaoguang.' },
    { id: 'zz-14', zh: '莫知其始，莫知其終。', en: 'No one knows its beginning, no one knows its end.' },
    { id: 'zz-15', zh: '彭祖得之，上及有虞，下及五伯。', en: 'Peng Zu obtained it; above he reached Youyu, below he reached the Five Hegemons.' },
    { id: 'zz-16', zh: '傅說得之，以相武丁。', en: 'Fu Yue obtained it, and served as minister to Wuding.' },
    { id: 'zz-17', zh: '得之者，不可勝計；失之者，亦不可勝計。', en: 'Those who have obtained it are too many to count; those who have lost it are also too many to count.' },
    { id: 'zz-19', zh: '有始也者，有未始有始也者；有未始有夫未始有始也者。', en: 'There is a beginning; there is a not-yet-having-a-beginning; there is a not-yet-having-that-not-yet-having-a-beginning.' },
  ]
);

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

export const sampleMainText: Text = huainanzi;

export const sampleParallelTexts: Text[] = [
  laozi,
  zhuangzi,
  lushiChunqiu,
  wenzi,
  guanzi,
  hanfeizi,
  shanhaijing,
  shiji,
];
