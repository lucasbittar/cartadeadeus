import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { TextOverlayStory } from '@/lib/satori/templates/text-overlay-story';
import { TextOverlayOG } from '@/lib/satori/templates/text-overlay-og';
import type { Letter } from '@/types';

// Body size limits configured at platform level (vercel.json) if needed

async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load font from ${url}: ${response.status}`);
  }
  return response.arrayBuffer();
}

async function loadBackgroundImage(format: 'story' | 'og', width: number, height: number): Promise<Buffer> {
  const imagePath = path.join(process.cwd(), 'public', `share-bg-${format}.png`);
  try {
    const imageBuffer = await fs.readFile(imagePath);
    // Resize background to exact dimensions to ensure composite works
    return await sharp(imageBuffer)
      .resize(width, height, { fit: 'fill' })
      .png()
      .toBuffer();
  } catch (err) {
    // If background image doesn't exist yet, throw a helpful error
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `Background image not found at ${imagePath}. ` +
        `Visit /share-image?format=${format} to generate and capture the background template.`
      );
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { letter, format = 'story' } = body as {
      letter: Letter;
      format?: 'story' | 'og';
    };

    if (!letter || !letter.content) {
      return NextResponse.json(
        { error: 'Letter is required' },
        { status: 400 }
      );
    }

    // Load fonts
    const [playfairFont, jetbrainsFont] = await Promise.all([
      loadFont('https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf'),
      loadFont('https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf'),
    ]);

    const isStory = format === 'story';
    const width = isStory ? 1080 : 1200;
    const height = isStory ? 1920 : 630;

    // Load the static background image (resized to exact dimensions)
    const backgroundBuffer = await loadBackgroundImage(format, width, height);

    // Create text-only overlay with Satori (transparent background)
    const textElement = isStory ? (
      <TextOverlayStory letter={letter} />
    ) : (
      <TextOverlayOG letter={letter} />
    );

    const textSvg = await satori(textElement, {
      width,
      height,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairFont,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: jetbrainsFont,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    // Convert SVG to PNG buffer with transparency
    const textPngBuffer = await sharp(Buffer.from(textSvg))
      .png()
      .toBuffer();

    // Composite text overlay onto background
    const compositeBuffer = await sharp(backgroundBuffer)
      .composite([
        {
          input: textPngBuffer,
          top: 0,
          left: 0,
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    return new NextResponse(new Uint8Array(compositeBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="carta-de-adeus-${letter.id}.png"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating share image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate image', details: errorMessage },
      { status: 500 }
    );
  }
}
