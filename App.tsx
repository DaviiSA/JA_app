
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import LaborItemForm from './components/LaborItemForm';
import { ContractType, ActionType, LaborEntry, FormData, STAFF_MEMBERS } from './types';

const INITIAL_FORM_DATA: FormData = {
  workOrder: '',
  contractType: null,
  selectedStaff: [],
  photos: [],
  laborEntries: [
    { id: '1', code: '', quantity: '', type: ActionType.INSTALLATION }
  ]
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStaffToggle = (staff: string) => {
    const newStaff = formData.selectedStaff.includes(staff)
      ? formData.selectedStaff.filter(s => s !== staff)
      : [...formData.selectedStaff, staff];
    setFormData({ ...formData, selectedStaff: newStaff });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const updateLaborEntry = (id: string, field: keyof LaborEntry, value: string) => {
    const newEntries = formData.laborEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setFormData({ ...formData, laborEntries: newEntries });
  };

  const addLaborEntry = () => {
    const newId = Date.now().toString();
    setFormData({
      ...formData,
      laborEntries: [...formData.laborEntries, { id: newId, code: '', quantity: '', type: ActionType.INSTALLATION }]
    });
  };

  const removeLaborEntry = (id: string) => {
    setFormData({
      ...formData,
      laborEntries: formData.laborEntries.filter(entry => entry.id !== id)
    });
  };

  const startNewEntry = () => {
    setFormData(INITIAL_FORM_DATA);
    setSummary(null);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const isWorkOrderValid = formData.workOrder.trim() !== '';
    const areLaborCodesValid = formData.laborEntries.every(entry => entry.code.trim() !== '');
    return isWorkOrderValid && areLaborCodesValid;
  };

  // Simpler, manual report generator (Removed AI)
  const generateManualReport = (data: FormData) => {
    const date = new Date().toLocaleString('pt-BR');
    let report = `RELATÓRIO DE EXECUÇÃO DE SERVIÇO - JXA LINHA VIVA\n`;
    report += `Data de Emissão: ${date}\n`;
    report += `--------------------------------------------------\n\n`;
    report += `NÚMERO DA OBRA / OS: ${data.workOrder}\n`;
    report += `TIPO DE CONTRATO: ${data.contractType || 'Não informado'}\n\n`;
    
    report += `COLABORADORES ENVOLVIDOS:\n`;
    if (data.selectedStaff.length > 0) {
      report += data.selectedStaff.map(s => `- ${s}`).join('\n') + '\n\n';
    } else {
      report += `- Nenhum colaborador selecionado\n\n`;
    }

    report += `MÃO DE OBRA EXECUTADA:\n`;
    data.laborEntries.forEach((entry, index) => {
      report += `${index + 1}. CÓDIGO: ${entry.code}\n`;
      report += `   QUANTIDADE: ${entry.quantity || 0}\n`;
      report += `   AÇÃO: ${entry.type}\n`;
      report += `   ----------------------------\n`;
    });

    report += `\nREGISTRO FOTOGRÁFICO: ${data.photos.length} imagem(ns) anexada(s).\n`;
    report += `\nFim do relatório.`;
    
    return report;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    // Simulate a brief processing delay for better UX
    setTimeout(() => {
      const result = generateManualReport(formData);
      setSummary(result);
      setLoading(false);
      
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 800);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-os-${formData.workOrder || 'servico'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isWorkOrderInvalid = showErrors && !formData.workOrder.trim();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-2xl mx-auto -mt-6 px-4">
        {!summary ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Work Order Section */}
            <section className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${isWorkOrderInvalid ? 'border-red-300' : 'border-gray-100'}`}>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Qual o número da Obra ou ordem de Serviço? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="workOrder"
                value={formData.workOrder}
                onChange={handleInputChange}
                placeholder="Digite o número da OS"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  isWorkOrderInvalid 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
              {isWorkOrderInvalid && <p className="text-xs text-red-500 mt-2 font-medium">Este campo é obrigatório para prosseguir.</p>}
            </section>

            {/* Contract Type Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Esta execução é de uma obra de contrato com a Energisa ou particular?
              </label>
              <div className="space-y-3">
                {[ContractType.ENERGISA, ContractType.PARTICULAR].map((type) => (
                  <label key={type} className="flex items-center p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors">
                    <input
                      type="radio"
                      name="contractType"
                      checked={formData.contractType === type}
                      onChange={() => setFormData({ ...formData, contractType: type })}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-3 font-medium text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Team Members Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Dentre os colaboradores abaixo marque os que estão envolvidos:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STAFF_MEMBERS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleStaffToggle(name)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      formData.selectedStaff.includes(name)
                        ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            {/* Photos Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                Registro Fotográfico
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Registre imagens das principais mãos de obras da atividade de um ângulo com o máximo de detalhes.
              </p>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-2 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Inserir arquivos de imagens</p>
                  </div>
                </label>
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {formData.photos.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Labor Codes Section (Dynamic) */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <label className="text-lg font-bold text-gray-800">Mão de Obra Executada</label>
                <button
                  type="button"
                  onClick={addLaborEntry}
                  className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Outro Código
                </button>
              </div>
              
              {formData.laborEntries.map((entry) => (
                <LaborItemForm
                  key={entry.id}
                  entry={entry}
                  onUpdate={updateLaborEntry}
                  onRemove={removeLaborEntry}
                  canRemove={formData.laborEntries.length > 1}
                  showErrors={showErrors}
                />
              ))}

              <button
                type="button"
                onClick={addLaborEntry}
                className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Registrar mais uma mão de obra
              </button>
            </section>

            {/* Submit / Action Section */}
            <div className="sticky bottom-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                  loading ? 'bg-orange-300' : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Relatório...
                  </>
                ) : (
                  'Finalizar e Gerar Relatório'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Summary View */
          <div ref={summaryRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-orange-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <span className="bg-orange-100 p-2 rounded-lg text-2xl">📋</span> 
                  Relatório de Execução
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Gerado</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                {summary}
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all active:scale-[0.98]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar Relatório (.txt)
                </button>
                
                <button 
                  onClick={startNewEntry}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-xl font-bold shadow-md hover:bg-orange-50 transition-all active:scale-[0.98]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Novo Preenchimento
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center py-8 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} JXA Linha Viva - Gestão de Atividades
      </footer>
    </div>
  );
};

export default App;
