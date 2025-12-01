import type { ReactElement } from 'react';
import { LanguageMeta } from './types';

export const languageMeta: LanguageMeta[] = [
    {
        code: 'EN',
        country: 'US',
        name: 'English',
        role: 'FULL-STACK DEVELOPER',
        fallbackGreeting: 'Hello,',
        fallbackDescription: 'Select the language for a truly immersive experience',
        tip: 'Click the node lines to see the magic happening',
        explore: 'EXPLORE',
    },
    {
        code: 'PT',
        country: 'BR',
        name: 'Português',
        role: 'DESENVOLVEDORA FULL-STACK',
        fallbackGreeting: 'Olá,',
        fallbackDescription: 'Selecione o idioma para uma experiência imersiva',
        tip: 'Clique nas linhas dos nodes para ver a magica acontecer',
        explore: 'EXPLORAR',
    },
    {
        code: 'ES',
        country: 'ES',
        name: 'Español',
        role: 'DESARROLLADORA FULL-STACK',
        fallbackGreeting: 'Hola,',
        fallbackDescription: 'Selecciona el idioma para una experiencia inmersiva',
        tip: 'Haz clic en las lineas del nodo para ver la magia',
        explore: 'EXPLORAR',
    },
    {
        code: 'FR',
        country: 'FR',
        name: 'Français',
        role: 'DÉVELOPPEUSE FULL-STACK',
        fallbackGreeting: 'Bonjour,',
        fallbackDescription: 'Selectionnez la langue pour une experience immersive',
        tip: 'Cliquez sur les lignes du noeud pour voir la magie',
        explore: 'EXPLORER',
    },
];

export const flagPaths: Record<string, ReactElement> = {
    BR: (
        <g>
            <rect width="100%" height="100%" fill="#009739" />
            <polygon points="50,8 95,50 50,92 5,50" fill="#FEDD00" />
            <circle cx="50" cy="50" r="20" fill="#012169" />
            <path d="M30,50 Q50,35 70,50 Q50,42 30,50" fill="#fff" />
        </g>
    ),
    US: (
        <g>
            <rect width="100%" height="100%" fill="#bf0a30" />
            {[1, 3, 5, 7, 9, 11].map(i => (
                <rect key={i} y={i * 7.69} width="100%" height="7.69" fill="#fff" />
            ))}
            <rect width="40%" height="53.85%" fill="#002868" />
            {Array.from({ length: 50 }).map((_, i) => {
                const row = Math.floor(i / (i < 30 && Math.floor(i / 6) % 2 === 0 ? 6 : 5));
                const isEvenRow = Math.floor(i / 5.5) % 2 === 0;
                const starsInRow = isEvenRow ? 6 : 5;
                const rowIndex = Math.floor(i / 5.5);
                const colIndex = i % (rowIndex % 2 === 0 ? 6 : 5);
                const actualRow = Math.floor((i * 2) / 11);
                const posInRow = i - Math.floor(actualRow * 5.5);

                const starRow = Math.floor(i / 6) + Math.floor((i + 6) / 11);
                const cols = starRow % 2 === 0 ? 6 : 5;

                let cx, cy;
                if (i < 6) { cx = 3.3 + (i * 6.6); cy = 5; }
                else if (i < 11) { cx = 6.6 + ((i - 6) * 6.6); cy = 11; }
                else if (i < 17) { cx = 3.3 + ((i - 11) * 6.6); cy = 17; }
                else if (i < 22) { cx = 6.6 + ((i - 17) * 6.6); cy = 23; }
                else if (i < 28) { cx = 3.3 + ((i - 22) * 6.6); cy = 29; }
                else if (i < 33) { cx = 6.6 + ((i - 28) * 6.6); cy = 35; }
                else if (i < 39) { cx = 3.3 + ((i - 33) * 6.6); cy = 41; }
                else if (i < 44) { cx = 6.6 + ((i - 39) * 6.6); cy = 47; }
                else { cx = 3.3 + ((i - 44) * 6.6); cy = 53; }

                return <circle key={i} cx={cx} cy={cy} r="1.3" fill="#fff" />;
            })}
        </g>
    ),
    ES: (
        <g>
            <rect width="100%" height="25%" fill="#c60b1e" />
            <rect y="25%" width="100%" height="50%" fill="#ffc400" />
            <rect y="75%" width="100%" height="25%" fill="#c60b1e" />
        </g>
    ),
    FR: (
        <g>
            <rect width="33.33%" height="100%" fill="#002654" />
            <rect x="33.33%" width="33.33%" height="100%" fill="#fff" />
            <rect x="66.66%" width="33.34%" height="100%" fill="#ed2939" />
        </g>
    ),
}