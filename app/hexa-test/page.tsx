'use client';

import HexaNode from '@/components/HexaNode';

export default function Home() {
    const handleLineClick = (lineIndex: number, clickPosition: { x: number; y: number }) => {
        console.log(`Linha ${lineIndex} clicada na posição:`, clickPosition);
    };

    return (
        <main className="relative w-screen h-screen bg-black overflow-hidden">
            <HexaNode
                size={70}
                color="#9b5cff"
                glowColor="#7f65a896"
                onLineClick={handleLineClick}
            />
        </main>
    );
}