import { Table, TableCell, TableRow } from '../ui/table';
import { GameMasterCollapsible } from './collapsible';
import { GameMasterTable } from './tables';

export const GameMasterTables = () => {
  const tables: {
    label: string;
    caption?: string;
    items: { term: string; description: string }[];
  }[] = [
    {
      label: 'Quick Reference',
      items: [
        {
          term: 'Advantage',
          description: 'Add a d6 advantage die to your roll.',
        },
        {
          term: 'Disadvantage',
          description: 'Subtract a d6 from your roll.',
        },
        {
          term: 'Helping an ally',
          description:
            'Spend a hope and roll a d6 advantage die to add to their roll.',
        },
        {
          term: 'Group action',
          description:
            'Nominate a leader of the action. All other PCs in the group action make reaction rolls. Any successs give the leader a +1 modifier. Any failures give -1. Leader makes roll after and uses gained modifiers',
        },
        {
          term: 'Tag Team',
          description:
            'Each PC can spend 3 hope once per session to initiate a tag team move. Both make action rolls and you choose which to you use, Hope and Fear accrued for both players, both roll damage and add it together.',
        },
        {
          term: 'Vulnerable',
          description: 'Rolls against have advantage',
        },
        {
          term: 'Restrained',
          description: "Can't move",
        },
        {
          term: 'Temporary',
          description: 'Removed witha GM move',
        },
      ],
    },
    {
      label: 'Conditions',
      items: [
        {
          term: 'Hidden',
          description:
            "Whilst out of sight from all foes and they don't know where you are, you're hidden. Any rolls against you are at disadvantage, you're no longer hidden when you make an attack or a foe can see you.",
        },
        {
          term: 'Restrained',
          description:
            "You can't move until cleared, but you can still take actions from your position",
        },
        {
          term: 'Vulnerable',
          description:
            'Work with the GM to describe how you become vulnerable and all rolls against you have advantage until cleared.',
        },
        {
          term: 'Temporary Conditions',
          description:
            'If no requirements are given then it is a temporary condition. You can clear this with an action roll at a difficulty level determined by the GM.',
        },
      ],
    },
    {
      label: 'Short Rest',
      caption:
        'PCs may swap any of their domain cards for cards in their vault. They then choose 2 of the following actions GM gains 1d4 fear.',
      items: [
        {
          term: 'Tend to wounds',
          description:
            'Clear 1d4 + tier hit points. This can be used on an ally.',
        },
        {
          term: 'Clear stress',
          description:
            'Describe how you blow off steam and clear 1d4 + tier of stress',
        },
        {
          term: 'Repair armor',
          description:
            'Clear 1d4 + tier of armor slots. This can be used on an ally',
        },
        {
          term: 'Prepare',
          description:
            'Prepare for the next day an gain a hope, if done with a friend, gain 2',
        },
      ],
    },
    {
      label: 'Long Rest',
      caption: 'Same as short rest, but you can progress a countdown as well',
      items: [
        {
          term: 'Tend to all wounds',
          description: 'Clear all hit points. This can be used on an ally',
        },
        {
          term: 'Clear all stress',
          description: 'Clear all stress',
        },
        {
          term: 'Repair all armor',
          description: 'Clear all armor slots. This can be used on an ally.',
        },
        {
          term: 'Work on a project',
          description:
            'Establish or work on a project. GM can ask for a roll to determine progress.',
        },
      ],
    },
  ];

  return (
    <>
      {tables.map((table) => (
        <GameMasterCollapsible
          key={table.label}
          label={table.label}
          defaultOpen
          className='break-inside-avoid'
        >
          <GameMasterTable items={table.items} />
        </GameMasterCollapsible>
      ))}
    </>
  );
};

