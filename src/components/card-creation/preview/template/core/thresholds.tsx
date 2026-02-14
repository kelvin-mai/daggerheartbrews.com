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
    <div
      className='relative flex items-center'
      style={{ height: 92, width: 660 }}
    >
      <Image
        src='/assets/card/damage-thresholds.webp'
        alt='damage-thresholds'
        className='absolute'
        fill
      />
      <div
        className='z-10 flex flex-col justify-center text-center'
        style={{
          paddingTop: 29,
          width: 154,
          gap: 13,
        }}
      >
        <div
          className='text-sm font-semibold text-white uppercase'
          style={{ fontSize: 26 }}
        >
          Minor Damage
        </div>
        <div className='text-xs text-black' style={{ fontSize: 18 }}>Mark 1 HP</div>
      </div>
      <div className='text-center font-bold' style={{ width: 99, fontSize: 40 }}>
        {thresholds ? thresholds[0] : 0}
      </div>

      <div
        className='z-10 flex flex-col justify-center text-center'
        style={{
          paddingTop: 29,
          width: 154,
          gap: 13,
        }}
      >
        <div
          className='text-sm font-semibold text-white uppercase'
          style={{ fontSize: 26 }}
        >
          Major Damage
        </div>
        <div className='text-xs text-black' style={{ fontSize: 18 }}>Mark 2 HP</div>
      </div>
      <div className='text-center font-bold' style={{ width: 99, fontSize: 40 }}>
        {thresholds ? thresholds[1] : 0}
      </div>

      <div
        className='z-10 flex flex-col justify-center text-center'
        style={{
          paddingTop: 29,
          width: 154,
          gap: 13,
        }}
      >
        <div
          className='text-sm font-semibold text-white uppercase'
          style={{ fontSize: 26 }}
        >
          Severe Damage
        </div>
        <div className='text-xs text-black' style={{ fontSize: 18 }}>Mark 3 HP</div>
      </div>
    </div>
  );
};
