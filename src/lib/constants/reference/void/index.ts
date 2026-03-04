import { voidAncestries as _voidAncestries } from './ancestries';
import { voidCommunities as _voidCommunities } from './communities';
import { voidTransformations as _voidTransformations } from './transformations';
import { voidDomainCards as _voidDomainCards } from './domain-cards';
import { voidClasses as _voidClasses } from './classes';
import { voidSubclasses as _voidSubclasses } from './subclasses';

import { withSource } from '../utils';

export const voidAncestries = withSource(_voidAncestries, 'The Void');
export const voidCommunities = withSource(_voidCommunities, 'The Void');
export const voidTransformations = withSource(_voidTransformations, 'The Void');
export const voidDomainCards = withSource(_voidDomainCards, 'The Void');
export const voidClasses = withSource(_voidClasses, 'The Void');
export const voidSubclasses = withSource(_voidSubclasses, 'The Void');
