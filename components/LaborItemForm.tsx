
import React from 'react';
import { LaborEntry, ActionType } from '../types';

interface LaborItemFormProps {
  entry: LaborEntry;
  onUpdate: (id: string, field: keyof LaborEntry, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  showErrors?: boolean;
}

const LaborItemForm: React.FC<LaborItemFormProps> = ({ entry, onUpdate, onRemove, canRemove, showErrors }) => {
  const isCodeInvalid = showErrors && !entry.code.trim();

  return (
    <div className={`bg-gray-50 border rounded-xl p-4 mb-4 relative transition-all ${isCodeInvalid ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-orange-200'}`}>
      {canRemove && (
        <button 
          onClick={() => onRemove(entry.id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Qual o código da mão de obra? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={entry.code}
            onChange={(e) => onUpdate(entry.id, 'code', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
              isCodeInvalid 
                ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
            }`}
            placeholder="Ex: MO-001"
          />
          {isCodeInvalid && <p className="text-[10px] text-red-500 mt-1 font-medium">Este campo é obrigatório</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Qual a quantidade?</label>
          <input
            type="number"
            value={entry.quantity}
            onChange={(e) => onUpdate(entry.id, 'quantity', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="0"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Foi uma instalação ou remoção?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={`action-${entry.id}`}
              value={ActionType.INSTALLATION}
              checked={entry.type === ActionType.INSTALLATION}
              onChange={() => onUpdate(entry.id, 'type', ActionType.INSTALLATION)}
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Instalação</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={`action-${entry.id}`}
              value={ActionType.REMOVAL}
              checked={entry.type === ActionType.REMOVAL}
              onChange={() => onUpdate(entry.id, 'type', ActionType.REMOVAL)}
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Remoção</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LaborItemForm;
