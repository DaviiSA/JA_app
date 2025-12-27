
import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateServiceSummary = async (formData: FormData) => {
  const prompt = `
    Aja como um gestor de obras sênior. Com base nos dados abaixo de uma execução de serviço, gere um resumo profissional e técnico em português:
    
    - Número da Obra/OS: ${formData.workOrder}
    - Tipo de Contrato: ${formData.contractType}
    - Colaboradores Envolvidos: ${formData.selectedStaff.join(', ')}
    - Itens de Mão de Obra:
      ${formData.laborEntries.map(e => `- Código: ${e.code}, Quantidade: ${e.quantity}, Ação: ${e.type}`).join('\n')}
    
    O resumo deve ser sucinto, profissional e pronto para ser enviado como relatório.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return "Não foi possível gerar o resumo automático no momento.";
  }
};
