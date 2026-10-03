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
  // Dark amber reads as brown, a hue the rest of the palette lacks
  brown: { fill: colors.amber[800], border: colors.amber[950], light: colors.amber[100], text: colors.amber[900] },
  gray: typeColor(colors.gray),
};

// Light variant of a hue: same family, told apart from the 500 fill by lightness
const lightVariant = (hue: Record<string, string>): TypeColor => ({
  fill: hue['300'],
  border: hue['500'],
  light: hue['100'],
  text: hue['800'],
});

const paletteHues = [
  colors.blue, colors.orange, colors.green, colors.purple, colors.red, colors.teal,
  colors.amber, colors.pink, colors.indigo, colors.lime, colors.cyan,
];

// Order matters: early entries are the most distinct, so demos with few types stay
// readable. After the 12 mid-tone hues come their light variants, so types 13-23
// differ from types 1-11 by lightness. Gray is kept out and used for unknown types.
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
  baseColors.brown,
  ...paletteHues.map(lightVariant),
];

// Assigns palette entries to types in the order given, so a demo's legend order fixes
// its colors. Unknown types get gray; lists longer than the palette wrap around.
export function categoricalColors(types: readonly string[]): (type: string) => TypeColor {
  const lookup = new Map(types.map((type, i) => [type, categoricalPalette[i % categoricalPalette.length]]));
  return (type) => lookup.get(type) ?? baseColors.gray;
}

// Non-categorical colors for edges, labels and interaction states. Selection and
// highlight use near-black, which no palette fill shares, so they stand out on every type.
export const graphChrome = {
  edge: colors.gray[400],
  edgeLabel: colors.gray[500],
  label: colors.gray[700],
  nodeStroke: colors.white, // idle outline on D3 nodes, so selection can contrast with it
  selected: colors.gray[900], // selected node outline
  highlight: colors.gray[900], // hovered or connected elements
  dimmed: colors.gray[200], // elements outside the current highlight
};

// Cytoscape style objects for typed nodes and edges
export const nodeStyle = (c: TypeColor) => ({ 'background-color': c.fill, 'border-color': c.border });
export const edgeStyle = (color: string) => ({ 'line-color': color, 'target-arrow-color': color });

// Cytoscape node:selected: white border inside a near-black ring, visible on any fill
export const cytoscapeSelectedStyle = {
  'border-width': 3,
  'border-color': colors.white,
  'underlay-color': graphChrome.selected,
  'underlay-padding': 4,
  'underlay-opacity': 1,
  'underlay-shape': 'ellipse',
} as const;

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

// Unknown labels (e.g. from an imported graph) get gray, as in categoricalColors
export const temporalNodeColor = (label: string): TypeColor => temporalNodeColors[label] ?? baseColors.gray;

// Cytoscape-ready style maps, keyed by node label / edge type
const toNodeStyles = (map: Record<string, TypeColor>) =>
  Object.fromEntries(Object.entries(map).map(([type, c]) => [type, nodeStyle(c)]));
const toEdgeStyles = (map: Record<string, string>) =>
  Object.fromEntries(Object.entries(map).map(([type, color]) => [type, edgeStyle(color)]));

export const nodeTypeColors = toNodeStyles(lifeSciencesNodeColors);
export const edgeTypeColors = toEdgeStyles(lifeSciencesEdgeColors);
export const temporalNodeStyles = toNodeStyles(temporalNodeColors);
export const temporalEdgeStyles = toEdgeStyles(temporalEdgeColors);
