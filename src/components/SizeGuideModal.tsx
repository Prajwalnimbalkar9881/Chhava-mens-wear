import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler, Check } from 'lucide-react';

interface SizeRow {
  size: string;
  chestIn: string;
  chestCm: string;
  shoulderIn: string;
  shoulderCm: string;
  lengthIn: string;
  lengthCm: string;
  waistIn: string;
  waistCm: string;
}

const SIZE_CHART_DATA: SizeRow[] = [
  { size: 'XS', chestIn: '36"', chestCm: '91 cm', shoulderIn: '16.5"', shoulderCm: '42 cm', lengthIn: '27.5"', lengthCm: '70 cm', waistIn: '28-30"', waistCm: '71-76 cm' },
  { size: 'S', chestIn: '38"', chestCm: '96 cm', shoulderIn: '17.2"', shoulderCm: '44 cm', lengthIn: '28.5"', lengthCm: '72 cm', waistIn: '30-32"', waistCm: '76-81 cm' },
  { size: 'M', chestIn: '40"', chestCm: '102 cm', shoulderIn: '18.0"', shoulderCm: '46 cm', lengthIn: '29.5"', lengthCm: '75 cm', waistIn: '32-34"', waistCm: '81-86 cm' },
  { size: 'L', chestIn: '42"', chestCm: '107 cm', shoulderIn: '18.8"', shoulderCm: '48 cm', lengthIn: '30.5"', lengthCm: '77 cm', waistIn: '34-36"', waistCm: '86-91 cm' },
  { size: 'XL', chestIn: '44"', chestCm: '112 cm', shoulderIn: '19.5"', shoulderCm: '50 cm', lengthIn: '31.5"', lengthCm: '80 cm', waistIn: '36-38"', waistCm: '91-96 cm' },
  { size: 'XXL', chestIn: '46"', chestCm: '117 cm', shoulderIn: '20.2"', shoulderCm: '51 cm', lengthIn: '32.5"', lengthCm: '82 cm', waistIn: '38-40"', waistCm: '96-102 cm' },
];

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#121217] border border-[#252535] max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-brand text-lg font-bold text-white tracking-wider">
              CHHAVA SIZING & MEASUREMENT ARCHIVE
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-zinc-400 font-light">
            All garments are engineered to regular Indian sizing standards with relaxed comfort tolerances.
          </p>

          <div className="flex bg-[#191924] p-1 border border-[#2b2b3b]">
            <button
              onClick={() => setUnit('inches')}
              className={`py-1 px-3 text-xs font-semibold uppercase ${
                unit === 'inches' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`py-1 px-3 text-xs font-semibold uppercase ${
                unit === 'cm' ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#20202c] overflow-x-auto mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181822] text-[#d4af37] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Chest Circumference</th>
                <th className="p-3">Shoulder Width</th>
                <th className="p-3">Body Length</th>
                <th className="p-3">Waist (Trousers)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e28] text-zinc-300">
              {SIZE_CHART_DATA.map(row => (
                <tr key={row.size} className="hover:bg-[#181822]">
                  <td className="p-3 font-bold text-white bg-[#14141c]">{row.size}</td>
                  <td className="p-3">{unit === 'inches' ? row.chestIn : row.chestCm}</td>
                  <td className="p-3">{unit === 'inches' ? row.shoulderIn : row.shoulderCm}</td>
                  <td className="p-3">{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                  <td className="p-3">{unit === 'inches' ? row.waistIn : row.waistCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Tips */}
        <div className="p-4 bg-[#161620] border border-[#262634] space-y-2 text-xs text-zinc-300">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#d4af37]">
            How to Measure For a Perfect Royal Drape:
          </h4>
          <ul className="space-y-1 list-disc pl-4 text-zinc-400 font-light">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape level under your arms.</li>
            <li><strong>Shoulder:</strong> Measure straight across the back from the edge of one shoulder bone to the other.</li>
            <li><strong>Kurtas & Overcoats:</strong> Designed with 2-3 inches of ease over body chest measurement for fluid grace.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
