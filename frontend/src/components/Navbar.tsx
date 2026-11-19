import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-revora-black/90 backdrop-blur-md border-b border-revora-charcoal px-6 lg:px-12 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex flex-col items-center">
        <span className="font-serif text-2xl tracking-[0.25em] font-bold text-revora-white">
          RÉVORA
        </span>
        <span className="text-[9px] tracking-[0.4em] text-revora-gray uppercase">
          Design • Print • Wear
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8 text-sm tracking-widest text-revora-white uppercase font-medium">
        <Link href="/" className="hover:text-revora-burgundy transition-colors">Home</Link>
        <Link href="#shop" className="hover:text-revora-burgundy transition-colors">Shop</Link>
        <Link href="#custom" className="hover:text-revora-burgundy transition-colors">Custom Design</Link>
        <Link href="#about" className="hover:text-revora-burgundy transition-colors">About</Link>
      </nav>

      {/* Action Icons */}
      <div className="flex items-center space-x-6 text-revora-white">
        <button aria-label="Search" className="hover:text-revora-burgundy transition-colors"><Search size={20} /></button>
        <button aria-label="User Account" className="hover:text-revora-burgundy transition-colors"><User size={20} /></button>
        <div className="relative">
          <button aria-label="Shopping Bag" className="hover:text-revora-burgundy transition-colors"><ShoppingBag size={20} /></button>
          <span className="absolute -top-2 -right-2 bg-revora-burgundy text-revora-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </div>
      </div>
    </header>
  );
}