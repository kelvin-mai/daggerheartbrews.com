import { toPng } from '@jpinsonneau/html-to-image';

import type { CardClassOption, CardDomainOption } from '@/lib/types';
import type { ZustandGet, ZustandSet } from '../types';
import type { CardEffects, CardState, CardStore } from './types';

const downloadImage =
  (get: ZustandGet<CardStore>): CardEffects['downloadImage'] =>
  async () => {
    const { preview, card } = get();
    const { name, type } = card;
    try {
      if (preview?.current) {
        // Wait a bit to ensure all images are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await toPng(preview.current, { 
          cacheBust: true, 
          pixelRatio: 1,
          includeQueryParams: true,
          skipFonts: false,
          skipAutoScale: false,
          backgroundColor: '#ffffff'
        }).then((data) => {
          const link = document.createElement('a');
          link.download = `daggerheart-${type}-${name}.png`;
          link.href = data;
          link.click();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

const downloadCardBackImage =
  (get: ZustandGet<CardStore>): CardEffects['downloadCardBackImage'] =>
  async () => {
    const { cardBackPreview, card } = get();
    const { name, type } = card;
    try {
      if (cardBackPreview?.current) {
        // Wait a bit to ensure all images are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await toPng(cardBackPreview.current, {
          cacheBust: true,
          pixelRatio: 1,
          includeQueryParams: true,
          skipFonts: false,
          skipAutoScale: false,
          backgroundColor: '#ffffff'
        }).then((data) => {
          const link = document.createElement('a');
          link.download = `daggerheart-${type}-${name}-back.png`;
          link.href = data;
          link.click();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

const loadOptions =
  (get: ZustandGet<CardStore>): CardEffects['loadOptions'] =>
  async () => {
    const {
      domains,
      classes,
      actions: { setOptions, setLoading },
    } = get();
    if (!domains || !classes) {
      try {
        setLoading(true);
        const res = await fetch('/api/card-options');
        const data: {
          classes: CardClassOption[];
          domains: CardDomainOption[];
        } = await res.json();
        setOptions(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

const saveCardPreview =
  (get: ZustandGet<CardStore>): CardEffects['saveCardPreview'] =>
  async () => {
    const { card, userCard, settings } = get();
    // Include card back settings in the card data
    const cardWithSettings = {
      ...card,
      cardBack: settings.cardBack,
      customCardBackLogo: settings.customCardBackLogo,
    };
    const res = await fetch(
      `/api/card-preview/${userCard?.cardPreviewId && card.id && userCard?.cardPreviewId === card.id ? card.id : ''}`,
      {
        method: 'POST',
        body: JSON.stringify({ card: cardWithSettings, userCard, public: typeof userCard?.public === 'boolean' ? userCard.public : undefined }),
      },
    );
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error.message);
    }
  };

export const createEffects = (
  _: ZustandSet<CardState>,
  get: ZustandGet<CardStore>,
) => ({
  downloadImage: downloadImage(get),
  downloadCardBackImage: downloadCardBackImage(get),
  loadOptions: loadOptions(get),
  saveCardPreview: saveCardPreview(get),
});
