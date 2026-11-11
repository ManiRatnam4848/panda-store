import React from 'react';
import { BookCategory } from '../../types/book';
import { ArrowRight, Compass, Feather, Landmark, Trees, Atom, Sparkles } from 'lucide-react';

interface GenreDiscoveryProps {
  onSelectGenre: (category: BookCategory) => void;
}

export const GenreDiscovery: React.FC<GenreDiscoveryProps> = ({ onSelectGenre }) => {
  const genres: {
    category: BookCategory;
    tagline: string;
    description: string;
    bg: string;
    text: string;
    accent: string;
    icon: React.ReactNode;
  }[] = [
    {
      category: 'Fiction',
      tagline: 'Novels & Short Form',
      description: 'Worlds unraveled across centuries, families, and quiet afternoons.',
      bg: '#EFE7DA',
      text: '#20251F',
      accent: '#C66B48',
      icon: <Feather size={22} />,
    },
    {
      category: 'Art & Architecture',
      tagline: 'Monoliths & Space',
      description: 'Axonometrics, isometric volumes, urban solitudes, and raw materials.',
      bg: '#2B3A31',
      text: '#F6F1E8',
      accent: '#D99B6C',
      icon: <Landmark size={22} />,
    },
    {
      category: 'Philosophy',
      tagline: 'Craft & Living',
      description: 'Treatises on silence, shadow, wood grain, and creative endurance.',
      bg: '#E4DDD2',
      text: '#20251F',
      accent: '#315C46',
      icon: <Compass size={22} />,
    },
    {
      category: 'Science & Nature',
      tagline: 'Biodiversity & Skies',
      description: 'Field notes from the Western Ghats to Himalayan dark sky reserves.',
      bg: '#25352B',
      text: '#F3EFE6',
      accent: '#93B077',
      icon: <Trees size={22} />,
    },
    {
      category: 'Poetry & Essays',
      tagline: 'Cadence & Solitude',
      description: 'Bilingual Urdu ghazals, letters to apprentices, and lyric fragments.',
      bg: '#3A292F',
      text: '#F5ECE3',
      accent: '#E0B589',
      icon: <Sparkles size={22} />,
    },
    {
      category: 'Nonfiction',
      tagline: 'Prose & Cartography',
      description: 'Historical investigations, typographic guides, and literary craft.',
      bg: '#E8E1D3',
      text: '#20251F',
      accent: '#9C413D',
      icon: <Atom size={22} />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-y border-[#20251F]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C66B48] font-semibold block mb-2">
            EDITORIAL DISCOVERY
          </span>
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#20251F]">
            Stories for every kind of mind
          </h2>
          <p className="mt-3 text-sm text-[#5C635B] leading-relaxed">
            Browse through our dedicated literary alcoves, curated with intentional pacing and physical care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((g, idx) => (
            <div
              key={idx}
              onClick={() => onSelectGenre(g.category)}
              className="group p-8 rounded-xl border border-stone-300/40 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[220px]"
              style={{ backgroundColor: g.bg, color: g.text }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {g.icon}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    {g.tagline}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl font-bold mb-2 group-hover:underline underline-offset-4">
                  {g.category}
                </h3>
                <p className="text-xs leading-relaxed opacity-85">{g.description}</p>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold">
                <span style={{ color: g.accent }}>Explore Alcove</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: g.accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
