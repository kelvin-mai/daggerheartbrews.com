'use client';

import { CustomSelect } from '@/components/common';
import { FormInput, FormContainer } from '@/components/common/form';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdversaryActions, useAdversaryStore } from '@/store';

export const AdversaryStatsForm = () => {
  const {
    adversary: {
      subtype,
      hp,
      stress,
      thresholds,
      experience,
      weapon,
      attack,
      distance,
      damageAmount,
      damageType,
    },
  } = useAdversaryStore();
  const { setAdversaryDetails } = useAdversaryActions();
  return (
    <FormContainer title='Adversary Statistics' collapsible defaultOpen>
      <div className='space-y-2'>
        <Label htmlFor='subtype'>Role</Label>
        <CustomSelect
          id='subtype'
          placeholder='Role'
          options={[
            {
              category: 'Roles',
              options: [
                'bruiser',
                'horde',
                'leader',
                'minion',
                'ranged',
                'skulk',
                'social',
                'solo',
                'standard',
                'support',
              ],
            },
          ]}
          value={subtype ?? ''}
          onChange={(v) => setAdversaryDetails({ subtype: v })}
        />
      </div>
      <CollapsibleContent className='space-y-2 pt-2'>
        <div className='flex gap-2'>
          <FormInput
            id='hp'
            label='Hit Points'
            className='grow'
            value={hp ?? ''}
            min={0}
            max={99}
            onChange={(e) =>
              setAdversaryDetails({ hp: Number(e.target.value) })
            }
          />
          <FormInput
            id='stress'
            className='grow'
            value={stress ?? ''}
            min={0}
            max={99}
            onChange={(e) =>
              setAdversaryDetails({ stress: Number(e.target.value) })
            }
          />
        </div>
        {thresholds && thresholds.length > 1 ? (
          <div className='space-y-2'>
            <Label>Thresholds</Label>
            <div className='flex gap-2'>
              <Input
                value={thresholds?.[0] ?? ''}
                type='number'
                placeholder='Major'
                min={0}
                max={99}
                onChange={(e) =>
                  setAdversaryDetails({
                    thresholds: [Number(e.target.value), thresholds?.[1] ?? 0],
                  })
                }
              />
              <Input
                value={thresholds?.[1] ?? ''}
                type='number'
                placeholder='Severe'
                min={0}
                max={99}
                onChange={(e) =>
                  setAdversaryDetails({
                    thresholds: [thresholds?.[0] ?? 0, Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>
        ) : null}
        <FormInput
          id='experience'
          placeholder='Something Cool +2'
          value={experience ?? ''}
          onChange={(e) => setAdversaryDetails({ experience: e.target.value })}
        />
        <div className='grid grid-cols-2 gap-2'>
          <FormInput
            id='weapon-name'
            label='Weapon Name'
            placeholder='Warhammer'
            type='text'
            value={weapon ?? ''}
            onChange={(e) => setAdversaryDetails({ weapon: e.target.value })}
          />
          <FormInput
            id='attack-bonus'
            label='Attack Bonus'
            placeholder='+2'
            type='text'
            value={attack ?? ''}
            onChange={(e) => setAdversaryDetails({ attack: e.target.value })}
          />
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <div className='space-y-2'>
            <Label htmlFor='weapon-distance'>Distance</Label>
            <CustomSelect
              id='weapon-distance'
              placeholder='Distance'
              options={[
                {
                  category: 'Distance',
                  options: [
                    'melee',
                    'very close',
                    'close',
                    'far',
                    'very far',
                    'out of range',
                  ],
                },
              ]}
              value={distance ?? ''}
              onChange={(v) => setAdversaryDetails({ distance: v })}
            />
          </div>
          <FormInput
            id='damage-amount'
            label='Damage Amount'
            placeholder='2d12 + 3'
            value={damageAmount ?? ''}
            onChange={(e) =>
              setAdversaryDetails({ damageAmount: e.target.value })
            }
          />
          <div className='space-y-2'>
            <Label htmlFor='damage-type'>Damage Type</Label>
            <CustomSelect
              id='damage-type'
              placeholder='Damage Type'
              options={[
                {
                  category: 'Damage Type',
                  options: ['physical', 'magical', 'tech'],
                },
              ]}
              value={damageType ?? ''}
              onChange={(v) => setAdversaryDetails({ damageType: v })}
            />
          </div>
        </div>
      </CollapsibleContent>
    </FormContainer>
  );
};
