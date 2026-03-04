export * from './types';
export * from './utils';

import {
  adversaries as srdAdversaries,
  environments as srdEnvironments,
  ancestries as srdAncestries,
  communities as srdCommunities,
  armor,
  weapons,
  consumables,
  items,
  beastforms,
  classes as srdClasses,
  subclasses as srdSubclasses,
  exampleFeatures,
  domainColor,
} from './srd';

import {
  voidAncestries,
  voidCommunities,
  voidTransformations,
  voidDomainCards,
  voidClasses,
  voidSubclasses,
} from './void';

// Pass-through SRD-only exports
export {
  armor,
  weapons,
  consumables,
  items,
  beastforms,
  exampleFeatures,
  domainColor,
};

// Combined exports (SRD + The Void)
export const adversaries = srdAdversaries;
export const environments = srdEnvironments;
export const ancestries = [...srdAncestries, ...voidAncestries];
export const communities = [...srdCommunities, ...voidCommunities];
export const classes = [...srdClasses, ...voidClasses];
export const subclasses = [...srdSubclasses, ...voidSubclasses];
export const transformations = voidTransformations;
export const domainCards = voidDomainCards;
