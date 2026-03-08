import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Дом милосердия кузнеца Лобова',
    short_name: 'Дом милосердия',
    description: 'Благотворительный фонд помощи «Дом милосердия кузнеца Лобова»',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFBF7',
    theme_color: '#FF7A00',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
