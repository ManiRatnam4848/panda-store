import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export const JournalSection: React.FC = () => {
  const articles = [
    {
      tag: 'ESSAY · BOOK ARTS',
      title: 'Why We Still Read Physical Books in the Age of Constant Light',
      excerpt: 'On the tactile resistance of turning a page, eye rest, and how a physical spine creates a permanent anchor in a room.',
      author: 'Arundhati Roye',
      readTime: '6 min read',
      date: 'October 2025',
    },
    {
      tag: 'CRAFT · ARCHIVAL',
      title: 'The Art of the Endpaper: Marbled Patterns from 18th-century Kyoto to Fort Kochi',
      excerpt: 'Exploring suminagashi floating ink techniques and hand-blocked botanical endpapers that protect book blocks.',
      author: 'Marcus Lindqvist',
      readTime: '8 min read',
      date: 'September 2025',
    },
    {
      tag: 'CARE · CONSERVATION',
      title: 'A Guide to Caring for Clothbound Hardcovers in the Indian Monsoon',
      excerpt: 'Cedar blocks, indirect ventilation, and natural silica buffers: practical tips from our archival restoration team.',
      author: 'Pooja Venkatesh',
      readTime: '5 min read',
      date: 'August 2025',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#20251F]/8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C66B48] font-semibold block mb-2">
              THE PANDA READING JOURNAL
            </span>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#20251F]">
              Dispatches on reading & craft
            </h2>
          </div>
          <p className="text-xs text-[#5C635B] max-w-xs">
            Reflections from our editors, typographers, and visiting authors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <article
              key={idx}
              className="group flex flex-col justify-between p-6 bg-[#F6F1E8] border border-stone-200/80 rounded-xl hover:border-stone-400 transition-all cursor-pointer"
            >
              <div>
                <span className="text-[10px] tracking-widest font-semibold text-[#315C46] uppercase block mb-3">
                  {art.tag}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#20251F] group-hover:text-[#315C46] transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="mt-3 text-xs text-[#5C635B] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs text-[#5C635B]">
                <div className="flex items-center gap-2">
                  <span>{art.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readTime}</span>
                </div>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#315C46]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
