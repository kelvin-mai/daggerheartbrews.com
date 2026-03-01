import { DiceRoller } from '@/components/common/dice-roller';

export default function DiceRollerDevPage() {
  return (
    <div
      className='flex min-h-screen flex-col items-center justify-center gap-6 p-8'
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #1a0f2e 0%, #0a0812 60%, #060509 100%)',
      }}
    >
      <div className='space-y-2 text-center'>
        <h1
          className='text-3xl font-bold tracking-widest text-violet-300 uppercase'
          style={{ fontFamily: 'var(--font-eveleth-clean)' }}
        >
          Dice Roller
        </h1>
        <p className='text-sm tracking-wider text-slate-500'>
          Daggerheart Duality Dice · Damage Dice
        </p>
      </div>

      <div className='max-w-xs space-y-1 text-center text-xs text-slate-600'>
        <p>The dice roller floats in the bottom-right corner.</p>
        <p>Click the button to open it.</p>
      </div>

      <DiceRoller />
    </div>
  );
}
