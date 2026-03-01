import {
  GameMasterBattle,
  GameMasterMisc,
  GameMasterRolls,
  GameMasterTables,
  GameMasterTraits,
} from '@/components/game-master';
import { PageHeader } from '@/components/common';

export const metadata = {
  title: 'Game Master Screen',
  description: 'GM Screen with quick reference to common rules',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Game Master Screen'
        subtitle='GM Screen with quick reference to common rules'
      />
      <div className='my-4 columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3'>
        <GameMasterTables />
        <GameMasterRolls />
        <GameMasterTraits />
        <GameMasterBattle />
        <GameMasterMisc />
      </div>
    </>
  );
}