export const GameMasterRolls = () => {
  const resultsTable = [
    {
      term: 'Critical Success',
      description: 'Clear a stress and gain a hope',
    },
    {
      term: 'Success with Hope',
      description: 'Get what they want and a hope',
    },
    {
      term: 'Success with Fear',
      description: 'Add a consequence and GM gains a fear',
    },
    {
      term: 'Failure with Hope',
      description: 'Unsuccessful but gain a hope',
    },
    {
      term: 'Failure with Fear',
      description: 'Things go badly and GM gains a fear',
    },
  ];
  const sections: { label: string; texts: string[] }[] = [
    {
      label: 'Damage Rolls',
      texts: [
        'After a successful attack, roll a number of weapon dice equal to your proficiency and add them together.',
        'If the attack roll crits, add the max potential value of your damage to your damage roll.',
      ],
    },
    {
      label: 'Reaction Rolls',
      texts: [
        "Reaction rolls work like action rolls but don't generate hope or fear (or GM moves)",
      ],
    },
  ];
  return (
    <GameMasterCollapsible
      label='Dice Rolls'
      className='break-inside-avoid'
      defaultOpen
    >
      <div className='space-y-2 px-2'>
        <h3 className='font-bold'>Action Rolls</h3>
        <p>Call for a roll where the outcome is interesting to the story.</p>
        <ul className='ml-8 list-disc'>
          {[
            'Pick a trait',
            'Decide a difficulty',
            'Assign advantage or disadvantage if necessary',
            'Roll and resolve',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className='font-bold'>Difficulty</h3>
        <div className='grid grid-cols-6 gap-2'>
          {[5, 10, 15, 20, 25, 30].map((d) => (
            <div
              key={d}
              className='bg-primary text-primary-foreground flex aspect-square items-center justify-center rounded-lg p-4 text-xl font-bold'
            >
              {d}
            </div>
          ))}
        </div>
        <div className='flex justify-around'>
          <p>Easy</p>
          <p>Average</p>
          <p>Hard</p>
          <p>Very Hard</p>
        </div>
      </div>
      <GameMasterTable caption='Action Roll Results' items={resultsTable} />
      <div className='space-y-2 pb-2'>
        {sections.map((section) => (
          <div key={section.label} className='px-2'>
            <h3 className='font-bold'>{section.label}</h3>
            {section.texts.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        ))}
      </div>
    </GameMasterCollapsible>
  );
};

export const GameMasterTraits = () => {
  const traits: { trait: string; description: string }[] = [
    {
      trait: 'agility',
      description: 'sprint, leap, maneuver',
    },
    {
      trait: 'strength',
      description: 'lift, smash, grapple',
    },
    {
      trait: 'finesse',
      description: 'control, hide, tinker',
    },
    {
      trait: 'instinct',
      description: 'perceive, sense, navigate',
    },
    {
      trait: 'presense',
      description: 'charm, perform, deceive',
    },
    {
      trait: 'knowledge',
      description: 'recall, analyze, comprehend',
    },
  ];
  return (
    <GameMasterCollapsible
      label='Personal Traits'
      className='break-inside-avoid'
      defaultOpen
    >
      <div className='grid grid-cols-2 gap-2 p-2'>
        {traits.map((trait) => (
          <div key={trait.trait} className='bg-primary rounded-md p-2'>
            <h3 className='font-eveleth-clean font-lg text-primary-foreground'>
              {trait.trait}
            </h3>
            <p className='text-sm text-white capitalize'>{trait.description}</p>
          </div>
        ))}
      </div>
    </GameMasterCollapsible>
  );
};

export const GameMasterBattle = () => {
  const adjustments = [
    {
      number: '-1',
      description: 'Intending a less difficult or shorter fight',
    },
    { number: '-2', description: 'Using 2 or more solo adversaries' },
    { number: '-2', description: 'Add 1d4 (or a static +2) to all adversary damage rolls' },
    { number: '+1', description: 'Using an adversary from a lower tier' },
    {
      number: '+1',
      description: 'Not using Hordes, Leaders, Bruisers or Solos',
    },
    { number: '+2', description: 'Intending a more dangerous or longer fight' },
  ];
  const spendings = [
    { number: '1', description: 'Group of minions equal to party size' },
    { number: '1', description: 'Support' },
    { number: '2', description: 'Standard, Ranged, Skulk or Horde' },
    { number: '3', description: 'Leader' },
    { number: '4', description: 'Bruiser' },
    { number: '5', description: 'Solo' },
  ];
  return (
    <GameMasterCollapsible
      label='Battle Guide'
      defaultOpen
      className='break-inside-avoid'
    >
      <div className='space-y-2 px-2 pb-2'>
        <p className='text-sm'>
          <strong>Base battle points</strong> = (3 x the number of PCs in
          combat) + 2
        </p>
        <h3 className='font-bold'>Adjusting battle points</h3>
        <Table>
          {adjustments.map((adjustment, i) => (
            <TableRow key={i}>
              <TableCell>{adjustment.number}</TableCell>
              <TableCell>{adjustment.description}</TableCell>
            </TableRow>
          ))}
        </Table>
        <h3 className='font-bold'>Spending battle points</h3>
        <Table>
          {spendings.map((spending, i) => (
            <TableRow key={i}>
              <TableCell>{spending.number}</TableCell>
              <TableCell>{spending.description}</TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </GameMasterCollapsible>
  );
};

export const GameMasterMisc = () => {
  return (
    <>
      <GameMasterCollapsible
        label='Hope & Fear'
        className='break-inside-avoid'
        defaultOpen
      >
        <p>
          PCs gain a hope when rolled and can spend it on one of the following:
        </p>
        <ul className='ml-8 list-disc'>
          {[
            'Using an experience',
            'Help an ally',
            'Activate a class feature',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          On a roll with Fear, GM gains 1 and can spend it on one of the
          following:
        </p>
        <ul className='ml-8 list-disc'>
          {[
            'Interrupt the players to make a move',
            'Make an additional GM move',
            'Activate adversaries experience',
            'Use adversaries fear feature',
            'Use environments fear feature',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </GameMasterCollapsible>
      <GameMasterCollapsible
        label='Using Armor'
        className='break-inside-avoid'
        defaultOpen
      >
        <p className='px-2 pb-2'>
          If you are taking damage, you may mark an armor slot to reduce the
          severity by one tier. You can only mark one slot per incoming damage.
        </p>
      </GameMasterCollapsible>
      <GameMasterCollapsible
        label='Spotlighting Adversaries'
        className='break-inside-avoid'
        defaultOpen
      >
        <p>When you spotlight an adversary, you may do one of the following:</p>
        <ul className='ml-8 list-disc'>
          {[
            'Move within close range and attack',
            'Move within close range and use an adversary action',
            'End temporary condition or effect',
            'Sprint somewhere else on the battlefield',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </GameMasterCollapsible>
    </>
  );
};
