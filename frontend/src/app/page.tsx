import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-revora-black text-revora-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-center px-6 bg-gradient-to-b from-revora-black via-revora-charcoal/20 to-revora-black border-b border-revora-charcoal">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-revora-burgundy font-semibold">
            Custom Hoodies & Printing
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wider text-revora-white leading-tight">
            YOUR VISION.<br />OUR DESIGN.
          </h1>
          <p className="text-revora-gray max-w-xl mx-auto text-sm md:text-base font-light tracking-wide">
            High-quality hoodies, custom prints, and unique designs made for your style. Wear your story into something real.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#shop" 
              className="w-full sm:w-auto bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              Shop Now
            </Link>
            <Link 
              href="#custom" 
              className="w-full sm:w-auto border border-revora-white/20 hover:border-revora-burgundy text-revora-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              Custom Design
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Hoodies Grid (Connected to Backend API) */}
      <ProductGrid />

      {/* Custom Order Banner */}
      <section id="custom" className="py-20 px-6 lg:px-12 bg-revora-charcoal/30 border-t border-revora-charcoal">
        <div className="max-w-5xl mx-auto bg-revora-charcoal p-10 md:p-16 rounded-xl border border-revora-charcoal flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-revora-burgundy">Bring Your Idea to Life</span>
            <h2 className="font-serif text-2xl md:text-3xl text-revora-white">Custom Print & Embroidery</h2>
            <p className="text-revora-gray text-sm max-w-md">
              Send us your designs, logos, or ideas—we will bring it to life with premium quality and perfect detail.
            </p>
          </div>
          <button className="bg-revora-burgundy hover:bg-revora-burgundy-dark text-revora-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold whitespace-nowrap transition-colors">
            Start Custom Order
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-revora-black border-t border-revora-charcoal py-12 px-6 lg:px-12 text-center text-xs text-revora-gray space-y-4">
        <span className="font-serif text-lg tracking-[0.3em] text-revora-white block">RÉVORA</span>
        <p className="tracking-widest uppercase">© 2026 Révora Design • Print • Wear. All rights reserved.</p>
      </footer>
    </main>
  );
}