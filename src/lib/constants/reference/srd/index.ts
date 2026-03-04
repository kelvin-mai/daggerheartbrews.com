export * from './adversary-feats';
export * from './domains';

import { adversaries as _adversaries } from './adversaries';
import { environments as _environments } from './environments';
import { ancestries as _ancestries } from './ancestries';
import { communities as _communities } from './communities';
import { armor as _armor } from './armor';
import { weapons as _weapons } from './weapons';
import { consumables as _consumables } from './consumables';
import { items as _items } from './items';
import { classes as _classes } from './classes';
import { subclasses as _subclasses } from './subclasses';
import { beastforms as _beastforms } from './bestforms';

import { withSource } from '../utils';

export const adversaries = withSource(_adversaries, 'SRD');
export const environments = withSource(_environments, 'SRD');
export const ancestries = withSource(_ancestries, 'SRD');
export const communities = withSource(_communities, 'SRD');
export const armor = withSource(_armor, 'SRD');
export const weapons = withSource(_weapons, 'SRD');
export const consumables = withSource(_consumables, 'SRD');
export const items = withSource(_items, 'SRD');
export const classes = withSource(_classes, 'SRD');
export const subclasses = withSource(_subclasses, 'SRD');
export const beastforms = withSource(_beastforms, 'SRD');
