export const Evasion = ({ evasion }: { evasion?: number }) => {
  return (
    <>
      <div className='absolute' style={{ right: '24px', top: '24px' }}>
        <div
          className='relative flex items-center justify-center'
          style={{ height: '36px', width: '36px' }}
        >
          <img
            className='absolute top-0 right-0 w-full'
            src='/assets/card/dh-evasion-bg.webp'
            alt=''
          />
          <p className='z-10 text-xl font-bold text-black'>{evasion}</p>
        </div>
      </div>
    </>
  );
};
