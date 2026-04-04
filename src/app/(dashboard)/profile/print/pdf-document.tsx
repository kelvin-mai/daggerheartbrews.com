'use client';

import * as React from 'react';
import { Document, Page, View, Image, StyleSheet } from '@react-pdf/renderer';

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

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  images,
  cutLines,
}) => (
  <Document>
    {chunk(images, 9).map((pageImages, pageIndex) => (
      <Page key={pageIndex} size='LETTER' style={styles.page}>
        <View style={styles.grid}>
          {pageImages.map((src, cellIndex) => {
            const col = cellIndex % 3;
            const row = Math.floor(cellIndex / 3);
            const totalRows = Math.ceil(pageImages.length / 3);
            return (
              <View
                key={cellIndex}
                style={[
                  styles.cell,
                  cutLines && col < 2
                    ? {
                        borderRightWidth: 0.5,
                        borderRightStyle: 'dashed',
                        borderRightColor: '#aaa',
                      }
                    : {},
                  cutLines && row < totalRows - 1
                    ? {
                        borderBottomWidth: 0.5,
                        borderBottomStyle: 'dashed',
                        borderBottomColor: '#aaa',
                      }
                    : {},
                ]}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={src} style={styles.image} />
              </View>
            );
          })}
        </View>
      </Page>
    ))}
  </Document>
);
