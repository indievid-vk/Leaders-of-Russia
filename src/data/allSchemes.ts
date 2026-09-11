import { HistoryScheme } from '../types';
import { SCHEMES_DATA } from './schemes';
import catalogData from './allSchemesCatalog.json';

interface CatalogEntry {
  id: string;
  number: number;
  title: string;
  themeNumber: number;
  themeTitle: string;
  era: string;
  page: number;
  blocks: string[];
  keyPoints: string[];
}

// Map rich schemes by number or id
const richSchemesMap: Record<number, HistoryScheme> = {
  9: SCHEMES_DATA.find(s => s.id === 'scheme-ancient-rus-mgmt')!,
  18: SCHEMES_DATA.find(s => s.id === 'scheme-novgorod-republic')!,
  36: SCHEMES_DATA.find(s => s.id === 'scheme-centralized-rus-15th')!,
  47: SCHEMES_DATA.find(s => s.id === 'scheme-prikazy-system')!,
  56: SCHEMES_DATA.find(s => s.id === 'scheme-peasant-enslavement-flow')!,
  75: SCHEMES_DATA.find(s => s.id === 'scheme-peter-first-reform')!,
  79: SCHEMES_DATA.find(s => s.id === 'scheme-rank-table')!,
  111: SCHEMES_DATA.find(s => s.id === 'scheme-19th-century-state')!,
  148: SCHEMES_DATA.find(s => s.id === 'scheme-great-reforms-branches')!,
  194: SCHEMES_DATA.find(s => s.id === 'scheme-early-20th-parties-table')!,
  249: SCHEMES_DATA.find(s => s.id === 'scheme-ussr-1936-constitution')!,
  257: SCHEMES_DATA.find(s => s.id === 'scheme-wwii-periods-flow')!
};

// Also map by ID so existing links don't break
const richSchemesById = new Map<string, HistoryScheme>();
SCHEMES_DATA.forEach(s => {
  richSchemesById.set(s.id, s);
});

// Build the full 282 schemes list
export const ALL_SCHEMES_DATA: HistoryScheme[] = (catalogData as CatalogEntry[]).map((entry) => {
  const rich = richSchemesMap[entry.number];
  if (rich) {
    return {
      ...rich,
      id: entry.id, // e.g. 'scheme-9'
      number: entry.number,
      page: entry.page,
      themeNumber: entry.themeNumber,
      themeTitle: entry.themeTitle,
      blocks: entry.blocks,
      keyPoints: entry.keyPoints,
      // preserve rich layoutType, hierarchyTree, etc.
    };
  }

  // Standard textbook scheme with blocks & key points
  const nodes = entry.blocks.map((block, idx) => ({
    id: `${entry.id}-node-${idx}`,
    title: `Блок ${idx + 1}`,
    description: block
  }));

  return {
    id: entry.id,
    number: entry.number,
    title: entry.title,
    category: `Тема ${entry.themeNumber}`,
    era: entry.era,
    description: `Схема №${entry.number}. ${entry.themeTitle}. Страница: ${entry.page}.`,
    examTip: `Особое внимание на ЕГЭ обратите на ключевые понятия, персоналии и правовые акты этой темы (${entry.themeTitle}). По схеме №${entry.number} часто формулируются задания 1-й и 2-й части.`,
    page: entry.page,
    themeNumber: entry.themeNumber,
    themeTitle: entry.themeTitle,
    blocks: entry.blocks,
    keyPoints: entry.keyPoints,
    nodes: nodes.length > 0 ? nodes : [
      {
        id: `${entry.id}-main`,
        title: entry.title,
        description: entry.keyPoints.join(' • ')
      }
    ],
    layoutType: 'book-diagram'
  };
});

// Helper functions
export function getSchemeById(id: string): HistoryScheme | undefined {
  return ALL_SCHEMES_DATA.find(s => s.id === id) || richSchemesById.get(id);
}

export function getSchemesByTheme(themeNum: number): HistoryScheme[] {
  return ALL_SCHEMES_DATA.filter(s => s.themeNumber === themeNum);
}

export function getSchemesByEra(era: string): HistoryScheme[] {
  if (era === 'all') return ALL_SCHEMES_DATA;
  return ALL_SCHEMES_DATA.filter(s => s.era === era);
}
