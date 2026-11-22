'use client';

import { useState, useEffect } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

type Unit = 'cm' | 'in';
type GarmentTab = 'tops' | 'bottoms';

const TOPS_DATA = [
  { size: 'S', chestCm: 116, lengthCm: 67, shoulderCm: 56, sleeveCm: 60 },
  { size: 'M', chestCm: 122, lengthCm: 70, shoulderCm: 58, sleeveCm: 62 },
  { size: 'L', chestCm: 128, lengthCm: 73, shoulderCm: 60, sleeveCm: 64 },
  { size: 'XL', chestCm: 134, lengthCm: 76, shoulderCm: 62, sleeveCm: 66 },
  { size: 'XXL', chestCm: 140, lengthCm: 78, shoulderCm: 64, sleeveCm: 67 },
];

const BOTTOMS_DATA = [
  { size: 'S', waistCm: 76, hipCm: 106, inseamCm: 76, thighCm: 66 },
  { size: 'M', waistCm: 81, hipCm: 111, inseamCm: 78, thighCm: 69 },
  { size: 'L', waistCm: 86, hipCm: 116, inseamCm: 80, thighCm: 72 },
  { size: 'XL', waistCm: 91, hipCm: 121, inseamCm: 81, thighCm: 75 },
  { size: 'XXL', waistCm: 96, hipCm: 126, inseamCm: 82, thighCm: 78 },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
  defaultCategory = '',
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<Unit>('cm');
  const [activeTab, setActiveTab] = useState<GarmentTab>('tops');

  useEffect(() => {
    const lower = defaultCategory.toLowerCase();
    if (lower.includes('pant') || lower.includes('cargo') || lower.includes('bottom') || lower.includes('short')) {
      setActiveTab('bottoms');
    } else {
      setActiveTab('tops');
    }
  }, [defaultCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatMeasurement = (cmValue: number) => {
    if (unit === 'cm') return `${cmValue} cm`;
    return `${(cmValue / 2.54).toFixed(1)}"`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-revora-black border border-revora-charcoal rounded-lg shadow-2xl overflow-hidden text-revora-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-revora-charcoal">
          <div className="flex items-center gap-2.5">
            <Ruler size={18} className="text-revora-burgundy" />
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase">
                Révora Atelier Size Guide
              </h2>
              <p className="text-[11px] text-revora-gray">
                Garment measurements laid flat — relaxed luxury streetwear silhouette
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="text-revora-gray hover:text-revora-white p-1 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls: Garment Tab + Unit Toggle */}
        <div className="px-6 pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-revora-charcoal/40 border border-revora-charcoal rounded p-1">
            <button
              type="button"
              onClick={() => setActiveTab('tops')}
              className={`px-4 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
                activeTab === 'tops'
                  ? 'bg-revora-burgundy text-revora-white'
                  : 'text-revora-gray hover:text-revora-white'
              }`}
            >
              Tops & Hoodies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bottoms')}
              className={`px-4 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
                activeTab === 'bottoms'
                  ? 'bg-revora-burgundy text-revora-white'
                  : 'text-revora-gray hover:text-revora-white'
              }`}
            >
              Bottoms & Cargos
            </button>
          </div>

          <div className="flex items-center bg-revora-charcoal/40 border border-revora-charcoal rounded p-1">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded text-[11px] uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
                unit === 'cm'
                  ? 'bg-revora-white text-revora-black'
                  : 'text-revora-gray hover:text-revora-white'
              }`}
            >
              CM
            </button>
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded text-[11px] uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
                unit === 'in'
                  ? 'bg-revora-white text-revora-black'
                  : 'text-revora-gray hover:text-revora-white'
              }`}
            >
              IN
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="p-6 overflow-x-auto">
          {activeTab === 'tops' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-revora-charcoal text-[11px] uppercase tracking-widest text-revora-gray">
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Chest</th>
                  <th className="py-3 px-3">Length</th>
                  <th className="py-3 px-3">Shoulder</th>
                  <th className="py-3 px-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-revora-charcoal/50 text-xs">
                {TOPS_DATA.map((row) => (
                  <tr key={row.size} className="hover:bg-revora-charcoal/25 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-revora-white">{row.size}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.chestCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.lengthCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.shoulderCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.sleeveCm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-revora-charcoal text-[11px] uppercase tracking-widest text-revora-gray">
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Waist</th>
                  <th className="py-3 px-3">Hip</th>
                  <th className="py-3 px-3">Inseam</th>
                  <th className="py-3 px-3">Thigh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-revora-charcoal/50 text-xs">
                {BOTTOMS_DATA.map((row) => (
                  <tr key={row.size} className="hover:bg-revora-charcoal/25 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-revora-white">{row.size}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.waistCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.hipCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.inseamCm)}</td>
                    <td className="py-3.5 px-3 text-revora-gray">{formatMeasurement(row.thighCm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Fit Note Footer */}
        <div className="px-6 py-4 bg-revora-charcoal/20 border-t border-revora-charcoal flex items-start gap-3 text-xs text-revora-gray">
          <Sparkles size={15} className="text-revora-burgundy flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-revora-white font-semibold">Fit Guidance:</span> Révora Design silhouettes feature an intentional drop-shoulder, boxy streetwear drape. Take your usual size for the signature relaxed fit, or size down one for a closer tailored profile.
          </p>
        </div>
      </div>
    </div>
  );
}