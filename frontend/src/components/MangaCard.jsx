import React from 'react';
import { Link } from 'react-router-dom';
import { getMangaTitle, getMangaAuthor, getMangaCoverUrl, getMangaDescription } from '../utils/mangadex';
import { Star, BookOpen } from 'lucide-react';

const MangaCard = ({ manga }) => {
  const title = getMangaTitle(manga);
  const author = getMangaAuthor(manga);
  const coverUrl = getMangaCoverUrl(manga);
  const description = getMangaDescription(manga);
  const status = manga.attributes?.status;

  const statusColors = {
    ongoing: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    hiatus: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const currentStatusStyle = statusColors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';

  return (
    <Link
      to={`/manga/${manga.id}`}
      className="group relative flex flex-col w-full h-[380px] bg-day-card dark:bg-night-card rounded-xl overflow-hidden border border-day-border dark:border-night-border hover:-translate-y-1.5 hover:shadow-xl hover:shadow-day-accent/5 dark:hover:shadow-night-accent/5 transition-all duration-300"
    >
      {/* Cover Image Container */}
      <div className="relative w-full h-3/5 bg-day-bg dark:bg-night-bg overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-day-accent/20 to-day-accent/5 dark:from-night-accent/20 dark:to-night-accent/5 text-day-muted dark:text-night-muted">
            <BookOpen className="w-10 h-10 mb-2 opacity-60" />
            <span className="text-xs font-semibold">No Cover Art</span>
          </div>
        )}
        
        {/* Status Badge overlay */}
        {status && (
          <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-3xs font-extrabold tracking-wider uppercase rounded-full border ${currentStatusStyle}`}>
            {status}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col p-4 flex-grow justify-between">
        <div className="space-y-1.5">
          {/* Author */}
          <span className="text-3xs font-bold uppercase tracking-wider text-day-accent dark:text-night-accent opacity-90 truncate block">
            {author}
          </span>
          {/* Title */}
          <h3 className="font-bold text-sm text-day-text dark:text-night-text line-clamp-2 leading-snug group-hover:text-day-accent dark:group-hover:text-night-accent transition-colors duration-200">
            {title}
          </h3>
          {/* Description */}
          <p className="text-xs text-day-muted dark:text-night-muted line-clamp-3 leading-relaxed opacity-80">
            {description || 'No description available for this manga.'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
