import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import sharp from 'sharp';
import { StoryTemplate } from '@/lib/satori/templates/story-template';
import { OGTemplate } from '@/lib/satori/templates/og-template';
import type { Letter } from '@/types';

async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load font from ${url}: ${response.status}`);
  }
  return response.arrayBuffer();
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

    // Use verified Google Fonts URLs
    const [playfairFont, jetbrainsFont] = await Promise.all([
      loadFont('https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf'),
      loadFont('https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf'),
    ]);

    const isStory = format === 'story';
    const width = isStory ? 1080 : 1200;
    const height = isStory ? 1920 : 630;

    const element = isStory ? (
      <StoryTemplate letter={letter} />
    ) : (
      <OGTemplate letter={letter} />
    );

    const svg = await satori(element, {
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

    const pngBuffer = await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toBuffer();

    return new NextResponse(new Uint8Array(pngBuffer), {
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
