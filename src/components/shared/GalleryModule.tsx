'use client';

import React, { useState } from 'react';
import { Image, Heart, Sparkles, Filter, X } from 'lucide-react';
import { mockGallery } from '../../data/mockData';

export const GalleryModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [galleryItems, setGalleryItems] = useState(mockGallery);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const categories = ['All', 'Chemistry', 'Physics', 'Biology', 'Science Fair'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(g => g.category === selectedCategory);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold uppercase">
              Visual Learning Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
              Practical Science Gallery
            </h2>
            <p className="text-xs text-purple-600 font-medium">Explore high-resolution lab setups, flame spectra, and science fair projects</p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-purple-50 p-1.5 rounded-full border border-purple-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-900 hover:text-purple-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="clay-card p-3.5 clay-card-interactive group flex flex-col justify-between"
            >
              <div className="relative rounded-2xl overflow-hidden mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-bold">
                  {item.category}
                </span>

                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-pink-600 text-xs font-bold flex items-center gap-1 shadow-md hover:scale-110 transition"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  <span>{item.likes}</span>
                </button>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-purple-950 px-1">{item.title}</h4>
                <p className="text-[10px] text-purple-500 px-1 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-purple-100">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 uppercase">{activeItem.category}</span>
                <h3 className="font-black text-lg text-purple-950">{activeItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center hover:bg-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover rounded-2xl border border-purple-100"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-purple-500 font-bold">Captured on {activeItem.date}</span>
              <button
                onClick={(e) => toggleLike(activeItem.id, e)}
                className="clay-btn px-5 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" /> Like ({activeItem.likes})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
