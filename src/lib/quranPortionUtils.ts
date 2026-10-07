import { INITIAL_PARAS } from "@/data/islamicData";

export interface PortionBreakdown {
  portionNameUrdu: string;
  portionNameEnglish: string;
  percentage: number;
  fractionLabel: string;
  badgeColor: string;
}

/**
 * Calculates human-understandable Quranic portion terms
 * (Pav Para, Aadha Para, Paun Para, Full Para, etc.)
 */
export function calculatePortionBreakdown(pagesCount: number): PortionBreakdown {
  const fraction = pagesCount / 20;
  const pct = Math.round(fraction * 100);

  if (pagesCount <= 3) {
    return {
      portionNameUrdu: "چند صفحات",
      portionNameEnglish: `~${pagesCount} Pages (~${pct}% of Para)`,
      percentage: pct,
      fractionLabel: `~${fraction.toFixed(1)} Para`,
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200"
    };
  } else if (pagesCount <= 6) {
    return {
      portionNameUrdu: "پاؤ پارہ",
      portionNameEnglish: `Pav Para (~1/4 • ${pct}%)`,
      percentage: pct,
      fractionLabel: "1/4 Para (پاؤ)",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    };
  } else if (pagesCount <= 11) {
    return {
      portionNameUrdu: "آدھا پارہ",
      portionNameEnglish: `Aadha Para (~1/2 • ${pct}%)`,
      percentage: pct,
      fractionLabel: "1/2 Para (آدھا)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    };
  } else if (pagesCount <= 16) {
    return {
      portionNameUrdu: "پون پارہ",
      portionNameEnglish: `Paun Para (~3/4 • ${pct}%)`,
      percentage: pct,
      fractionLabel: "3/4 Para (پون)",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    };
  } else if (pagesCount <= 22) {
    return {
      portionNameUrdu: "ایک پورا پارہ",
      portionNameEnglish: `1 Full Para (${pct}%)`,
      percentage: pct,
      fractionLabel: "1 Full Para (ایک پارہ)",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200"
    };
  } else {
    const paras = (pagesCount / 20).toFixed(1);
    return {
      portionNameUrdu: `${paras} پارے`,
      portionNameEnglish: `${paras} Paras (${pagesCount} pages)`,
      percentage: pct,
      fractionLabel: `${paras} Paras`,
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200"
    };
  }
}

/**
 * Find which Para a page belongs to
 */
export function getParaForPage(pageNum: number) {
  const matched = INITIAL_PARAS.find(p => pageNum >= p.startPage && pageNum <= p.endPage);
  if (matched) return matched;
  const paraNum = Math.min(30, Math.max(1, Math.ceil(pageNum / 20)));
  return {
    paraNumber: paraNum,
    nameArabic: `الجزء ${paraNum}`,
    nameUrdu: `پارہ ${paraNum}`,
    startPage: (paraNum - 1) * 20 + 1,
    endPage: paraNum * 20
  };
}
