import type { SubclassReference } from '../types';

export const subclasses: SubclassReference[] = [
  // Bard
  {
    className: 'bard',
    name: 'Troubadour',
    description:
      'Play the Troubadour if you want to play music to bolster your allies.',
    image: 'bard-troubadour.jpg',
    artist: 'Bear Frymire',
    trait: 'presence',
    foundation: [
      {
        name: 'Gifted Performer',
        description:
          'You can play three different types of songs, once each per long rest; describe how you perform for others to gain the listed benefit:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li><strong><em>Relaxing Song: </em></strong>You and all allies within Close range clear a Hit Point.</li>
        <li><strong><em>Epic Song: </em></strong>Make a target within Close range temporarily Vulnerable.</li>
        <li><strong><em>Heartbreaking Song: </em></strong>You and all allies within Close range gain a Hope.</li>
        </ul>
        `,
      },
    ],
    specialization: [
      {
        name: 'Maestro',
        description:
          'Your rallying songs steel the courage of those who listen. When you give a Rally Die to an ally, they can gain a Hope or clear a Stress.',
      },
    ],
    mastery: [
      {
        name: 'Virtuoso',
        description:
          'You are among the greatest of your craft and your skill is boundless. You can perform each of your "Gifted Performer" feature\'s songs twice per long rest.',
      },
    ],
  },
  {
    className: 'bard',
    name: 'Wordsmith',
    description:
      'Play the Wordsmith if you want to use clever wordplay and captivate crowds.',
    image: 'bard-wordsmith.jpg',
    artist: 'Nikki Dawes',
    trait: 'presence',
    foundation: [
      {
        name: 'Rousing Speech',
        description:
          'Once per long rest, you can give a heartfelt, inspiring speech. All allies within Far range clear 2 Stress.',
      },
      {
        name: 'Heart of a Poet',
        description:
          'After you make an action roll to impress, persuade, or offend someone, you can spend a Hope to add a d4 to the roll.',
      },
    ],
    specialization: [
      {
        name: 'Eloquent',
        description:
          'Your moving words boost morale. Once per session, when you encourage an ally, you can do one of the following:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>Allow them to find a mundane object or tool they need.</li>
        <li>Help an Ally without spending Hope.</li>
        <li>Give them an additional downtime move during their next rest.</li>
        </ul>
        `,
      },
    ],
    mastery: [
      {
        name: 'Epic Poetry',
        description:
          'Your Rally Die increases to a d10. Additionally, when you Help an Ally, you can narrate the moment as if you were writing the tale of their heroism in a memoir. When you do, roll a d10 as your advantage die.',
      },
    ],
  },
  // Druid
  {
    className: 'druid',
    name: 'Warden of the Elements',
    description:
      'Play the Warden of the Elements if you want to embody the natural elements of the wild.',
    image: 'druid-warden-of-the-elements.jpg',
    artist: 'Zoe Badini',
    trait: 'instinct',
    foundation: [
      {
        name: 'Elemental Incarnation',
        description:
          'Mark a Stress to Channel one of the following elements until you take Severe damage or until your next rest:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li><strong><em>Fire: </em></strong>When an adversary within Melee range deals damage to you, they take 1d10 magic damage.</li>
        <li><strong><em>Earth: </em></strong>Gain a bonus to your damage thresholds equal to your Proficiency.</li>
        <li><strong><em>Water: </em></strong>When you deal damage to an adversary within Melee range, all other adversaries within Very Close range must mark a Stress.</li>
        <li><strong><em>Air: </em></strong>You can hover, gaining advantage on Agility Rolls.</li>
        </ul>
        `,
      },
    ],
    specialization: [
      {
        name: 'Elemental Aura',
        description:
          'Once per rest while Channeling, you can assume an aura matching your element. The aura affects targets within Close range until your Channeling ends.',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li><strong><em>Fire: </em></strong>When an adversary marks 1 or more Hit Points, they must also mark a Stress.</li>
        <li><strong><em>Earth: </em></strong>Your allies gain a +1 bonus to Strength.</li>
        <li><strong><em>Water: </em></strong>When an adversary deals damage to you, you can mark a Stress to move them anywhere within Very Close range of where they are.</li>
        <li><strong><em>Air: </em></strong>When you or an ally takes damage from an attack beyond Melee range, reduce the damage by 1d8.</li>
        </ul>
        `,
      },
    ],
    mastery: [
      {
        name: 'Elemental Dominion',
        description:
          'You further embody your element. While Channeling, you gain the following benefit:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li><strong><em>Fire: </em></strong>You gain a +1 bonus to your Proficiency for attacks and spells that deal damage.</li>
        <li><strong><em>Earth: </em></strong>When you would mark Hit Points, roll a d6 per Hit Point marked. For each result of 6, reduce the number of Hit Points you mark by 1.</li>
        <li><strong><em>Water: </em></strong>When an attack against you succeeds, you can mark a Stress to make the attacker temporarily Vulnerable.</li>
        <li><strong><em>Air: </em></strong>You gain a +1 bonus to your Evasion and can fly.</li>
        </ul>
        `,
      },
    ],
  },
  {
    className: 'druid',
    name: 'Warden of Renewal',
    description:
      'Play the Warden of Renewal if you want to use powerful magic to heal your party.',
    image: 'druid-warden-of-renewal.jpg',
    artist: 'Ilya Royz',
    trait: 'instinct',
    foundation: [
      {
        name: 'Clarity of Nature',
        description:
          'Once per long rest, you can create a space of natural serenity within Close range. When you spend a few minutes resting within the space, clear Stress equal to your Instinct, distributed as you choose between you and your allies.',
      },
      {
        name: 'Regeneration',
        description:
          'Touch a creature and spend 3 Hope. That creature clears 1d4 Hit Points.',
      },
    ],
    specialization: [
      {
        name: 'Regenerative Reach',
        description:
          'You can target creatures within Very Close range with your "Regeneration" feature.',
      },
      {
        name: "Warden's Protection",
        description:
          'Once per long rest, spend 2 Hope to clear 2 Hit Points on 1d4 allies within Close range.',
      },
    ],
    mastery: [
      {
        name: 'Defender',
        description:
          "Your animal transformation embodies a healing guardian spirit. When you're in Beastform and an ally within Close range marks 2 or more Hit Points, you can mark a Stress to reduce the number of Hit Points they mark by 1.",
      },
    ],
  },
  // Guardian
  {
    className: 'guardian',
    name: 'Stalwart',
    description:
      'Play the Stalwart if you want to take heavy blows and keep fighting.',
    image: 'guardian-stalwart.jpg',
    artist: 'Reiko Murakami',
    foundation: [
      {
        name: 'Unwavering',
        description: 'Gain a permanent +1 bonus to your damage thresholds.',
      },
      {
        name: 'Iron Will',
        description:
          'When you take physical damage, you can mark an additional Armor Slot to reduce the severity.',
      },
    ],
    specialization: [
      {
        name: 'Unrelenting',
        description: 'Gain a permanent +2 bonus to your damage thresholds.',
      },
      {
        name: 'Partners-in-Arms',
        description:
          'When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.',
      },
    ],
    mastery: [
      {
        name: 'Undaunted',
        description: 'Gain a permanent +3 bonus to your damage thresholds.',
      },
      {
        name: 'Loyal Protector',
        description:
          'When an ally within Close range has 2 or fewer Hit Points and would take damage, you can mark a Stress to sprint to their side and take the damage instead.',
      },
    ],
  },
  {
    className: 'guardian',
    name: 'Vengeance',
    description:
      'Play the Vengeance if you want to strike down enemies who harm you or your allies.',
    image: 'guardian-vengeance.jpg',
    artist: 'Linda Lithén',
    foundation: [
      {
        name: 'At Ease',
        description: 'Gain an additional Stress slot.',
      },
      {
        name: 'Revenge',
        description:
          'When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point.',
      },
    ],
    specialization: [
      {
        name: 'Act of Reprisal',
        description:
          'When an adversary damages an ally within Melee range, you gain a +1 bonus to your Proficiency for the next successful attack you make against that adversary.',
      },
    ],
    mastery: [
      {
        name: 'Nemesis',
        description:
          'Spend 2 Hope to Prioritize an adversary until your next rest. When you make an attack against your Prioritized adversary, you can swap the results of your Hope and Fear Dice. You can only Prioritize one adversary at a time.',
      },
    ],
  },
  // Ranger
  {
    className: 'ranger',
    name: 'Beastbound',
    description:
      'Play the Beastbound if you want to form a deep bond with an animal ally.',
    image: 'ranger-beastbound.jpg',
    artist: 'Jenny Tan',
    trait: 'agility',
    foundation: [
      {
        name: 'Companion',
        description:
          "You have an animal companion of your choice (at the GM's discretion). They stay by your side unless you tell them otherwise. Take the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.",
      },
    ],
    specialization: [
      {
        name: 'Expert Training',
        description: 'Choose an additional level-up option for your companion.',
      },
      {
        name: 'Battle-Bonded',
        description:
          "When an adversary attacks you while they're within your companion's Melee range, you gain a +2 bonus to your Evasion against the attack.",
      },
    ],
    mastery: [
      {
        name: 'Advanced Training',
        description:
          'Choose two additional level-up options for your companion.',
      },
      {
        name: 'Loyal Friend',
        description:
          "Once per long rest, when the damage from an attack would mark your companion's last Stress or your last Hit Point and you're within Close range of each other, you or your companion can rush to the other's side and take that damage instead.",
      },
    ],
  },
  {
    className: 'ranger',
    name: 'Wayfinder',
    description:
      'Play the Wayfinder if you want to hunt your prey and strike with deadly force.',
    image: 'ranger-wayfinder.jpg',
    artist: 'Simon Pape',
    trait: 'agility',
    foundation: [
      {
        name: 'Ruthless Predator',
        description:
          'When you make a damage roll, you can mark a Stress to gain a +1 bonus to your Proficiency. Additionally, when you deal Severe damage to an adversary, they must mark a Stress.',
      },
      {
        name: 'Path Forward',
        description:
          "When you're traveling to a place you've previously visited or you carry an object that has been at the location before, you can identify the shortest, most direct path to your destination.",
      },
    ],
    specialization: [
      {
        name: 'Elusive Predator',
        description:
          'When your Focus makes an attack against you, you gain a +2 bonus to your Evasion against the attack.',
      },
    ],
    mastery: [
      {
        name: 'Apex Predator',
        description:
          "Before you make an attack roll against your Focus, you can spend a Hope. On a successful attack, you remove a Fear from the GM's Fear pool.",
      },
    ],
  },
  // Rogue
  {
    className: 'rogue',
    name: 'Nightwalker',
    description:
      'Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.',
    image: 'rogue-nightwalker.jpg',
    artist: 'Juan Salvador Almencion',
    trait: 'finesse',
    foundation: [
      {
        name: 'Shadow Stepper',
        description:
          'You can move from shadow to shadow. When you move into an area of darkness or a shadow cast by another creature or object, you can mark a Stress to disappear from where you are and reappear inside another shadow within Far range. When you reappear, you are Cloaked.',
      },
    ],
    specialization: [
      {
        name: 'Dark Cloud',
        description:
          "Make a Spellcast Roll (15). On a success, create a temporary dark cloud that covers any area within Close range. Anyone in this cloud can't see outside of it, and anyone outside of it can't see in. You're considered Cloaked from any adversary for whom the cloud blocks line of sight.",
      },
      {
        name: 'Adrenaline',
        description:
          "While you're Vulnerable, add your level to your damage rolls.",
      },
    ],
    mastery: [
      {
        name: 'Fleeting Shadow',
        description:
          'Gain a permanent +1 bonus to your Evasion. You can use your "Shadow Stepper" feature to move within Very Far range.',
      },
      {
        name: 'Vanishing Act',
        description:
          'Mark a Stress to become Cloaked at any time. When Cloaked from this feature, you automatically clear the Restrained condition if you have it. You remain Cloaked in this way until you roll with Fear or until your next rest.',
      },
    ],
  },
  {
    className: 'rogue',
    name: 'Syndicate',
    description:
      'Play the Syndicate if you want to have a web of contacts everywhere you go.',
    image: 'rogue-syndicate.jpg',
    artist: 'Jenny Tan',
    trait: 'finesse',
    foundation: [
      {
        name: 'Well-Connected',
        description:
          'When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from the following list:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>They owe me a favor, but they'll be hard to find.</li>
        <li>They're going to ask for something in exchange.</li>
        <li>They're always in a great deal of trouble.</li>
        <li>We used to be together. It's a long story.</li>
        <li>We didn't part on great terms.</li>
        </ul>
        `,
      },
    ],
    specialization: [
      {
        name: 'Contacts Everywhere',
        description:
          'Once per session, you can briefly call on a shady contact. Choose one of the following benefits and describe what brought them here to help you in this moment:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>They provide 1 handful of gold, a unique tool, or a mundane object that the situation requires.</li>
        <li>On your next action roll, their help provides a +3 bonus to the result of your Hope or Fear Die.</li>
        <li>The next time you deal damage, they snipe from the shadows, adding 2d8 to your damage roll.</li>
        </ul>
        `,
      },
    ],
    mastery: [
      {
        name: 'Reliable Backup',
        description:
          'You can use your "Contacts Everywhere" feature three times per session. The following options are added to the list of benefits you can choose from when you use that feature:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>When you mark 1 or more Hit Points, they can rush out to shield you, reducing the Hit Points marked by 1.</li>
        <li>When you make a Presence Roll in conversation, they back you up. You can roll a d20 as your Hope Die.</li>
        </ul>
        `,
      },
    ],
  },
  // Seraph
  {
    className: 'seraph',
    name: 'Divine Wielder',
    description:
      'Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.',
    image: 'seraph-divine-wielder.jpg',
    artist: 'Jenny Tan',
    trait: 'strength',
    foundation: [
      {
        name: 'Spirit Weapon',
        description:
          'When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you. You can mark a Stress to target an additional adversary within range with the same attack roll.',
      },
      {
        name: 'Sparing Touch',
        description:
          'Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.',
      },
    ],
    specialization: [
      {
        name: 'Devout',
        description:
          'When you roll your Prayer Dice, you can roll an additional die and discard the lowest result. Additionally, you can use your "Sparing Touch" feature twice instead of once per long rest.',
      },
    ],
    mastery: [
      {
        name: 'Sacred Resonance',
        description:
          'When you roll damage for your "Spirit Weapon" feature, if any of the die results match, double the value of each matching die. For example, if you roll two 5s, they count as two 10s.',
      },
    ],
  },
  {
    className: 'seraph',
    name: 'Winged Sentinel',
    description:
      'Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.',
    image: 'seraph-winged-sentinel.jpg',
    artist: 'Stephanie Cost',
    trait: 'strength',
    foundation: [
      {
        name: 'Wings of Light',
        description: 'You can fly. While flying, you can do the following:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>Mark a Stress to pick up and carry another willing creature approximately your size or smaller.</li>
        <li>Spend a Hope to deal an extra 1d8 damage on a successful attack.</li>
        </ul>
        `,
      },
    ],
    specialization: [
      {
        name: 'Ethereal Visage',
        description:
          "Your supernatural visage strikes awe and fear. While flying, you have advantage on Presence Rolls. When you succeed with Hope on a Presence Roll, you can remove a Fear from the GM's Fear pool instead of gaining Hope.",
      },
    ],
    mastery: [
      {
        name: 'Ascendant',
        description:
          'Gain a permanent +4 bonus to your Severe damage threshold.',
      },
      {
        name: 'Power of the Gods',
        description:
          'While flying, you deal an extra 1d12 damage instead of 1d8 from your "Wings of Light" feature.',
      },
    ],
  },
  // Sorcerer
  {
    className: 'sorcerer',
    name: 'Elemental Origin',
    description:
      'Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.',
    image: 'sorcerer-elemental-origin.jpg',
    artist: 'Bear Frymire',
    trait: 'instinct',
    foundation: [
      {
        name: 'Elementalist',
        description:
          "Choose one of the following elements at character creation: air, earth, fire, lightning, water. You can shape this element into harmless effects. Additionally, spend a Hope and describe how your control over this element helps an action roll you're about to make, then either gain a +2 bonus to the roll or a +3 bonus to the roll's damage.",
      },
    ],
    specialization: [
      {
        name: 'Natural Evasion',
        description:
          'You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can mark a Stress and describe how you use your element to defend you. When you do, roll a d6 and add its result to your Evasion against the attack.',
      },
    ],
    mastery: [
      {
        name: 'Transcendence',
        description:
          'Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two of the following benefits to gain until your next rest:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>+4 bonus to your Severe threshold</li>
        <li>+1 bonus to a character trait of your choice</li>
        <li>+1 bonus to your Proficiency</li>
        <li>+2 bonus to your Evasion</li>
        </ul>
        `,
      },
    ],
  },
  {
    className: 'sorcerer',
    name: 'Primal Origin',
    description:
      'Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.',
    image: 'sorcerer-primal-origin.jpg',
    artist: 'Laura Galli',
    trait: 'instinct',
    foundation: [
      {
        name: 'Manipulate Magic',
        description:
          'Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can mark a Stress to do one of the following:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>Extend the spell or attack's reach by one range</li>
        <li>Gain a +2 bonus to the action roll's result</li>
        <li>Double a damage die of your choice</li>
        <li>Hit an additional target within range</li>
        </ul>
        `,
      },
    ],
    specialization: [
      {
        name: 'Enchanted Aid',
        description:
          'You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a d8 as your advantage die. Once per long rest, after an ally has made a Spellcast Roll with your help, you can swap the results of their Duality Dice.',
      },
    ],
    mastery: [
      {
        name: 'Arcane Charge',
        description:
          'You can gather magical energy to enhance your capabilities. When you take magic damage, you become Charged. Alternatively, you can spend 2 Hope to become Charged. When you successfully make an attack that deals magic damage while Charged, you can clear your Charge to either gain a +10 bonus to the damage roll or gain a +3 bonus to the Difficulty of a reaction roll the spell causes the target to make. You stop being Charged at your next long rest.',
      },
    ],
  },
  // Warrior
  {
    className: 'warrior',
    name: 'Call of the Brave',
    description:
      'Play the Call of the Brave if you want to use the might of your enemies to fuel your own power.',
    image: 'warrior-call-of-the-brave.jpg',
    artist: 'Mat Wilma',
    foundation: [
      {
        name: 'Courage',
        description: 'When you fail a roll with Fear, you gain a Hope.',
      },
      {
        name: 'Battle Ritual',
        description:
          'Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.',
      },
    ],
    specialization: [
      {
        name: 'Rise to the Challenge',
        description:
          'You are vigilant in the face of mounting danger. While you have 2 or fewer Hit Points unmarked, you can roll a d20 as your Hope Die.',
      },
    ],
    mastery: [
      {
        name: 'Camaraderie',
        description:
          'Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll one additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope to do so.',
      },
    ],
  },
  {
    className: 'warrior',
    name: 'Call of the Slayer',
    description:
      'Play the Call of the Slayer if you want to strike down adversaries with immense force.',
    image: 'warrior-call-of-the-slayer.jpg',
    artist: 'Reiko Murakami',
    foundation: [
      {
        name: 'Slayer',
        description:
          'You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.',
      },
    ],
    specialization: [
      {
        name: 'Weapon Specialist',
        description:
          'You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll. Additionally, once per long rest when you roll your Slayer Dice, reroll any 1s.',
      },
    ],
    mastery: [
      {
        name: 'Martial Preparation',
        description:
          "You're an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move. To use this move during a rest, describe how you instruct and train with your party. You and each ally who chooses this downtime move gain a d6 Slayer Die. A PC with a Slayer Die can spend it to roll the die and add the result to an attack or damage roll of their choice.",
      },
    ],
  },
  // Wizard
  {
    className: 'wizard',
    name: 'School of Knowledge',
    description:
      'Play the School of Knowledge if you want a keen understanding of the world around you.',
    image: 'wizard-school-of-knowledge.jpg',
    artist: 'Bear Frymire',
    trait: 'knowledge',
    foundation: [
      {
        name: 'Prepared',
        description:
          'Take an additional domain card of your level or lower from a domain you have access to.',
      },
      {
        name: 'Adept',
        description:
          'When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.',
      },
    ],
    specialization: [
      {
        name: 'Accomplished',
        description:
          'Take an additional domain card of your level or lower from a domain you have access to.',
      },
      {
        name: 'Perfect Recall',
        description:
          'Once per rest, when you recall a domain card in your vault, you can reduce its Recall Cost by 1.',
      },
    ],
    mastery: [
      {
        name: 'Brilliant',
        description:
          'Take an additional domain card of your level or lower from a domain you have access to.',
      },
      {
        name: 'Honed Expertise',
        description:
          'When you use an Experience, roll a d6. On a result of 5 or higher, you can use it without spending Hope.',
      },
    ],
  },
  {
    className: 'wizard',
    name: 'School of War',
    description:
      'Play the School of War if you want to utilize trained magic for violence.',
    image: 'wizard-school-of-war.jpg',
    artist: 'Nikki Dawes',
    trait: 'knowledge',
    foundation: [
      {
        name: 'Battlemage',
        description:
          "You've focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.",
      },
      {
        name: 'Face Your Fear',
        description:
          'When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.',
      },
    ],
    specialization: [
      {
        name: 'Conjure Shield',
        description:
          'You can maintain a protective barrier of magic. While you have at least 2 Hope, you add your Proficiency to your Evasion.',
      },
      {
        name: 'Fueled by Fear',
        description:
          'The extra magic damage from your "Face Your Fear" feature increases to 2d10.',
      },
    ],
    mastery: [
      {
        name: 'Thrive in Chaos',
        description:
          'When you succeed on an attack, you can mark a Stress after rolling damage to force the target to mark an additional Hit Point.',
      },
      {
        name: 'Have No Fear',
        description:
          'The extra magic damage from your "Face Your Fear" feature increases to 3d10.',
      },
    ],
  },
];
