'use client';

import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { Check } from 'lucide-react';

import { FormContainer, FormInput } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { useCardActions, useCardStore } from '@/store';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { traitTypes } from '@/lib/types';
import { CustomSelect } from '@/components/common';
import {
  RichTextEditor,
  useRichTextEditor,
} from '@/components/common/rich-text-editor';
import { capitalize } from '@/lib/utils';

type AssistedRulesTextProps = {
  editor: Editor;
};

const AssistedRulesText: React.FC<AssistedRulesTextProps> = ({ editor }) => {
  const initialWeaponText = {
    trait: 'strength',
    distance: 'melee',
    amount: 'd12',
    type: 'physical',
  };
  const [sectionType, setSectionType] = React.useState('');
  const [text, setText] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [weaponText, setWeaponText] = React.useState(initialWeaponText);

  const getSection = () => {
    switch (sectionType) {
      case 'flavor':
        return `<em>${text}</em>`;
      case 'feature':
        return `<strong><em>${text}:</em></strong> ${description}`;
      case 'spellcast':
        return `<p style='text-align: center'><strong>SPELLCAST:</strong> ${text.toUpperCase()}</p>`;
      case 'weapon':
        return `<p style='text-align: center'><strong>${capitalize(weaponText.trait)} ${capitalize(weaponText.distance)}</strong> - ${weaponText.amount} (${capitalize(weaponText.type)})</p>`;
      default:
        return '';
    }
  };

  const handleSelectType = (v: string) => {
    setSectionType(v);
    setText('');
    setDescription('');
    setWeaponText(initialWeaponText);
  };

  const handleClick = () => {
    if (editor) {
      const section = getSection();
      editor
        .chain()
        .focus()
        .insertContent('<p></p>')
        .insertContent(section)
        .run();
      setText('');
      setDescription('');
      setWeaponText(initialWeaponText);
    }
  };

  return (
    <>
      <div className='flex gap-2'>
        <Select value={sectionType} onValueChange={handleSelectType}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Rules Text Section Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rules Text Section</SelectLabel>
              <SelectItem value='spellcast'>Spellcast Trait</SelectItem>
              <SelectItem value='flavor'>Flavor Text</SelectItem>
              <SelectItem value='feature'>Feature Text</SelectItem>
              <SelectItem value='weapon'>Weapon Text</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant='ghost' onClick={handleClick}>
          Add Section
        </Button>
      </div>
      {sectionType === 'spellcast' && (
        <div className='space-y-2'>
          <Label htmlFor='spellcast-trait'>Spellcast Trait</Label>
          <Select value={text} onValueChange={setText}>
            <SelectTrigger className='w-full capitalize'>
              <SelectValue id='spellcast-trait' placeholder='Spellcast Trait' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trait</SelectLabel>
                {traitTypes.map((t) => (
                  <SelectItem key={t} value={t} className='capitalize'>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      {sectionType === 'flavor' && (
        <div className='space-y-2'>
          <Label htmlFor='flavor-text'>Flavor Text</Label>
          <Textarea
            id='flavor-text'
            placeholder='Flavor text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}
      {sectionType === 'feature' && (
        <>
          <FormInput
            id='feature-title'
            label='Feature Name'
            placeholder='Feature Name'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className='space-y-2'>
            <Label htmlFor='feature-description'>Feature Description</Label>
            <Textarea
              id='feature-description'
              placeholder='Feature Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </>
      )}
      {sectionType === 'weapon' && (
        <div className='space-y-2'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='weapon-trait'>Weapon Trait</Label>
              <Select
                value={weaponText.trait}
                onValueChange={(v) =>
                  setWeaponText({ ...weaponText, trait: v })
                }
              >
                <SelectTrigger className='w-full capitalize'>
                  <SelectValue id='weapon-trait' placeholder='Weapon Trait' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trait</SelectLabel>
                    {traitTypes.map((t) => (
                      <SelectItem key={t} value={t} className='capitalize'>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
                value={weaponText.distance}
                onChange={(v) => setWeaponText({ ...weaponText, distance: v })}
              />
            </div>
            <FormInput
              id='damage-amount'
              label='Damage Amount'
              value={weaponText.amount}
              onChange={(e) =>
                setWeaponText({ ...weaponText, amount: e.target.value })
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
                value={weaponText.type}
                onChange={(v) => setWeaponText({ ...weaponText, type: v })}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const RulesForm = () => {
  const {
    card: { text, thresholds, thresholdsEnabled },
  } = useCardStore();
  const { setCardDetails } = useCardActions();

  const editor = useRichTextEditor({
    defaultValue: text,
    onChange: (v) => setCardDetails({ text: v }),
  });

  return (
    <FormContainer title='Rules Text' collapsible defaultOpen>
      <div className='border-t px-4 py-3'>
        {editor && <RichTextEditor editor={editor} />}
        <CollapsibleContent className='mt-2'>
          {thresholds ? (
            <div className='space-y-2'>
              <Label>Thresholds</Label>
              <div className='flex gap-2'>
                <Input
                  value={thresholds[0]}
                  type='number'
                  min={0}
                  max={99}
                  onChange={(e) =>
                    setCardDetails({
                      thresholds: [Number(e.target.value), thresholds[1]],
                    })
                  }
                />
                <Input
                  value={thresholds[1]}
                  type='number'
                  min={0}
                  max={99}
                  onChange={(e) =>
                    setCardDetails({
                      thresholds: [thresholds[0], Number(e.target.value)],
                    })
                  }
                />
                <div>
                  <Toggle
                    pressed={thresholdsEnabled}
                    onPressedChange={() =>
                      setCardDetails({ thresholdsEnabled: !thresholdsEnabled })
                    }
                  >
                    <Check />
                  </Toggle>
                </div>
              </div>
            </div>
          ) : null}
          {editor && (
            <div className='space-y-2 pt-2'>
              <Label>Rules Text Assistance</Label>
              <AssistedRulesText editor={editor} />
            </div>
          )}
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};
