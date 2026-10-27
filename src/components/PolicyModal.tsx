import React from 'react';
import { X, ShieldCheck, Truck, Lock, Phone, Mail, MapPin } from 'lucide-react';

interface PolicyModalProps {
  policy: 'shipping' | 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policy, onClose }) => {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#121217] border border-[#252535] max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
          <h3 className="font-brand text-lg font-bold text-white tracking-wider">
            {policy === 'shipping' && 'SHIPPING, EXCHANGE & RETURN POLICY'}
            {policy === 'privacy' && 'PATRON PRIVACY & DATA SECURITY'}
            {policy === 'terms' && 'TERMS OF ATELIER ACQUISITION'}
            {policy === 'contact' && 'CONCIERGE & ATELIER VISITS'}
          </h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-light">
          {policy === 'shipping' && (
            <>
              <p>
                <strong className="text-white font-medium">Pan-India Express Dispatch:</strong> Every
                CHHAVA creation is inspected by our senior master tailors in Mumbai and dispatched via
                Express Air couriers (Delhivery, Blue Dart, Express Logistics).
              </p>
              <p>
                <strong className="text-white font-medium">Transit Timelines:</strong> Metro cities (Mumbai,
                Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai) receive delivery within 24 to 48 hours. Non-metro
                destinations are fulfilled within 3 to 4 business days.
              </p>
              <p>
                <strong className="text-white font-medium">7-Day Complimentary Exchange:</strong> If a garment
                does not provide your ideal fit or drape, notify us within 7 days of delivery for a seamless
                doorstep reverse pickup and replacement sizing.
              </p>
              <p>
                <strong className="text-white font-medium">Cash on Delivery (COD):</strong> Available across
                27,000+ Indian PIN codes without any handling fee on orders above ₹999.
              </p>
            </>
          )}

          {policy === 'privacy' && (
            <>
              <p>
                <strong className="text-white font-medium">Uncompromising Patron Privacy:</strong> CHHAVA
                respects your sovereignty. We will never sell, lease, or distribute patron contact information
                or order histories to external marketing aggregators.
              </p>
              <p>
                <strong className="text-white font-medium">PCI-DSS Payment Compliance:</strong> All online
                transactions are securely tokenized through our integration with Razorpay. CHHAVA never stores
                or handles raw credit card numbers or UPI MPIN credentials on our servers.
              </p>
              <p>
                <strong className="text-white font-medium">Data Retention:</strong> Order shipping manifests
                are retained solely to fulfill tax compliance requirements and warranty claims.
              </p>
            </>
          )}

          {policy === 'terms' && (
            <>
              <p>
                <strong className="text-white font-medium">Authenticity Guarantee:</strong> Each CHHAVA
                garment is delivered with our tamper-proof gold-crested authenticity tag. Fabric blends are
                certified as stated on individual garment spec sheets.
              </p>
              <p>
                <strong className="text-white font-medium">Limited Edition Numbering:</strong> Certain runway
                and bespoke traditional pieces are produced in strictly limited batch sizes (100 pieces). Once
                sold out, they will not be re-issued in the same colorway.
              </p>
              <p>
                <strong className="text-white font-medium">Custom Orders & Alterations:</strong> Bespoke
                custom length alterations can be requested by reaching out to our concierge before dispatch.
              </p>
            </>
          )}

          {policy === 'contact' && (
            <div className="space-y-4">
              <p>
                Connect directly with our atelier styling team or track an existing custom booking.
              </p>
              <div className="bg-[#181822] p-4 border border-[#2b2b3b] space-y-2">
                <p className="flex items-center gap-2 text-white font-medium">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>Flagship Atelier: Saswad, Pune, Maharashtra 412301</span>
                </p>
                <p className="flex items-center gap-2 text-white font-medium">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>concierge@chhava.in / support@chhava.in</span>
                </p>
                <p className="flex items-center gap-2 text-white font-medium">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>+91 98814 56041 (Mon-Sat 10:00 AM – 7:00 PM IST)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#20202c] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
