export const Stress = ({ stress }: { stress?: number }) => {
  return (
    <>
      <div
        className='absolute'
        style={{
          right: '53px',
          top: '53px',
        }}
      >
        <img
          src='/assets/card/stress-cost-bg.webp'
          style={{ height: '70px', width: '70px' }}
        />
      </div>
      <div
        className='absolute text-white'
        style={{ 
          right: '88px', 
          top: '65px',
          fontSize: '30px',
          fontWeight: 'bold'
        }}
      >
        {stress}
      </div>
    </>
  );
};
