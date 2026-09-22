'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('recuerdo_theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Por defecto modo claro, pero si el usuario prefiere oscuro en el sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('recuerdo_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full p-1.5 opacity-0" aria-hidden="true" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-full text-gray-500 hover:text-[#a21232] dark:text-gray-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-white/10 transition-colors focus:outline-none"
      title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
      aria-label="Alternar tema de la página"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      )}
    </button>
  );
}
