import React from 'react';
import { X } from 'lucide-react';
import TicketReceipt from '../TicketReceipt';
import { CartItem } from '../../types';

interface AdminReceiptModalProps {
  items: CartItem[];
  total?: number;
  onClose: () => void;
}

const AdminReceiptModal: React.FC<AdminReceiptModalProps> = ({ items, total, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-gray-100 rounded-2xl w-full max-w-sm h-fit max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-scale-in">
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Recibo del Cliente</h3>
                <button onClick={onClose} className="p-2 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-gray-50 flex justify-center pb-8 p-4">
               {/* Usamos origin-top para que reduzca sin cortarse si la pantalla es pequeña */}
               <div className="origin-top flex justify-center w-full">
                  <div className="w-full max-w-[400px]">
                      <TicketReceipt cart={items} total={total} />
                  </div>
               </div>
            </div>
        </div>
    </div>
  )
}
export default AdminReceiptModal;
