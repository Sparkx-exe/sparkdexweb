import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SkeletonGrid } from '../components/SkeletonLoader';
import MangaCard from '../components/MangaCard';
import { Flame, Clock } from 'lucide-react';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const Home = () => {
  const [popularManga, setPopularManga] = useState([]);
  const [recentManga, setRecentManga] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingMoreRecent, setLoadingMoreRecent] = useState(false);
  const [error, setError] = useState(null);
  
  // Infinite scroll states for recently updated section
  const [recentOffset, setRecentOffset] = useState(0);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);
  const LIMIT = 24;

  // Fetch initial popular manga on mount
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoadingPopular(true);
        // Fetch popular manga pool (48 items)
        const res = await fetch(
          'https://api.mangadex.org/manga?limit=48&includes[]=cover_art&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive'
        );
        if (!res.ok) throw new Error('Failed to fetch popular manga');
        const data = await res.json();
        const shuffled = shuffleArray(data.data || []);
        setPopularManga(shuffled.slice(0, 12));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);

  // Fetch initial recently updated manga on mount
  useEffect(() => {
    const fetchInitialRecent = async () => {
      try {
        setLoadingRecent(true);
        const res = await fetch(
          `https://api.mangadex.org/manga?limit=${LIMIT}&offset=0&includes[]=cover_art&includes[]=author&order[latestUploadedChapter]=desc&contentRating[]=safe&contentRating[]=suggestive`
        );
        if (!res.ok) throw new Error('Failed to fetch recent manga');
        const data = await res.json();
        const items = data.data || [];
        setRecentManga(items);
        setHasMoreRecent(items.length === LIMIT);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchInitialRecent();
  }, []);

  // Fetch more recently updated manga on scroll
  const fetchMoreRecent = useCallback(async (currentOffset) => {
    if (loadingMoreRecent || !hasMoreRecent) return;
    try {
      setLoadingMoreRecent(true);
      const res = await fetch(
        `https://api.mangadex.org/manga?limit=${LIMIT}&offset=${currentOffset}&includes[]=cover_art&includes[]=author&order[latestUploadedChapter]=desc&contentRating[]=safe&contentRating[]=suggestive`
      );
      if (!res.ok) throw new Error('Failed to fetch more recent manga');
      const data = await res.json();
      const newManga = data.data || [];
      
      setRecentManga((prev) => [...prev, ...newManga]);
      setHasMoreRecent(newManga.length === LIMIT);
    } catch (err) {
      console.error('Error fetching more recent manga:', err);
    } finally {
      setLoadingMoreRecent(false);
    }
  }, [loadingMoreRecent, hasMoreRecent]);

  const handleLoadMoreRecent = useCallback(() => {
    if (loadingRecent || loadingMoreRecent || !hasMoreRecent) return;
    setRecentOffset((prevOffset) => {
      const nextOffset = prevOffset + LIMIT;
      fetchMoreRecent(nextOffset);
      return nextOffset;
    });
  }, [fetchMoreRecent, loadingRecent, loadingMoreRecent, hasMoreRecent]);

  // Set up intersection observer using callback ref to handle conditional rendering
  const observerRef = useRef(null);
  const loadMoreRef = useRef(handleLoadMoreRecent);
  
  useEffect(() => {
    loadMoreRef.current = handleLoadMoreRecent;
  }, [handleLoadMoreRecent]);

  const observerTargetRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreRef.current();
          }
        },
        { threshold: 0.1, rootMargin: '300px' } // 300px threshold for smoother infinite load
      );
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center py-6 space-y-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-day-text dark:text-night-text tracking-tight">
          Spark<span className="text-day-accent dark:text-night-accent">dex</span>
        </h1>
        <p className="text-sm md:text-base text-day-muted dark:text-night-muted max-w-xl mx-auto">
          Read your favorite manga series online directly from the MangaDex catalog. Free, high-speed, and ad-free.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center font-medium">
          Error loading content: {error}. Please verify the proxy connection.
        </div>
      )}

      {/* Popular Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-day-border dark:border-night-border pb-3">
          <Flame className="w-6 h-6 text-day-accent dark:text-night-accent animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold text-day-text dark:text-night-text">Popular Manga</h2>
        </div>
        {loadingPopular ? (
          <SkeletonGrid count={6} />
        ) : popularManga.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {popularManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-day-muted dark:text-night-muted">
            No popular manga found.
          </div>
        )}
      </section>

      {/* Recently Updated Section (with Infinite Scroll) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-day-border dark:border-night-border pb-3">
          <Clock className="w-6 h-6 text-day-accent dark:text-night-accent" />
          <h2 className="text-xl md:text-2xl font-bold text-day-text dark:text-night-text">Recently Updated</h2>
        </div>
        {loadingRecent ? (
          <SkeletonGrid count={6} />
        ) : recentManga.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recentManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
            
            {/* Infinite Scroll Anchor target */}
            <div ref={observerTargetRef} className="h-20 flex items-center justify-center pt-4">
              {hasMoreRecent && (loadingRecent || loadingMoreRecent) && (
                <div className="w-8 h-8 border-4 border-t-transparent border-day-accent dark:border-night-accent rounded-full animate-spin" />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-day-muted dark:text-night-muted">
            No recently updated manga found.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
