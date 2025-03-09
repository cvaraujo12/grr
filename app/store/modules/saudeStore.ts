import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SaudeTypes } from '@/app/types';
import { generateId, getCurrentDate } from '../utils';

// Interface do estado de saúde
interface SaudeState {
  medicacoes: SaudeTypes.Medicacao[];
  registrosHumor: SaudeTypes.RegistroHumor[];
  
  // Ações - Medicação
  adicionarMedicacao: (nome: string, horarios: string[], observacoes?: string) => void;
  removerMedicacao: (id: string) => void;
  atualizarMedicacao: (id: string, medicacao: Partial<SaudeTypes.Medicacao>) => void;
  registrarMedicacaoTomada: (idMedicacao: string, dataHorario: string, tomada: boolean) => void;
  
  // Ações - Humor
  adicionarRegistroHumor: (
    humor: SaudeTypes.RegistroHumor['humor'], 
    hora: string, 
    observacoes?: string
  ) => void;
  removerRegistroHumor: (id: string) => void;
  atualizarRegistroHumor: (id: string, registro: Partial<SaudeTypes.RegistroHumor>) => void;
  
  // Seletores
  getMedicacoesParaHoje: () => SaudeTypes.Medicacao[];
  getRegistrosHumorPorData: (data: string) => SaudeTypes.RegistroHumor[];
  getRegistrosHumorRecentes: (dias: number) => SaudeTypes.RegistroHumor[];
  getMedicacaoPendente: () => { medicacao: SaudeTypes.Medicacao, horario: string }[];
}

// Criação da store com persistência local
export const useSaudeStore = create<SaudeState>()(
  persist(
    (set, get) => ({
      medicacoes: [],
      registrosHumor: [],
      
      adicionarMedicacao: (nome, horarios, observacoes) => 
        set((state) => ({
          medicacoes: [
            ...state.medicacoes, 
            { 
              id: generateId(), 
              nome, 
              horarios,
              tomada: {},
              observacoes
            }
          ],
        })),
      
      removerMedicacao: (id) =>
        set((state) => ({
          medicacoes: state.medicacoes.filter((med) => med.id !== id),
        })),
      
      atualizarMedicacao: (id, medicacao) =>
        set((state) => ({
          medicacoes: state.medicacoes.map((med) =>
            med.id === id ? { ...med, ...medicacao } : med
          ),
        })),
      
      registrarMedicacaoTomada: (idMedicacao, dataHorario, tomada) =>
        set((state) => ({
          medicacoes: state.medicacoes.map((med) => {
            if (med.id === idMedicacao) {
              return {
                ...med,
                tomada: {
                  ...med.tomada,
                  [dataHorario]: tomada
                }
              };
            }
            return med;
          }),
        })),
      
      adicionarRegistroHumor: (humor, hora, observacoes) => 
        set((state) => ({
          registrosHumor: [
            ...state.registrosHumor, 
            { 
              id: generateId(), 
              data: getCurrentDate(),
              hora,
              humor,
              observacoes
            }
          ],
        })),
      
      removerRegistroHumor: (id) =>
        set((state) => ({
          registrosHumor: state.registrosHumor.filter((reg) => reg.id !== id),
        })),
      
      atualizarRegistroHumor: (id, registro) =>
        set((state) => ({
          registrosHumor: state.registrosHumor.map((reg) =>
            reg.id === id ? { ...reg, ...registro } : reg
          ),
        })),
      
      getMedicacoesParaHoje: () => {
        return get().medicacoes;
      },
      
      getRegistrosHumorPorData: (data) => {
        return get().registrosHumor.filter(reg => reg.data === data);
      },
      
      getRegistrosHumorRecentes: (dias) => {
        const hoje = new Date();
        const dataLimite = new Date();
        dataLimite.setDate(hoje.getDate() - dias);
        
        return get().registrosHumor.filter(reg => {
          const dataReg = new Date(reg.data);
          return dataReg >= dataLimite;
        });
      },
      
      getMedicacaoPendente: () => {
        const hoje = getCurrentDate();
        const result: { medicacao: SaudeTypes.Medicacao, horario: string }[] = [];
        
        get().medicacoes.forEach(medicacao => {
          medicacao.horarios.forEach(horario => {
            const chave = `${hoje}-${horario}`;
            if (!medicacao.tomada[chave]) {
              result.push({ medicacao, horario });
            }
          });
        });
        
        return result;
      }
    }),
    {
      name: 'saude-storage',
      partialize: (state) => ({ 
        medicacoes: state.medicacoes,
        registrosHumor: state.registrosHumor
      }),
    }
  )
); 