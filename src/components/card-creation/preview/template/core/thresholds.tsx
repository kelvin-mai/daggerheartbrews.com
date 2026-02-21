import * as React from 'react';

import Image from 'next/image';

export const Thresholds: React.FC<{
  thresholds?: [number, number];
  thresholdsEnabled?: boolean;
}> = ({ thresholds, thresholdsEnabled }) => {
  if (!thresholdsEnabled) {
    return null;
  }
  return (
    <div className='relative flex h-[12.35cqw] w-[88.24cqw] items-center'>
      <Image
        src='/assets/card/damage-thresholds.webp'
        alt='damage-thresholds'
        className='absolute'
        fill
      />
      <div className='z-10 flex w-[20.59cqw] flex-col justify-center gap-[1.76cqw] pt-[5.88cqw] text-center'>
        <div className='text-[3.53cqw] font-semibold text-white uppercase'>
          Minor Damage
        </div>
        <div className='text-[3.53cqw] text-black'>Mark 1 HP</div>
      </div>
      <div className='w-[13.24cqw] text-center text-[3.53cqw] font-bold'>
        {thresholds ? thresholds[0] : 0}
      </div>

      <div className='z-10 flex w-[20.59cqw] flex-col justify-center gap-[1.76cqw] pt-[5.88cqw] text-center'>
        <div className='text-[3.53cqw] font-semibold text-white uppercase'>
          Major Damage
        </div>
        <div className='text-[3.53cqw] text-black'>Mark 2 HP</div>
      </div>
      <div className='w-[13.24cqw] text-center text-[3.53cqw] font-bold'>
        {thresholds ? thresholds[1] : 0}
      </div>

      <div className='z-10 flex w-[20.59cqw] flex-col justify-center gap-[1.76cqw] pt-[5.88cqw] text-center'>
        <div className='text-[3.53cqw] font-semibold text-white uppercase'>
          Severe Damage
        </div>
        <div className='text-[3.53cqw] text-black'>Mark 3 HP</div>
      </div>
    </div>
  );
};
