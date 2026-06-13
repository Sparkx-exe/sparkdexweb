import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { FavouritesProvider } from './context/FavouritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import Favourites from './pages/Favourites';
import NotFound from './pages/NotFound';

// Global handler to sync browser tab titles on route transition
function TitleHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.title = 'Sparkdex — Read Manga Online';
    } else if (location.pathname === '/search') {
      document.title = 'Search Manga — Sparkdex';
    } else if (location.pathname === '/favourites') {
      document.title = 'Favourites — Sparkdex';
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <FavouritesProvider>
          <Router>
            <TitleHandler />
            <div className="min-h-screen flex flex-col bg-day-bg text-day-text dark:bg-night-bg dark:text-night-text transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/manga/:id" element={<MangaDetail />} />
                  <Route path="/reader/:chapterId" element={<Reader />} />
                  <Route path="/favourites" element={<Favourites />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {/* Simple Footer */}
              <footer className="py-6 border-t border-day-border dark:border-night-border text-center text-3xs uppercase tracking-wider font-semibold text-day-muted dark:text-night-muted">
                Sparkdex © {new Date().getFullYear()} • Powered by MangaDex API
              </footer>
            </div>
          </Router>
        </FavouritesProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
