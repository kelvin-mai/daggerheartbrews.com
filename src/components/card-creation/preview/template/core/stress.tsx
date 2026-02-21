export const Stress = ({ stress }: { stress?: number }) => {
  return (
    <>
      <div className='absolute top-[7.06cqw] right-[7.06cqw]'>
        <img
          className='size-[9.41cqw]'
          src='/assets/card/stress-cost-bg.webp'
          alt=''
        />
      </div>
      <div className='absolute top-[8.53cqw] right-[11.76cqw] text-[4.12cqw] text-white'>
        {stress}
      </div>
    </>
  );
};
