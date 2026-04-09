import type { Album, LyricLine } from '@/types/listen';
import lyrics01 from '@/data/lyrics/01.json';
import lyrics02 from '@/data/lyrics/02.json';
import lyrics03 from '@/data/lyrics/03.json';
import lyrics04 from '@/data/lyrics/04.json';
import lyrics05 from '@/data/lyrics/05.json';
import lyrics06 from '@/data/lyrics/06.json';
import lyrics07 from '@/data/lyrics/07.json';
import lyrics08 from '@/data/lyrics/08.json';
import lyrics09 from '@/data/lyrics/09.json';
import lyrics10 from '@/data/lyrics/10.json';

export const album: Album = {
  id: 'carta-de-adeus',
  title: 'Carta de Adeus',
  artist: 'Fresno',
  coverArt: '/album-artwork.webp',
  year: 2026,
  tracks: [
    {
      id: 'track-01',
      number: 1,
      title: 'Eu Não Vou Deixar Você Morrer',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/01 - eu não vou deixar você morrer.mp4',
      lyrics: lyrics01 as LyricLine[],
    },
    {
      id: 'track-02',
      number: 2,
      title: 'Carta de Adeus',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/02 - carta de adeus.mp4',
      lyrics: lyrics02 as LyricLine[],
    },
    {
      id: 'track-03',
      number: 3,
      title: 'Tentar de Novo e de Novo',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/03 - tentar de novo e de novo.mp4',
      lyrics: lyrics03 as LyricLine[],
    },
    {
      id: 'track-04',
      number: 4,
      title: 'Sóbria',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/04 - sóbria.mp4',
      lyrics: lyrics04 as LyricLine[],
    },
    {
      id: 'track-05',
      number: 5,
      title: 'Pessoa',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/05 - pessoa.mp4',
      lyrics: lyrics05 as LyricLine[],
    },
    {
      id: 'track-06',
      number: 6,
      title: 'Logo Agora Que o Meu Mundo Girou',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/06 - logo agora que o meu mundo girou.mp4',
      lyrics: lyrics06 as LyricLine[],
    },
    {
      id: 'track-07',
      number: 7,
      title: 'Tudo Que Você Quer',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/07 - tudo que você quer.mp4',
      lyrics: lyrics07 as LyricLine[],
    },
    {
      id: 'track-08',
      number: 8,
      title: 'Se Foi Tão Fácil',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/08 - se foi tão fácil.mp4',
      lyrics: lyrics08 as LyricLine[],
    },
    {
      id: 'track-09',
      number: 9,
      title: 'O Cantor e o Taxista',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/09 - o cantor e o taxista.mp4',
      lyrics: lyrics09 as LyricLine[],
    },
    {
      id: 'track-10',
      number: 10,
      title: 'Eu Não Sei Dizer Não',
      artist: 'Fresno',
      duration: 0,
      src: '/audio/10 - eu não sei dizer não.mp4',
      lyrics: lyrics10 as LyricLine[],
    },
  ],
};
