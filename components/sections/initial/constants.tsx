import type { ReactElement } from 'react';
import { LanguageMeta } from './types';

export const languageMeta: LanguageMeta[] = [
    {
        code: 'EN',
        country: 'US',
        name: 'English',
        fallbackGreeting: 'Hello,',
        fallbackDescription: 'Select the language for a truly immersive experience',
        tip: 'Click the node lines to see the magic happening',
        explore: 'EXPLORE',
    },
    {
        code: 'PT',
        country: 'BR',
        name: 'Português',
        fallbackGreeting: 'Olá,',
        fallbackDescription: 'Selecione o idioma para uma experiência imersiva',
        tip: 'Clique nas linhas dos nodes para ver a magica acontecer',
        explore: 'EXPLORAR',
    },
    {
        code: 'ES',
        country: 'ES',
        name: 'Español',
        fallbackGreeting: 'Hola,',
        fallbackDescription: 'Selecciona el idioma para una experiencia inmersiva',
        tip: 'Haz clic en las lineas del nodo para ver la magia',
        explore: 'EXPLORAR',
    },
    {
        code: 'FR',
        country: 'FR',
        name: 'Français',
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
            <rect width="100%" height="100%" fill="#B22234" />
            {[0, 2, 4, 6, 8, 10, 12].map(i => (
                <rect key={i} y={i * 7.69} width="100%" height="7.69" fill={i % 2 === 0 ? '#B22234' : '#fff'} />
            ))}
            <rect width="40%" height="53.85%" fill="#3C3B6E" />
            {Array.from({ length: 30 }).map((_, i) => {
                const row = Math.floor(i / 6);
                const col = i % 6;
                const offset = row % 2 === 0 ? 0 : 3;
                return (
                    <circle
                        key={i}
                        cx={4 + (col * 6.5) + offset}
                        cy={4 + row * 5.4}
                        r="1.5"
                        fill="#fff"
                    />
                );
            })}
        </g>
    ),
    ES: (
        <g>
            <rect width="100%" height="25%" fill="#AA151B" />
            <rect y="25%" width="100%" height="50%" fill="#F1BF00" />
            <rect y="75%" width="100%" height="25%" fill="#AA151B" />
        </g>
    ),
    FR: (
        <g>
            <rect width="33.33%" height="100%" fill="#002395" />
            <rect x="33.33%" width="33.33%" height="100%" fill="#fff" />
            <rect x="66.66%" width="33.34%" height="100%" fill="#ED2939" />
        </g>
    ),
};