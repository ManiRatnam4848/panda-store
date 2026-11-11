import React from 'react';
import { BookOpen, PackageCheck, Truck, RefreshCw } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    {
      icon: <BookOpen size={20} className="text-[#315C46]" />,
      title: 'Curated Editions',
      description: 'Every title evaluated for literary depth and design craft.',
    },
    {
      icon: <PackageCheck size={20} className="text-[#315C46]" />,
      title: 'Archival Packaging',
      description: 'Plastic-free corrugated sleeves with wax-paper wraps.',
    },
    {
      icon: <Truck size={20} className="text-[#315C46]" />,
      title: 'Express Delivery',
      description: 'Courier dispatch to 19,000+ pincodes across India.',
    },
    {
      icon: <RefreshCw size={20} className="text-[#315C46]" />,
      title: 'Reading Guarantee',
      description: '14-day replacement or credit if a book arrives damaged.',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] border-b border-[#20251F]/8 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200/60 shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#20251F]">{pillar.title}</h4>
                <p className="text-xs text-[#5C635B] mt-0.5 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
