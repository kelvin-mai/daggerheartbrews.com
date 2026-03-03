import type { CardDetails } from '@/lib/types';

export const ancestries: CardDetails[] = [
  {
    type: 'ancestry',
    name: 'Clank',
    image: '/assets/images/srd/ancestry/clank.jpg',
    text: `
    <p><em>Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone.</em></p>
    <p><strong><em>Purposeful Design:</em></strong> Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.</p>
    <p><strong><em>Efficient:</em></strong> When you take a short rest, you can choose a long rest move instead of a short rest move.</p>
  `,
    artist: 'Mat Wilma',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Drakona',
    image: '/assets/images/srd/ancestry/drakona.jpg',
    text: `
    <p><em>Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath.</em></p>
    <p><strong><em>Scales:</em></strong> Your scales act as natural protection. When you would take Severe damage, you can mark a Stress to mark 1 fewer Hit Points.</p>
    <p><strong><em>Elemental Breath:</em></strong> Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals d8 magic damage using your Proficiency.</p>
  `,
    artist: 'Mat Wilma',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Dwarf',
    image: '/assets/images/srd/ancestry/dwarf.jpg',
    text: `
    <p><em>Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair.</em></p>
    <p><strong><em>Thick Skin:</em></strong> When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.</p>
    <p><strong><em>Increased Fortitude:</em></strong> Spend 3 Hope to halve incoming physical damage.</p>
  `,
    artist: 'Mat Wilma',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Elf',
    image: '/assets/images/srd/ancestry/elf.jpg',
    text: `
    <p><em>Elves are typically tall humanoids with pointed ears and acutely attuned senses.</em></p>
    <p><strong><em>Quick Reactions:</em></strong> Mark a Stress to gain advantage on a reaction roll.</p>
    <p><strong><em>Celestial Trance:</em></strong> During a rest, you can drop into a trance to choose an additional downtime move.</p>
  `,
    artist: 'Mat Wilma',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Faerie',
    image: '/assets/images/srd/ancestry/faerie.jpg',
    text: `
    <p><em>Faeries are winged humanoid creatures with insectile features.</em></p>
    <p><strong><em>Luckbender:</em></strong> Once per session, after you or a willing ally within Close range makes an action roll, you can spend 3 Hope to reroll the Duality Dice.</p>
    <p><strong><em>Wings:</em></strong> You can fly. While flying, you can mark a Stress after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.</p>
  `,
    artist: 'Anthony Jones',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Faun',
    image: '/assets/images/srd/ancestry/faun.jpg',
    text: `
    <p><em>Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves.</em></p>
    <p><strong><em>Caprine Leap:</em></strong> You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.</p>
    <p><strong><em>Kick:</em></strong> When you succeed on an attack against a target within Melee range, you can mark a Stress to kick yourself off them, dealing an extra 2d6 damage and knocking back either yourself or the target to Very Close range.</p>
  `,
    artist: 'Jessketchin',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Firbolg',
    image: '/assets/images/srd/ancestry/firbolg.jpg',
    text: `
    <p><em>Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears.</em></p>
    <p><strong><em>Charge:</em></strong> When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can mark a Stress to deal 1d12 physical damage to all targets within Melee range.</p>
    <p><strong><em>Unshakable:</em></strong> When you would mark a Stress, roll a d6. On a result of 6, don't mark it.</p>
  `,
    artist: 'Anthony Jones',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Fungril',
    image: '/assets/images/srd/ancestry/fungril.jpg',
    text: `
    <p><em>Fungril resemble humanoid mushrooms.</em></p>
    <p><strong><em>Fungril Network:</em></strong> Make an Instinct Roll (12) to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.</p>
    <p><strong><em>Death Connection:</em></strong> While touching a corpse that died recently, you can mark a Stress to extract one memory from the corpse related to a specific emotion or sensation of your choice.</p>
  `,
    artist: 'Anthony Jones',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Galapa',
    image: '/assets/images/srd/ancestry/galapa.jpg',
    text: `
    <p><em>Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract.</em></p>
    <p><strong><em>Shell:</em></strong> Gain a bonus to your damage thresholds equal to your Proficiency.</p>
    <p><strong><em>Retract:</em></strong> Mark a Stress to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can't move.</p>
  `,
    artist: 'Jessketchin',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Giant',
    image: '/assets/images/srd/ancestry/giant.jpg',
    text: `
    <p><em>Giants are towering humanoids with broad shoulders, long arms, and one to three eyes.</em></p>
    <p><strong><em>Endurance:</em></strong> Gain an additional Hit Point slot at character creation.</p>
    <p><strong><em>Reach:</em></strong> Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.</p>
  `,
    artist: 'Juan Salvador Almencio',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Goblin',
    image: '/assets/images/srd/ancestry/goblin.jpg',
    text: `
    <p><em>Goblins are small humanoids easily recognizable by their large eyes and massive membranous ears.</em></p>
    <p><strong><em>Surefooted:</em></strong> You ignore disadvantage on Agility Rolls.</p>
    <p><strong><em>Danger Sense:</em></strong> Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.</p>
  `,
    artist: 'Anthony Jones',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Halfling',
    image: '/assets/images/srd/ancestry/halfling.jpg',
    text: `
    <p><em>Halflings are small humanoids with large hairy feet and prominent rounded ears.</em></p>
    <p><strong><em>Luckbringer:</em></strong> At the start of each session, everyone in your party gains a Hope.</p>
    <p><strong><em>Internal Compass:</em></strong> When you roll a 1 on your Hope Die, you can reroll it.</p>
  `,
    artist: 'Anthony Jones',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Human',
    image: '/assets/images/srd/ancestry/human.jpg',
    text: `
    <p><em>Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance.</em></p>
    <p><strong><em>High Stamina:</em></strong> Gain an additional Stress slot at character creation.</p>
    <p><strong><em>Adaptability:</em></strong> When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.</p>
  `,
    artist: 'Fernanda Suarez',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Infernis',
    image: '/assets/images/srd/ancestry/infernis.jpg',
    text: `
    <p><em>Infernis are humanoids who possess sharp canine teeth, pointed ears, and horns.</em></p>
    <p><strong><em>Fearless:</em></strong> When you roll with Fear, you can mark 2 Stress to change it into a roll with Hope instead.</p>
    <p><strong><em>Dread Visage:</em></strong> You have advantage on rolls to intimidate hostile creatures.</p>
  `,
    artist: 'Fernanda Suarez',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Katari',
    image: '/assets/images/srd/ancestry/katari.jpg',
    text: `
    <p><em>Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears.</em></p>
    <p><strong><em>Feline Instincts:</em></strong> When you make an Agility Roll, you can spend 2 Hope to reroll your Hope Die.</p>
    <p><strong><em>Retracting Claws:</em></strong> Make an Agility Roll to scratch a target within Melee range. On a success, they become temporarily Vulnerable.</p>
  `,
    artist: 'Hendry Iwanaga',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Orc',
    image: '/assets/images/srd/ancestry/orc.jpg',
    text: `
    <p><em>Orcs are humanoids most easily recognized by their square features and boar-like tusks that protrude from their lower jaw.</em></p>
    <p><strong><em>Sturdy:</em></strong> When you have 1 Hit Point remaining, attacks against you have disadvantage.</p>
    <p><strong><em>Tusks:</em></strong> When you succeed on an attack against a target within Melee range, you can spend a Hope to gore the target with your tusks, dealing an extra 1d6 damage.</p>
  `,
    artist: 'Simon Pape',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Ribbet',
    image: '/assets/images/srd/ancestry/ribbet.jpg',
    text: `
    <p><em>Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet.</em></p>
    <p><strong><em>Amphibious:</em></strong> You can breathe and move naturally underwater.</p>
    <p><strong><em>Long Tongue:</em></strong> You can use your long tongue to grab onto things within Close range. Mark a Stress to use your tongue as a Finesse Close weapon that deals d12 physical damage using your Proficiency.</p>
  `,
    artist: 'Leesha Hannigan',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
  {
    type: 'ancestry',
    name: 'Simiah',
    image: '/assets/images/srd/ancestry/simiah.jpg',
    text: `
    <p><em>Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet.</em></p>
    <p><strong><em>Natural Climber:</em></strong> You have advantage on Agility Rolls that involve balancing and climbing.</p>
    <p><strong><em>Nimble:</em></strong> Gain a permanent +1 bonus to your Evasion at character creation.</p>
  `,
    artist: 'Jessketchin',
    credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
  },
];
