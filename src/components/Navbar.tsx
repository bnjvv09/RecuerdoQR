'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, QrCode, ShoppingCart, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Cómo funciona', href: '/#como-funciona' },
    { name: 'Productos', href: '/planes' },
    { name: 'Ejemplos', href: '/ejemplos' },
    { name: 'Preguntas', href: '/#preguntas' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path) || (path.startsWith('/#') && pathname === '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo brand left */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1">
              Recuerdo<span className="text-[#a21232] font-sans">QR</span>
              <Heart className="w-4 h-4 text-[#a21232] fill-[#a21232] animate-pulse shrink-0" />
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors duration-200 hover:text-[#a21232] ${
                  isActive(link.href) ? 'text-[#a21232]' : 'text-gray-650'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-[#a21232] transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              Panel
            </Link>
            
            {/* Shopping Cart Icon */}
            <Link
              href="/personalizar"
              className="relative cursor-pointer p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-500 hover:text-rose-600"
              title="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            <Link
              href="/personalizar"
              className="px-5 py-2.5 bg-[#a21232] hover:bg-[#880e28] text-white rounded-full text-xs font-bold transition-all duration-300 shadow-md shadow-rose-900/10 hover:shadow-rose-900/20"
            >
              Crear mi experiencia
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart on mobile */}
            <Link
              href="/personalizar"
              className="relative p-1.5 text-gray-500 hover:text-[#a21232]"
              title="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-[#a21232] transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-rose-100 bg-white shadow-inner"
          >
            <div className="space-y-1 px-4 py-4 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-rose-50/50 text-[#a21232]'
                      : 'text-gray-600 hover:bg-rose-50/20 hover:text-[#a21232]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-rose-100/50 my-4 pt-4 flex flex-col gap-3">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-[#a21232] rounded-xl text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Panel Administrador
                </Link>
                <Link
                  href="/personalizar"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3.5 bg-[#a21232] text-white rounded-full font-bold shadow-md shadow-rose-900/10 text-xs"
                >
                  Crear mi experiencia
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
