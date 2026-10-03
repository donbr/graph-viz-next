import colors from 'tailwindcss/colors';

// Graph palette shared by every demo. Values come from Tailwind's default palette (the
// site and donbr.github.io use it unextended), so node colors match legend classes
// like bg-blue-500 and the tag colors on the cards.

export interface TypeColor {
  fill: string;   // 500: node fill, legend swatch
  border: string; // 700: node outline
  light: string;  // 100: badge background
  text: string;   // 800: badge text
}

const typeColor = (hue: Record<string, string>): TypeColor => ({
  fill: hue['500'],
  border: hue['700'],
  light: hue['100'],
  text: hue['800'],
});

export const baseColors = {
  blue: typeColor(colors.blue),
  orange: typeColor(colors.orange),
  green: typeColor(colors.green),
  purple: typeColor(colors.purple),
  red: typeColor(colors.red),
  teal: typeColor(colors.teal),
  amber: typeColor(colors.amber),
  pink: typeColor(colors.pink),
  indigo: typeColor(colors.indigo),
  lime: typeColor(colors.lime),
  cyan: typeColor(colors.cyan),
  slate: typeColor(colors.slate),
  gray: typeColor(colors.gray),
};

// Order matters: early entries are the most distinct, so demos with few types stay
// readable. Gray is kept out and used for unknown types.
export const categoricalPalette: TypeColor[] = [
  baseColors.blue,
  baseColors.orange,
  baseColors.green,
  baseColors.purple,
  baseColors.red,
  baseColors.teal,
  baseColors.amber,
  baseColors.pink,
  baseColors.indigo,
  baseColors.lime,
  baseColors.cyan,
  baseColors.slate,
];

// Assigns palette entries to types in the order given, so a demo's legend order fixes
// its colors. Unknown types get gray; lists longer than the palette wrap around.
export function categoricalColors(types: readonly string[]): (type: string) => TypeColor {
  const lookup = new Map(types.map((type, i) => [type, categoricalPalette[i % categoricalPalette.length]]));
  return (type) => lookup.get(type) ?? baseColors.gray;
}

// Non-categorical colors for edges, labels and interaction states
export const graphChrome = {
  edge: colors.gray[400],
  edgeLabel: colors.gray[500],
  label: colors.gray[700],
  selected: colors.gray[800], // selected node outline
  highlight: colors.blue[600], // hovered or connected elements
  dimmed: colors.gray[200], // elements outside the current highlight
};

// Cytoscape style objects for typed nodes and edges
export const nodeStyle = (c: TypeColor) => ({ 'background-color': c.fill, 'border-color': c.border });
export const edgeStyle = (color: string) => ({ 'line-color': color, 'target-arrow-color': color });

// Clinical Trials Network (schema.org types)
export const lifeSciencesNodeColors: Record<string, TypeColor> = {
  'schema:ClinicalTrial': baseColors.green,
  'schema:Drug': baseColors.purple,
  'schema:MedicalOrganization': baseColors.orange,
  // Light orange: same hue as MedicalOrganization, told apart by lightness
  'schema:MedicalCondition': { fill: colors.orange[300], border: colors.orange[500], light: colors.orange[100], text: colors.orange[800] },
  'schema:RegulatoryApproval': baseColors.blue,
  'schema:GovernmentOrganization': baseColors.gray,
};

export const lifeSciencesEdgeColors: Record<string, string> = {
  'schema:fundedBy': colors.gray[500],
  'schema:testedDrug': colors.red[500],
  'schema:approvedBy': colors.yellow[400],
  'schema:relatedTo': colors.purple[300],
};

// Temporal Network Analysis and its prototypes (Person / Company / Project / Technology)
export const temporalNodeColors: Record<string, TypeColor> = {
  Person: baseColors.blue,
  Company: baseColors.orange,
  Project: baseColors.green,
  Technology: baseColors.purple,
};

export const temporalEdgeColors: Record<string, string> = {
  WORKS_AT: colors.gray[400],
  MANAGES: colors.red[400],
  WORKS_ON: colors.orange[300],
  USES: colors.purple[300],
};

export const temporalNodeColor = (label: string): TypeColor => temporalNodeColors[label] ?? baseColors.blue;

// Cytoscape-ready maps kept under their original names for LifeSciencesGraphViz1
export const nodeTypeColors = Object.fromEntries(
  Object.entries(lifeSciencesNodeColors).map(([type, c]) => [type, nodeStyle(c)])
);
export const edgeTypeColors = Object.fromEntries(
  Object.entries(lifeSciencesEdgeColors).map(([type, color]) => [type, edgeStyle(color)])
);
