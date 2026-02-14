'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, FileText } from 'lucide-react';
import { CardPreview, CardBackPreview } from '@/components/card-creation/preview';
import type { CardDetails, CardSettings } from '@/lib/types';
import jsPDF from 'jspdf';
import { toPng } from '@jpinsonneau/html-to-image';
import { createRoot } from 'react-dom/client';
import React from 'react';
import JSZip from 'jszip';
import { useCardStore, useCardActions, useCardEffects } from '@/store/card';

type UserCard = {
  userCard: {
    id: string;
    userId: string;
    public: boolean;
    cardPreviewId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  cardPreview: CardDetails | null;
};

export default function Page() {
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<(UserCard | null)[]>([null, null, null, null]);
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([false, false, false, false]);
  const [isExporting, setIsExporting] = useState(false);
  const [cardSettings, setCardSettings] = useState<CardSettings[]>([
    { border: true, boldRulesText: true, artist: true, credits: true, placeholderImage: true, cardBack: 'default' },
    { border: true, boldRulesText: true, artist: true, credits: true, placeholderImage: true, cardBack: 'default' },
    { border: true, boldRulesText: true, artist: true, credits: true, placeholderImage: true, cardBack: 'default' },
    { border: true, boldRulesText: true, artist: true, credits: true, placeholderImage: true, cardBack: 'default' },
  ]);

  const fetchUserCards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user-cards');
      const data = await response.json();
      if (data.success) {
        setUserCards(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showCardPreview) {
      fetchUserCards();
    }
  }, [showCardPreview]);

  const handleCardSelect = (cardIndex: number, card: UserCard | null) => {
    const newSelectedCards = [...selectedCards];
    newSelectedCards[cardIndex] = card;
    setSelectedCards(newSelectedCards);
    
    // Load card back settings for the selected card
    if (card?.cardPreview) {
      const newCardSettings = [...cardSettings];
      newCardSettings[cardIndex] = {
        border: true,
        boldRulesText: true,
        artist: true,
        credits: true,
        placeholderImage: true,
        cardBack: card.cardPreview.cardBack || 'default',
        customCardBackLogo: card.cardPreview.customCardBackLogo,
      };
      setCardSettings(newCardSettings);
    }
    
    const newOpenDropdowns = [...openDropdowns];
    newOpenDropdowns[cardIndex] = false;
    setOpenDropdowns(newOpenDropdowns);
  };

  const toggleDropdown = (cardIndex: number) => {
    const newOpenDropdowns = [...openDropdowns];
    newOpenDropdowns[cardIndex] = !newOpenDropdowns[cardIndex];
    setOpenDropdowns(newOpenDropdowns);
  };

  const updateCardSetting = (cardIndex: number, setting: keyof CardSettings, value: boolean) => {
    const newSettings = [...cardSettings];
    newSettings[cardIndex] = {
      ...newSettings[cardIndex],
      [setting]: value,
    };
    setCardSettings(newSettings);
  };

  // Helper function to export individual card using existing DOM elements
  const exportIndividualCard = async (
    card: CardDetails,
    settings: CardSettings,
    isBack: boolean = false,
    cardIndex: number
  ): Promise<string> => {
    // Find the existing card element in the DOM
    const selector = isBack ? `[data-card-back-index="${cardIndex}"]` : `[data-card-index="${cardIndex}"]`;
    const cardContainer = document.querySelector(selector);
    const cardElement = cardContainer?.querySelector('.aspect-card');
    
    if (!cardElement) {
      throw new Error(`Card element not found for index ${cardIndex}`);
    }
    
    // Wait for the element to update
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      // Capture at the element's natural size (750x1050px)
      const dataUrl = await toPng(cardElement as HTMLElement, {
        cacheBust: true,
        pixelRatio: 1,
        includeQueryParams: true,
        skipFonts: false,
        skipAutoScale: false
      });
      
      return dataUrl;
    } catch (error) {
      throw error;
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      // Wait longer to ensure all images are loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preload all images to ensure they're ready
      const imageUrls = [
        '/assets/images/quill-icon.png',
        '/assets/images/dh-cgl-logo.png',
        '/assets/card/banner.webp',
        '/assets/card/level-bg.webp',
        '/assets/card/dh-armor-bg.webp',
        '/assets/card/dh-one-hand.webp',
        '/assets/card/dh-two-hands.webp',
        '/assets/card/dh-card-back-1.png',
        '/assets/card/dh-card-back-2.png'
      ];
      
      // Add divider images
      const cardTypes = ['domain', 'class', 'subclass', 'ancestry', 'community', 'equipment', 'transformation'];
      cardTypes.forEach(type => {
        imageUrls.push(`/assets/card/divider-${type === 'subclass' ? 'class' : type}.webp`);
      });
      
      // Preload all images
      await Promise.all(imageUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
      }));
      
      // Preload custom card images and logos
      const customImages = selectedCards
        .filter(card => card?.cardPreview)
        .flatMap(card => [
          card?.cardPreview?.image,
          card?.cardPreview?.customCardBackLogo,
          card?.cardPreview?.domainPrimaryIcon,
          card?.cardPreview?.domainSecondaryIcon
        ])
        .filter(Boolean);
      
      if (customImages.length > 0) {
        await Promise.all(customImages.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url as string;
          });
        }));
      }
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 dimensions: 210mm x 297mm
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Card dimensions: 63.5mm x 88.9mm
      const cardWidth = 63.5;
      const cardHeight = 88.9;
      
      // High resolution capture for print quality (750x1050px = 300 DPI)
      const targetPixelWidth = 750;
      const targetPixelHeight = 1050;
      
      // Calculate positions for 2x2 grid with safe margins
      const margin = 20; // Safe margin for printers
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);
      
      // Calculate spacing between cards
      const horizontalSpacing = (availableWidth - (2 * cardWidth)) / 3;
      const verticalSpacing = (availableHeight - (2 * cardHeight)) / 3;
      
      // Calculate card positions
      const cardPositions = [
        { x: margin + horizontalSpacing, y: margin + verticalSpacing },
        { x: margin + horizontalSpacing + cardWidth + horizontalSpacing, y: margin + verticalSpacing },
        { x: margin + horizontalSpacing, y: margin + verticalSpacing + cardHeight + verticalSpacing },
        { x: margin + horizontalSpacing + cardWidth + horizontalSpacing, y: margin + verticalSpacing + cardHeight + verticalSpacing }
      ];

      // Generate front page (first page is created automatically)
      pdf.setFontSize(12);
      pdf.text('Page 1 - Front', pageWidth / 2, 15, { align: 'center' });
      
      // Add 10cm ruler with mm markings
      const rulerStartX = pageWidth - 25; // Position ruler on the right side
      const rulerStartY = 30;
      const rulerLength = 100; // 10cm = 100mm
      
      // Draw ruler line
      pdf.setLineWidth(0.5);
      pdf.line(rulerStartX, rulerStartY, rulerStartX, rulerStartY + rulerLength);
      
      // Add ruler markings every mm
      for (let i = 0; i <= 100; i++) {
        const y = rulerStartY + i;
        let markLength;
        
        if (i % 10 === 0) {
          markLength = 4; // Longest marks every 10mm (cm)
        } else if (i % 5 === 0) {
          markLength = 2.5; // Medium marks every 5mm
        } else {
          markLength = 1; // Short marks every mm
        }
        
        pdf.line(rulerStartX, y, rulerStartX + markLength, y);
        
        // Add numbers every 10mm
        if (i % 10 === 0) {
          pdf.setFontSize(8);
          pdf.text(`${i}`, rulerStartX + 5, y + 1);
        }
      }
      
      // Add ruler label
      pdf.setFontSize(8);
      pdf.text('10cm Ruler', rulerStartX + 2, rulerStartY - 5);

      // Store PNG data URLs for saving with index and side
      const pngDataUrls: { dataUrl: string; index: number; isBack: boolean }[] = [];

      // Export individual front cards
      for (let i = 0; i < 4; i++) {
        if (selectedCards[i]?.cardPreview) {
          try {
            const pngDataUrl = await exportIndividualCard(
              selectedCards[i]!.cardPreview!,
              cardSettings[i],
              false, // isBack = false for front cards
              i // cardIndex
            );
            
            // Store PNG data URL
            pngDataUrls.push({ dataUrl: pngDataUrl, index: i, isBack: false });
            
            // Add image to PDF (scaled down for PDF)
            pdf.addImage(pngDataUrl, 'PNG', cardPositions[i].x, cardPositions[i].y, cardWidth, cardHeight);
          } catch (error) {
            console.error(`Error exporting front card ${i}:`, error);
          }
        }
      }

      // Generate back page
      pdf.addPage();
      pdf.text('Page 2 - Back', pageWidth / 2, 15, { align: 'center' });

      // For duplex printing, swap positions: 1↔2 and 3↔4
      const duplexPositions = [
        cardPositions[1], // Back 1 goes to position 2
        cardPositions[0], // Back 2 goes to position 1
        cardPositions[3], // Back 3 goes to position 4
        cardPositions[2]  // Back 4 goes to position 3
      ];

      // Export individual back cards
      for (let i = 0; i < 4; i++) {
        if (selectedCards[i]?.cardPreview) {
          try {
            const pngDataUrl = await exportIndividualCard(
              selectedCards[i]!.cardPreview!,
              cardSettings[i],
              true, // isBack = true for back cards
              i // cardIndex
            );
            
            // Store PNG data URL
            pngDataUrls.push({ dataUrl: pngDataUrl, index: i, isBack: true });
            
            // Add image to PDF using duplex positions
            pdf.addImage(pngDataUrl, 'PNG', duplexPositions[i].x, duplexPositions[i].y, cardWidth, cardHeight);
          } catch (error) {
            console.error(`Error exporting back card ${i}:`, error);
          }
        }
      }

      // Create zip file with PDF and PNGs
      const zip = new JSZip();
      
      // Add PDF to zip
      const pdfBlob = pdf.output('blob');
      zip.file('daggerheart-cards-print.pdf', pdfBlob);
      
      // Add PNGs to zip with proper naming
      for (let i = 0; i < pngDataUrls.length; i++) {
        const { dataUrl, index, isBack } = pngDataUrls[i];
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Name files like the card store does: daggerheart-{type}-{name}.png
        const card = selectedCards[index]?.cardPreview;
        const cardName = card?.name || `card-${index + 1}`;
        const cardType = card?.type || 'card';
        const fileName = isBack 
          ? `daggerheart-${cardType}-${cardName}-back.png`
          : `daggerheart-${cardType}-${cardName}.png`;
        
        zip.file(fileName, blob);
      }
      
      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = 'daggerheart-cards-export.zip';
      link.href = URL.createObjectURL(zipBlob);
      link.click();
      
      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (showCardPreview) {
    return (
      <div className='overflow-x-auto'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='font-eveleth-clean text-2xl font-bold'>Print Preview - Cards</h1>
          <div className='flex gap-2'>
            <Button
              onClick={exportAsPDF}
              disabled={isExporting}
              className='flex items-center gap-2'
            >
              <FileText className='h-4 w-4' />
              {isExporting ? 'Exporting...' : 'Export as ZIP'}
            </Button>
            <Button 
              variant='outline' 
              onClick={() => setShowCardPreview(false)}
            >
              Back to Options
            </Button>
          </div>
        </div>
        
        <div className='space-y-8'>
          {/* Page 1 - Front of cards */}
          <div className='mx-auto max-w-[2000px] bg-white p-12 shadow-lg'>
            <div className='mb-6 text-center text-xl font-medium text-gray-600'>Page 1 - Front</div>
            <div className='flex flex-col gap-12'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={`front-${index}`}
                  data-card-index={index}
                  className='relative border-2 border-dashed border-gray-300 bg-gray-50 min-h-[1300px]'
                >
                  {/* Card Preview Background Layer */}
                  <div className='absolute inset-0 flex items-center justify-center p-24'>
                    {selectedCards[index]?.cardPreview ? (
                      <CardPreview
                        card={selectedCards[index]!.cardPreview!}
                        settings={cardSettings[index]}
                      />
                    ) : (
                      <div className='text-xs text-gray-500'>Card Preview</div>
                    )}
                  </div>
                  
                  {/* Controls Overlay Layer */}
                  <div className='relative z-10 bg-white/90 backdrop-blur-sm p-2 space-y-2 text-black'>
                    <Popover open={openDropdowns[index]} onOpenChange={() => toggleDropdown(index)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDropdowns[index]}
                          className="w-full justify-between text-xs h-8 text-black"
                        >
                          {selectedCards[index]?.cardPreview?.name || "Select card..."}
                          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search cards..." className="h-8" />
                          <CommandList>
                            <CommandEmpty>No cards found.</CommandEmpty>
                            <CommandGroup>
                              {userCards.map((card) => (
                                <CommandItem
                                  key={card.userCard.id}
                                  value={card.cardPreview?.name || ''}
                                  onSelect={() => handleCardSelect(index, card)}
                                  className="text-xs"
                                >
                                  <Check
                                    className={`mr-2 h-3 w-3 ${
                                      selectedCards[index]?.userCard.id === card.userCard.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {card.cardPreview?.name || 'Unnamed Card'}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {selectedCards[index] && (
                      <div className='flex flex-wrap gap-2'>
                        <div className='flex items-center space-x-1'>
                          <input
                            type='checkbox'
                            id={`border-${index}`}
                            checked={cardSettings[index].border}
                            onChange={(e) => updateCardSetting(index, 'border', e.target.checked)}
                            className='rounded'
                          />
                          <label htmlFor={`border-${index}`} className='text-xs text-black'>Border</label>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <input
                            type='checkbox'
                            id={`artist-${index}`}
                            checked={cardSettings[index].artist}
                            onChange={(e) => updateCardSetting(index, 'artist', e.target.checked)}
                            className='rounded'
                          />
                          <label htmlFor={`artist-${index}`} className='text-xs text-black'>Artist</label>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <input
                            type='checkbox'
                            id={`credits-${index}`}
                            checked={cardSettings[index].credits}
                            onChange={(e) => updateCardSetting(index, 'credits', e.target.checked)}
                            className='rounded'
                          />
                          <label htmlFor={`credits-${index}`} className='text-xs text-black'>Credits</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page 2 - Back of cards */}
          <div className='mx-auto max-w-[2000px] bg-white p-12 shadow-lg'>
            <div className='mb-6 text-center text-xl font-medium text-gray-600'>Page 2 - Back</div>
            <div className='flex flex-col gap-12'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={`back-${index}`}
                  data-card-back-index={index}
                  className='border-2 border-dashed border-gray-50 min-h-[1300px]'
                >
                  <div className='flex h-full items-center justify-center p-24'>
                    {selectedCards[index]?.cardPreview ? (
                      <CardBackPreview
                        card={selectedCards[index]!.cardPreview!}
                        settings={cardSettings[index]}
                      />
                    ) : (
                      <div className='text-sm text-gray-500'>Card {index + 1} Back</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='font-eveleth-clean text-2xl font-bold'>Printing Studio</h1>
      <p className='text-muted-foreground'>
        Print your cards and adversaries with professional quality
      </p>
      
      <div className='my-6 space-y-6'>
        <div className='bg-card rounded-lg border p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Print Your Content</h2>
          <p className='text-muted-foreground mb-6'>
            Generate print-ready PDFs of your custom cards and adversaries.
          </p>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='rounded-lg border p-6 text-center'>
              <h3 className='mb-2 text-lg font-medium'>Print Your Cards</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Print your custom cards in standard playing card format
              </p>
              <Button 
                className='w-full'
                onClick={() => setShowCardPreview(true)}
              >
                Print Your Cards
              </Button>
            </div>
            <div className='rounded-lg border p-6 text-center'>
              <h3 className='mb-2 text-lg font-medium'>Print Your Adversaries</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Print your custom adversaries with stat blocks and abilities
              </p>
              <Button className='w-full' asChild>
                <a href='/profile/printing-studio/adversaries'>Print Your Adversaries</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
