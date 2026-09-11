export interface Ruler {
  id: string;
  era: string;
  name: string;
  years: string;
  title?: string;
  dynasty?: string;
  events: string[];
  keyReforms?: string[];
  egeNote?: string;
  url?: string | null;
}

export interface HistoryTerm {
  id: string;
  term: string;
  era: string;
  definition: string;
  category?: string;
  factForEge?: string;
  egeContext?: string;
  exampleEvent?: string;
  relatedRulers?: string[];
  examWarning?: string;
}

export interface ArchitectureMonument {
  id: string;
  name: string;
  city: string;
  century: string;
  exactYears?: string;
  dates?: string;
  architect?: string;
  style?: string;
  rulerEra?: string;
  ruler?: string;
  founder?: string;
  location?: string;
  description?: string;
  keyFacts?: string[];
  features?: string | string[];
  egeFeatures?: string[];
  destroyedOrStatus?: string;
  egeSignificance?: string;
  egeTaskType?: string;
  examClues?: string;
  imageUrl?: string;
  otherNames?: string;
  unesco?: boolean;
}

export interface HistoryEventDate {
  id: string;
  date: string;
  year?: string;
  title: string;
  era: string;
  category?: string;
  importance?: 'high' | 'normal' | 'medium';
  ruler?: string;
  details?: string;
  egeContext?: string;
  century?: string;
}

export interface SchemeSubnode {
  id?: string;
  title: string;
  description: string;
}

export interface SchemeNode {
  id: string;
  title: string;
  description: string;
  subnodes?: SchemeSubnode[];
}

export interface SchemeHierarchyBranch {
  branchName: string;
  color?: string;
  badge?: string;
  nodes: {
    title: string;
    role?: string;
    desc: string;
    subitems?: string[];
  }[];
}

export interface SchemeHierarchyTree {
  root: {
    title: string;
    role?: string;
    desc: string;
  };
  branches: SchemeHierarchyBranch[];
}

export interface SchemeFlowStep {
  step: number;
  year: string;
  title: string;
  act?: string;
  consequence: string;
  egePoint?: string;
}

export interface SchemeTableData {
  headers: string[];
  rows: {
    label: string;
    cells: string[];
  }[];
}

export interface SchemeBranchGroup {
  groupTitle: string;
  color?: string;
  badge?: string;
  items: {
    title: string;
    subtitle?: string;
    desc: string;
    details?: string[];
  }[];
}

export interface HistoryScheme {
  id: string;
  number?: number;
  title: string;
  category: string;
  era: string;
  description: string;
  examTip?: string;
  nodes: SchemeNode[];
  layoutType?: 'hierarchy' | 'timeline-flow' | 'comparison-table' | 'branches' | 'book-diagram';
  hierarchyTree?: SchemeHierarchyTree;
  flowSteps?: SchemeFlowStep[];
  tableData?: SchemeTableData;
  branches?: SchemeBranchGroup[];
  themeNumber?: number;
  themeTitle?: string;
  period?: string;
  summary?: string;
  egeConclusion?: string;
  page?: number;
  blocks?: string[];
  keyPoints?: string[];
}

export type ActiveTab = 'rulers' | 'dates' | 'terms' | 'architecture' | 'schemes' | 'quiz' | 'about';
