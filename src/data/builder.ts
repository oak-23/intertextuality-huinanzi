import type { ColorKey } from '../types';

export interface ParallelMatch {
    zhMatch: string;
    enMatch: string;
    textId: string;
    chapterId: string;
    segmentId: string;
    colorKey: ColorKey;
}

export interface ChapterData {
    zhText: string;
    enText: string;
    parallels: ParallelMatch[];
}

export function buildChapter(data: ChapterData) {
    const inlineParallels = data.parallels.map(p => {
        const startZh = data.zhText.indexOf(p.zhMatch);
        const endZh = startZh !== -1 ? startZh + p.zhMatch.length : 0;
        
        const startEn = data.enText.indexOf(p.enMatch);
        const endEn = startEn !== -1 ? startEn + p.enMatch.length : 0;

        if (startZh === -1) console.warn(`Could not find Chinese match: ${p.zhMatch}`);
        if (startEn === -1) console.warn(`Could not find English match: ${p.enMatch}`);

        return {
            startZh, endZh, startEn, endEn,
            textId: p.textId,
            chapterId: p.chapterId,
            segmentId: p.segmentId,
            colorKey: p.colorKey,
        };
    });

    return {
        text: { zh: data.zhText, en: data.enText },
        inlineParallels,
    };
}
