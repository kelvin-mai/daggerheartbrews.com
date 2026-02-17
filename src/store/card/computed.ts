import type { ZustandGet } from '../types';
import type { CardComputed, CardStore } from './types';

export const createComputed = (get: ZustandGet<CardStore>): CardComputed => ({
  domainColor: (domain: string) => {
    const { domains } = get();
    return domains?.find((d) => d.name === domain)?.color ?? '';
  },
  domainIncludes: (domain: string) => {
    const { domains } = get();
    return domains?.map((d) => d.name).includes(domain);
  },
  classDomains: (className: string) => {
    const { classes } = get();
    const selected = classes?.find((c) => c.name === className);
    return {
      primary: selected?.domainPrimary ?? '',
      secondary: selected?.domainSecondary ?? '',
    };
  },
  classColors: (className: string) => {
    const {
      classes,
      computed: { domainColor },
    } = get();
    const selected = classes?.find((c) => c.name === className);
    return {
      primary: domainColor(selected?.domainPrimary ?? ''),
      secondary: domainColor(selected?.domainSecondary ?? ''),
    };
  },
});
