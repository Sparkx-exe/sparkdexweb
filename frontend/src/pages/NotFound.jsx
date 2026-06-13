import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page Not Found — Sparkdex';
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fade-in flex flex-col items-center">
      {/* 404 Art */}
      <div className="relative">
        <h1 className="text-8xl md:text-9xl font-black tracking-widest text-day-accent/20 dark:text-night-accent/20 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-extrabold text-day-text dark:text-night-text border bg-day-bg dark:bg-night-bg px-4 py-2 rounded-xl border-day-border dark:border-night-border shadow-sm">
            Lost Chapter?
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-day-muted dark:text-night-muted leading-relaxed">
          The page or chapter you are looking for has either been moved, deleted, or never existed in the scanlation feed!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-day-accent dark:bg-night-accent text-white text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all hover:scale-102"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
