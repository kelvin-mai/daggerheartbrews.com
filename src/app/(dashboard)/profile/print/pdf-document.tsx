'use client';

import * as React from 'react';
import { Document, Page, View, Image, StyleSheet } from '@react-pdf/renderer';

import { chunk } from '@/lib/utils';

// All units in pt (1in = 72pt)
const CARD_W = 180; // 2.5in
const CARD_H = 252; // 3.5in
const H_PAD = 36; // (8.5in - 3×2.5in) / 2 = 0.5in each side
const V_PAD = 18; // 0.25in — 3×3.5in = 10.5in fits exactly on 11in with 0.25in top/bottom

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: H_PAD,
    paddingVertical: V_PAD,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CARD_W,
    height: CARD_H,
  },
  image: {
    width: CARD_W,
    height: CARD_H,
  },
});

type PdfDocumentProps = {
  images: string[];
  cutLines: boolean;
};

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  images,
  cutLines,
}) => (
  <Document>
    {chunk(images, 9).map((pageImages, pageIndex) => (
      <Page key={pageIndex} size='LETTER' style={styles.page}>
        <View style={styles.grid}>
          {pageImages.map((src, cellIndex) => {
            return (
              <View
                key={cellIndex}
                style={[styles.cell, { position: 'relative' }]}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={src} style={styles.image} />
                {cutLines && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: CARD_W,
                      height: CARD_H,
                      borderWidth: 0.75,
                      borderStyle: 'dashed',
                      borderColor: '#555',
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </Page>
    ))}
  </Document>
);
