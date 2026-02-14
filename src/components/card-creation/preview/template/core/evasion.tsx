export const Evasion = ({ evasion }: { evasion?: number }) => {
  return (
    <>
      <div className='absolute' style={{ right: '53px', top: '53px' }}>
        <div
          className='relative flex items-center justify-center'
          style={{ height: '79px', width: '79px' }}
        >
          <img
            className='absolute top-0 right-0 w-full'
            src='/assets/card/dh-evasion-bg.webp'
          />
          <p className='z-10 text-4xl font-bold text-black'>{evasion}</p>
        </div>
      </div>
    </>
  );
};
