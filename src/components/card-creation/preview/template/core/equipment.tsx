import { useCardStore } from '@/store';

export const Equipment = () => {
  const {
    card: { tier, tierEnabled, hands, handsEnabled, armor, armorEnabled },
  } = useCardStore();
  return (
    <>
      {tierEnabled && (
        <div className='absolute top-[7.06cqw] left-[7.06cqw]'>
          <img
            className='size-[11.76cqw]'
            src='/assets/card/level-bg.webp'
            alt=''
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p className='z-10 text-[6.47cqw] font-bold text-black'>{tier}</p>
          </div>
        </div>
      )}
      {armorEnabled && (
        <div className='absolute top-[7.06cqw] right-[7.06cqw]'>
          <img
            className='size-[11.76cqw]'
            src='/assets/card/dh-armor-bg.webp'
            alt=''
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <p className='z-10 text-[6.47cqw] font-bold text-black'>{armor}</p>
          </div>
        </div>
      )}
      {handsEnabled && (
        <div className='absolute top-[7.06cqw] right-[7.06cqw]'>
          <img
            className='h-[9.41cqw]'
            src={`/assets/card/dh-${hands === 2 ? 'two-hands' : 'one-hand'}.webp`}
            alt=''
          />
        </div>
      )}
    </>
  );
};
