import { useCardStore } from '@/store';

export const Equipment = () => {
  const {
    card: { tier, tierEnabled, hands, handsEnabled, armor, armorEnabled },
  } = useCardStore();
  return (
    <>
      {tierEnabled && (
        <div className='absolute' style={{ left: '24px', top: '24px' }}>
          <img className='size-10' src='/assets/card/level-bg.webp' alt='' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p
              className='z-10 font-bold text-black'
              style={{
                fontSize: '22px',
              }}
            >
              {tier}
            </p>
          </div>
        </div>
      )}
      {armorEnabled && (
        <div className='absolute' style={{ right: '24px', top: '24px' }}>
          <img className='size-10' src='/assets/card/dh-armor-bg.webp' alt='' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p
              className='z-10 font-bold text-black'
              style={{
                fontSize: '22px',
              }}
            >
              {armor}
            </p>
          </div>
        </div>
      )}
      {handsEnabled && (
        <div className='absolute' style={{ right: '24px', top: '24px' }}>
          <img
            className='h-8'
            src={`/assets/card/dh-${hands === 2 ? 'two-hands' : 'one-hand'}.webp`}
            alt=''
          />
        </div>
      )}
    </>
  );
};
