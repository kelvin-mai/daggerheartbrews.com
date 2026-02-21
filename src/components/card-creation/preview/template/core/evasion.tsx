export const Evasion = ({ evasion }: { evasion?: number }) => {
  return (
    <>
      <div className='absolute top-[7.06cqw] right-[7.06cqw]'>
        <div className='relative flex size-[10.59cqw] items-center justify-center'>
          <img
            className='absolute top-0 right-0 w-full'
            src='/assets/card/dh-evasion-bg.webp'
            alt=''
          />
          <p className='z-10 text-[5.88cqw] font-bold text-black'>{evasion}</p>
        </div>
      </div>
    </>
  );
};
