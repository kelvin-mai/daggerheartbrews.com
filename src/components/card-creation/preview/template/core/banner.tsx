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
    return <img src={icon} style={{ height: '32px', width: '32px' }} alt='' />;
  }

  const Icon = getDomainIcon(domain);
  return <Icon style={{ height: '32px', width: '32px', color }} />;
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
      <div
        className='absolute z-40'
        style={{
          top: '-4px',
          left: '24px',
        }}
      >
        <img
          src='/assets/card/banner.webp'
          style={{
            height: '120px',
            width: '63px',
          }}
          alt=''
        />
      </div>

      <div
        className='absolute z-50'
        style={{ transform: 'translateX(-50%)', left: '56px', top: '16px' }}
      >
        {type === 'domain' ? (
          <p
            className='font-eveleth-clean'
            style={{ fontSize: '26px', color: foregroundColor }}
          >
            {level}
          </p>
        ) : (domainPrimary !== 'custom' && domainPrimary !== domainSecondary) ||
          domainPrimary === 'custom' ? (
          PrimaryIcon
        ) : null}
      </div>

      <div
        className='absolute z-50'
        style={{ transform: 'translateX(-50%)', left: '56px', top: '54px' }}
      >
        {['class', 'subclass'].includes(type) ? SecondaryIcon : PrimaryIcon}
      </div>

      <div
        className={cn('clip-card-banner-fg absolute z-30')}
        style={{
          left: '26px',
          top: '-4px',
          height: '120px',
          width: '59px',
          background: domainPrimaryColor,
        }}
      />
      <div
        className={cn('clip-card-banner-bg absolute z-20')}
        style={{
          left: '26px',
          top: '-4px',
          height: '120px',
          width: '59px',
          background: domainSecondaryColor,
        }}
      />
    </>
  );
};
