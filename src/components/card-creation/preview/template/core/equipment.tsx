import { useCardStore } from '@/store';

export const Equipment = () => {
  const {
    card: { tier, tierEnabled, hands, handsEnabled, armor, armorEnabled },
  } = useCardStore();
  return (
    <>
      {tierEnabled && (
        <div className='absolute' style={{ left: '53px', top: '53px' }}>
          <img className='size-22' src='/assets/card/level-bg.webp' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p
              className='z-10 font-bold text-black'
              style={{
                fontSize: '48px',
              }}
            >
              {tier}
            </p>
          </div>
        </div>
      )}
      {armorEnabled && (
        <div className='absolute' style={{ right: '53px', top: '53px' }}>
          <img className='size-22' src='/assets/card/dh-armor-bg.webp' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p
              className='z-10 font-bold text-black'
              style={{
                fontSize: '48px',
              }}
            >
              {armor}
            </p>
          </div>
        </div>
      )}
      {handsEnabled && (
        <div className='absolute' style={{ right: '53px', top: '53px' }}>
          <img
            className='h-18'
            src={`/assets/card/dh-${hands === 2 ? 'two-hands' : 'one-hand'}.webp`}
          />
        </div>
      )}
    </>
  );
};
