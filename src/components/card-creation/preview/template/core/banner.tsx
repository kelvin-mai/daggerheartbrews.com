import {
  ArcanaDomainIcon,
  BladeDomainIcon,
  BoneDomainIcon,
  CodexDomainIcon,
  DaggerheartBrewsIcon,
  DreadDomainIcon,
  GraceDomainIcon,
  MidnightDomainIcon,
  SageDomainIcon,
  SplendorDomainIcon,
  ValorDomainIcon,
} from '@/components/icons';
import { CardDetails } from '@/lib/types';
import { cn, getBrightness } from '@/lib/utils';
import { useCardComputed } from '@/store';

const getDomainIcon = (domain?: string) => {
  switch (domain) {
    case 'arcana':
      return ArcanaDomainIcon;
    case 'blade':
      return BladeDomainIcon;
    case 'bone':
      return BoneDomainIcon;
    case 'codex':
      return CodexDomainIcon;
    case 'grace':
      return GraceDomainIcon;
    case 'midnight':
      return MidnightDomainIcon;
    case 'sage':
      return SageDomainIcon;
    case 'splendor':
      return SplendorDomainIcon;
    case 'valor':
      return ValorDomainIcon;
    case 'dread':
      return DreadDomainIcon;
    default:
      return DaggerheartBrewsIcon;
  }
};

const renderDomainIcon = (
  domain?: string,
  color?: string,
  check?: boolean,
  icon?: string,
) => {
  if (!check && icon) {
    return <img className='size-[9.41cqw]' src={icon} alt='' />;
  }

  const Icon = getDomainIcon(domain);
  return <Icon className='size-[9.41cqw]' style={{ color }} />;
};

export const Banner = ({
  type,
  level,
  domainPrimary,
  domainSecondary,
  domainPrimaryColor,
  domainSecondaryColor,
  domainPrimaryIcon,
  domainSecondaryIcon,
}: CardDetails) => {
  const { domainIncludes } = useCardComputed();
  const foregroundColor =
    getBrightness(domainPrimaryColor) < 128 ? 'white' : 'black';
  const PrimaryIcon = renderDomainIcon(
    domainPrimary,
    foregroundColor,
    domainIncludes(domainPrimary || ''),
    domainPrimaryIcon,
  );
  const SecondaryIcon = renderDomainIcon(
    domainSecondary,
    foregroundColor,
    domainIncludes(domainSecondary || ''),
    domainSecondaryIcon,
  );
  return (
    <>
      <div className='absolute -top-[1.18cqw] left-[7.06cqw] z-40'>
        <img
          className='h-[35.29cqw] w-[18.53cqw]'
          src='/assets/card/banner.webp'
          alt=''
        />
      </div>

      <div className='absolute top-[4.71cqw] left-[16.47cqw] z-50 -translate-x-1/2'>
        {type === 'domain' ? (
          <p
            className='font-eveleth-clean text-[7.65cqw]'
            style={{ color: foregroundColor }}
          >
            {level}
          </p>
        ) : (domainPrimary !== 'custom' && domainPrimary !== domainSecondary) ||
          domainPrimary === 'custom' ? (
          PrimaryIcon
        ) : null}
      </div>

      <div className='absolute top-[15.88cqw] left-[16.47cqw] z-50 -translate-x-1/2'>
        {['class', 'subclass'].includes(type) ? SecondaryIcon : PrimaryIcon}
      </div>

      <div
        className={cn(
          'clip-card-banner-fg absolute -top-[1.18cqw] left-[7.65cqw] z-30 h-[35.29cqw] w-[17.35cqw]',
        )}
        style={{ background: domainPrimaryColor }}
      />
      <div
        className={cn(
          'clip-card-banner-bg absolute -top-[1.18cqw] left-[7.65cqw] z-20 h-[35.29cqw] w-[17.35cqw]',
        )}
        style={{ background: domainSecondaryColor }}
      />
    </>
  );
};
