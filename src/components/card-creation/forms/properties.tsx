'use client';

import * as React from 'react';

import { FormInput, FormContainer } from '@/components/common/form';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { useCardStore, useCardActions, useCardComputed } from '@/store';
import { CustomSelect } from '@/components/common';
import { DomainSelect } from './domain-select';
import { Toggle } from '@/components/ui/toggle';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const DomainPropertiesForm = () => {
  const {
    card: { subtype, stress, level, domainPrimary, domainPrimaryColor, domainPrimaryIcon },
  } = useCardStore();
  const { domainColor, domainIncludes } = useCardComputed();
  const { setCardDetails } = useCardActions();
  return (
    <FormContainer title='Domain Properties' collapsible defaultOpen>
      <div className='space-y-2'>
        <DomainSelect
          id='domain'
          label='Domain'
          className='w-full'
          value={domainPrimary}
          color={domainPrimaryColor}
          onChange={(v) => {
            if (domainIncludes(v)) {
              setCardDetails({
                domainPrimary: v,
                domainSecondary: v,
                domainPrimaryColor: domainColor(v),
                domainSecondaryColor: domainColor(v),
              });
            } else {
              setCardDetails({
                domainPrimary: 'custom',
                domainSecondary: 'custom',
              });
            }
          }}
          onColorChange={(v) =>
            setCardDetails({ domainPrimaryColor: v, domainSecondaryColor: v })
          }
          onIconChange={(v) => setCardDetails({ domainPrimaryIcon: v })}
          existingIcon={domainPrimaryIcon}
        />
        <CollapsibleContent className='flex gap-2'>
          <div className='w-full space-y-2'>
            <Label htmlFor='subtype'>Ability Type</Label>
            <CustomSelect
              id='subtype'
              placeholder='Ability Type'
              options={[
                {
                  category: 'Types',
                  options: ['ability', 'spell', 'grimoire'],
                },
              ]}
              value={subtype}
              onChange={(v) => setCardDetails({ subtype: v })}
            />
          </div>
          <FormInput
            className='w-full'
            id='stress'
            type='number'
            min={0}
            max={9}
            value={stress}
            onChange={(e) => setCardDetails({ stress: Number(e.target.value) })}
          />
          <FormInput
            className='w-full'
            id='level'
            type='number'
            min={0}
            max={9}
            value={level}
            onChange={(e) => setCardDetails({ level: Number(e.target.value) })}
          />
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};

export const ClassPropertiesForm = () => {
  const {
    classes,
    card: {
      name,
      subtitle,
      evasion,
      domainPrimary,
      domainSecondary,
      domainPrimaryColor,
      domainSecondaryColor,
      domainPrimaryIcon,
      domainSecondaryIcon,
    },
  } = useCardStore();
  const { domainColor, domainIncludes, classColors, classDomains } =
    useCardComputed();
  const { setCardDetails } = useCardActions();
  const classOptions = classes!
    .reduce((acc: string[], curr) => {
      if (!acc.includes(curr.source)) {
        return [...acc, curr.source];
      }
      return acc;
    }, [])
    .map((source) => ({
      category: source,
      options: classes!.filter((c) => c.source === source).map((c) => c.name),
    }));
  return (
    <FormContainer title='Class Properties' collapsible defaultOpen>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <div className='grow space-y-2'>
            <Label htmlFor='class-name'>Class</Label>
            <CustomSelect
              id='class-name'
              placeholder='Class'
              options={classOptions}
              value={name}
              renderValue={(v) =>
                classes!.map((c) => c.name).includes(v) ? (
                  <div className='flex items-center gap-2'>
                    <div
                      className='size-3 rounded-full'
                      style={{
                        background: classColors(v).primary,
                      }}
                    />
                    <div
                      className='size-3 rounded-full'
                      style={{
                        background: classColors(v).secondary,
                      }}
                    />
                    <span>{v}</span>
                  </div>
                ) : (
                  <span>{v}</span>
                )
              }
              onChange={(v) => {
                if (classes!.map((c) => c.name).includes(v)) {
                  setCardDetails({
                    name: v,
                    domainPrimary: classDomains(v).primary,
                    domainPrimaryColor: classColors(v).primary,
                    domainSecondary: classDomains(v).secondary,
                    domainSecondaryColor: classColors(v).secondary,
                  });
                } else {
                  setCardDetails({
                    name: v,
                    domainPrimary: 'custom',
                    domainSecondary: 'custom',
                  });
                }
              }}
            />
          </div>
          <div className='grow space-y-2'>
            <Label htmlFor='subtitle'>Subtitle</Label>
            <CustomSelect
              id='subtitle'
              placeholder='Subtitle'
              options={[
                {
                  category: 'Features',
                  options: [
                    'flavor',
                    'hope feature',
                    'class features',
                    'multiclass features',
                  ],
                },
              ]}
              value={subtitle}
              onChange={(v) => setCardDetails({ subtitle: v })}
            />
          </div>
        </div>
        <FormInput
          id='evasion'
          label='Starting Evasion Score'
          className='w-full'
          type='number'
          min={0}
          value={evasion}
          onChange={(e) => setCardDetails({ evasion: Number(e.target.value) })}
        />
        <CollapsibleContent>
          {!classes!.map((c) => c.name).includes(name!) ? (
            <>
              <DomainSelect
                id='domain'
                label='Primary Domain'
                className='w-full'
                value={domainPrimary}
                color={domainPrimaryColor}
                onColorChange={(v) => setCardDetails({ domainPrimaryColor: v })}
                onChange={(v) =>
                  domainIncludes(v)
                    ? setCardDetails({
                        domainPrimary: v,
                        domainPrimaryColor: domainColor(v),
                      })
                    : setCardDetails({
                        domainPrimary: 'custom',
                      })
                }
                onIconChange={(v) => setCardDetails({ domainPrimaryIcon: v })}
                existingIcon={domainPrimaryIcon}
              />
              <DomainSelect
                id='domain'
                label='Secondary Domain'
                className='w-full'
                value={domainSecondary}
                color={domainSecondaryColor}
                onColorChange={(v) =>
                  setCardDetails({ domainSecondaryColor: v })
                }
                onChange={(v) =>
                  domainIncludes(v)
                    ? setCardDetails({
                        domainSecondary: v,
                        domainSecondaryColor: domainColor(v),
                      })
                    : setCardDetails({ domainSecondary: 'custom' })
                }
                onIconChange={(v) => setCardDetails({ domainSecondaryIcon: v })}
                existingIcon={domainSecondaryIcon}
              />
            </>
          ) : null}
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};

export const SubClassPropertiesForm = () => {
  const {
    classes,
    card: {
      subtype,
      subtitle,
      domainPrimary,
      domainSecondary,
      domainPrimaryColor,
      domainSecondaryColor,
      domainPrimaryIcon,
      domainSecondaryIcon,
    },
  } = useCardStore();
  const { classColors, classDomains, domainColor, domainIncludes } =
    useCardComputed();
  const { setCardDetails } = useCardActions();
  const classOptions = classes!
    .reduce((acc: string[], curr) => {
      if (!acc.includes(curr.source)) {
        return [...acc, curr.source];
      }
      return acc;
    }, [])
    .map((source) => ({
      category: source,
      options: classes!.filter((c) => c.source === source).map((c) => c.name),
    }));
  return (
    <FormContainer title='Subclass Properties' collapsible>
      <div className='flex gap-2'>
        <div className='w-full space-y-2'>
          <Label htmlFor='class-name'>Class</Label>
          <CustomSelect
            id='class-name'
            placeholder='Class'
            options={classOptions}
            value={subtype}
            renderValue={(v) =>
              classes!.map((c) => c.name).includes(v) ? (
                <div className='flex items-center gap-2'>
                  <div
                    className='size-3 rounded-full'
                    style={{
                      background: classColors(v).primary,
                    }}
                  />
                  <div
                    className='size-3 rounded-full'
                    style={{
                      background: classColors(v).secondary,
                    }}
                  />
                  <span>{v}</span>
                </div>
              ) : (
                <span>{v}</span>
              )
            }
            onChange={(v) => {
              if (classes!.map((c) => c.name).includes(v)) {
                setCardDetails({
                  subtype: v,
                  domainPrimary: classDomains(v).primary,
                  domainPrimaryColor: classColors(v).primary,
                  domainSecondary: classDomains(v).secondary,
                  domainSecondaryColor: classColors(v).secondary,
                });
              } else {
                setCardDetails({
                  subtype: v,
                  domainPrimary: 'custom',
                  domainSecondary: 'custom',
                });
              }
            }}
          />
        </div>
        <div className='w-full space-y-2'>
          <Label htmlFor='sub-feature'>Subclass Feature</Label>
          <CustomSelect
            id='sub-feature'
            placeholder='Feature'
            options={[
              {
                category: 'Features',
                options: ['foundation', 'specialization', 'mastery'],
              },
            ]}
            value={subtitle}
            onChange={(v) => setCardDetails({ subtitle: v })}
          />
        </div>
      </div>
      {!classes!.map((c) => c.name).includes(subtype!) ? (
        <div className='mt-2 space-y-2'>
          <DomainSelect
            id='domain'
            label='Primary Domain'
            className='w-full'
            value={domainPrimary}
            color={domainPrimaryColor}
            onChange={(v) =>
              domainIncludes(v)
                ? setCardDetails({
                    domainPrimary: v,
                    domainPrimaryColor: domainColor(v),
                  })
                : setCardDetails({
                    domainPrimary: 'custom',
                  })
            }
            onColorChange={(v) => setCardDetails({ domainPrimaryColor: v })}
            onIconChange={(v) => setCardDetails({ domainPrimaryIcon: v })}
            existingIcon={domainPrimaryIcon}
          />
          <DomainSelect
            id='domain'
            label='Secondary Domain'
            className='w-full'
            value={domainSecondary}
            color={domainSecondaryColor}
            onChange={(v) =>
              domainIncludes(v)
                ? setCardDetails({
                    domainSecondary: v,
                    domainSecondaryColor: domainColor(v),
                  })
                : setCardDetails({ domainSecondary: 'custom' })
            }
            onColorChange={(v) => setCardDetails({ domainSecondaryColor: v })}
            onIconChange={(v) => setCardDetails({ domainSecondaryIcon: v })}
            existingIcon={domainSecondaryIcon}
          />
        </div>
      ) : null}
    </FormContainer>
  );
};

export const EquipmentPropertiesForm = () => {
  const {
    card: {
      subtitle,
      armor,
      armorEnabled,
      hands,
      handsEnabled,
      tier,
      tierEnabled,
    },
  } = useCardStore();
  const { setCardDetails } = useCardActions();
  return (
    <FormContainer title='Equipment Properties' collapsible defaultOpen>
      <CollapsibleContent className='space-y-2'>
        <div className='flex gap-2'>
          <div className='grow space-y-2'>
            <Label htmlFor='subtype'>Equipment Type</Label>
            <CustomSelect
              id='subtype'
              placeholder='Equipment Type'
              options={[
                {
                  category: 'Types',
                  options: [
                    'armor',
                    'consumable',
                    'item',
                    'primary weapon',
                    'secondary weapon',
                  ],
                },
              ]}
              value={subtitle}
              onChange={(v) => setCardDetails({ subtitle: v })}
            />
          </div>
          <div className='grow space-y-2'>
            <Label htmlFor='tier'>Tier</Label>
            <div className='flex gap-2'>
              <Input
                id='tier'
                placeholder='Tier'
                type='number'
                min={1}
                max={4}
                value={tier}
                onChange={(e) =>
                  setCardDetails({ tier: Number(e.target.value) })
                }
              />
              <div>
                <Toggle
                  pressed={tierEnabled}
                  onPressedChange={() =>
                    setCardDetails({ tierEnabled: !tierEnabled })
                  }
                >
                  <Check />
                </Toggle>
              </div>
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='armor'>Armor</Label>
          <div className='flex gap-2'>
            <Input
              id='armor'
              placeholder='Armor'
              type='number'
              min={1}
              value={armor}
              onChange={(e) =>
                setCardDetails({ armor: Number(e.target.value) })
              }
            />
            <div>
              <Toggle
                pressed={armorEnabled}
                onPressedChange={() =>
                  setCardDetails({ armorEnabled: !armorEnabled })
                }
              >
                <Check />
              </Toggle>
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='hands'>Hands</Label>
          <div className='flex gap-2'>
            <Select
              value={String(hands)}
              onValueChange={(v: string) =>
                setCardDetails({ hands: Number(v) })
              }
            >
              <SelectTrigger id='type' className='w-full capitalize'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1' className='capitalize'>
                  One handed
                </SelectItem>
                <SelectItem value='2' className='capitalize'>
                  Two handed
                </SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Toggle
                pressed={handsEnabled}
                onPressedChange={() =>
                  setCardDetails({ handsEnabled: !handsEnabled })
                }
              >
                <Check />
              </Toggle>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </FormContainer>
  );
};
