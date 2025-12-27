
export enum ContractType {
  ENERGISA = 'Contrato com a Energisa',
  PARTICULAR = 'Particular'
}

export enum ActionType {
  INSTALLATION = 'Instalação',
  REMOVAL = 'Remoção'
}

export interface LaborEntry {
  id: string;
  code: string;
  quantity: string;
  type: ActionType;
}

export interface FormData {
  workOrder: string;
  contractType: ContractType | null;
  selectedStaff: string[];
  photos: string[];
  laborEntries: LaborEntry[];
}

export const STAFF_MEMBERS = ['Binho', 'Bosco', 'Dudu', 'Ninho', 'Loia', 'Gabriel'];
