import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme.colors;

// Base colors from Tailwind with consistent primary/light/dark variants
export const baseColors = {
  green: {
    light: colors.green['300'],      // #9ae6b4
    primary: colors.green['500'],    // #48bb78
    dark: colors.green['700'],       // #2f855a
  },
  purple: {
    light: colors.purple['300'],     // #d6bcfa
    primary: colors.purple['500'],   // #9f7aea
    dark: colors.purple['700'],      // #6b46c1
  },
  orange: {
    light: colors.orange['300'],     // #f6ad55
    primary: colors.orange['500'],   // #ed8936
    dark: colors.orange['700'],      // #c05621
  },
  blue: {
    light: colors.blue['300'],       // #90cdf4
    primary: colors.blue['500'],     // #4299e1
    dark: colors.blue['700'],        // #2b6cb0
  },
  gray: {
    light: colors.gray['200'],       // #edf2f7
    primary: colors.gray['500'],     // #a0aec0
    dark: colors.gray['700'],        // #4a5568
  },
  red: {
    light: colors.red['300'],        // #feb2b2
    primary: colors.red['500'],      // #f56565
    dark: colors.red['700'],         // #c53030
  },
  yellow: {
    light: colors.yellow['200'],     // #fefcbf
    primary: colors.yellow['400'],   // #f6e05e
    dark: colors.yellow['600'],      // #d69e2e
  }
};

// Semantic mapping for node types
export const nodeTypeColors = {
  'schema:ClinicalTrial': {
    'background-color': baseColors.green.primary,
    'border-color': baseColors.green.dark
  },
  'schema:Drug': {
    'background-color': baseColors.purple.primary,
    'border-color': baseColors.purple.dark
  },
  'schema:MedicalOrganization': {
    'background-color': baseColors.orange.primary,
    'border-color': baseColors.orange.dark
  },
  'schema:MedicalCondition': {
    'background-color': baseColors.orange.light,
    'border-color': baseColors.orange.primary
  },
  'schema:RegulatoryApproval': {
    'background-color': baseColors.blue.primary,
    'border-color': baseColors.blue.dark
  },
  'schema:GovernmentOrganization': {
    'background-color': baseColors.gray.primary,
    'border-color': baseColors.gray.dark
  }
};

// Semantic mapping for relationship types
export const edgeTypeColors = {
  'schema:fundedBy': {
    'line-color': baseColors.gray.primary,
    'target-arrow-color': baseColors.gray.primary
  },
  'schema:testedDrug': {
    'line-color': baseColors.red.primary,
    'target-arrow-color': baseColors.red.primary
  },
  'schema:approvedBy': {
    'line-color': baseColors.yellow.primary,
    'target-arrow-color': baseColors.yellow.primary
  },
  'schema:relatedTo': {
    'line-color': baseColors.purple.light,
    'target-arrow-color': baseColors.purple.light
  }
};