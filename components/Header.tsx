
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-[#F37021] pt-8 pb-12 px-4 shadow-lg rounded-b-3xl">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Mocked Logo based on user image */}
        <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-black mb-6 w-48 h-48 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-6xl font-black text-black leading-none mb-1 flex items-baseline">
            J<span className="text-[#F37021] relative -top-2 mx-1">⚡</span>A
          </div>
          <div className="bg-black text-white text-xs font-bold tracking-widest px-2 py-1 uppercase mt-1 w-full text-center">
            Linha Viva
          </div>
          <div className="text-[10px] text-gray-600 mt-2 font-medium italic text-center leading-tight">
            A CONFIANÇA EM CONHECER
          </div>
        </div>
        <h1 className="text-white text-2xl font-bold text-center drop-shadow-md">
          Execução de Serviço por Mão de Obra
        </h1>
      </div>
    </div>
  );
};

export default Header;
