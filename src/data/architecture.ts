import { ArchitectureMonument } from '../types';
import { ANCIENT_ARCHITECTURE } from './architecture/ancient';
import { MOSCOW_TSARDOM_ARCHITECTURE } from './architecture/moscow_tsardom';
import { IMPERIAL_ARCHITECTURE } from './architecture/imperial';
import { MODERN_SOVIET_ARCHITECTURE } from './architecture/modern_soviet';

export const ARCHITECTURE_DATA: ArchitectureMonument[] = [
  ...ANCIENT_ARCHITECTURE,
  ...MOSCOW_TSARDOM_ARCHITECTURE,
  ...IMPERIAL_ARCHITECTURE,
  ...MODERN_SOVIET_ARCHITECTURE,
];
