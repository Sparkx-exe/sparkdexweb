import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import MangaCard from '../components/MangaCard';
import { Heart, Search, BookOpen } from 'lucide-react';

const Favourites = () => {
  const { favourites } = useFavourites();

  useEffect(() => {
    document.title = 'Favourites — Sparkdex';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-day-border dark:border-night-border pb-3">
        <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
        <h1 className="text-xl md:text-2xl font-bold text-day-text dark:text-night-text">My Favourites</h1>
      </div>

      {favourites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favourites.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-xl space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-day-text dark:text-night-text">No favourites saved yet</h3>
            <p className="text-sm text-day-muted dark:text-night-muted max-w-sm mx-auto">
              Save your favorite manga series here to keep track of updates and quickly resume reading.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-day-accent dark:bg-night-accent text-white text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all hover:scale-102"
          >
            <Search className="w-4 h-4" />
            <span>Search Manga Catalog</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favourites;
