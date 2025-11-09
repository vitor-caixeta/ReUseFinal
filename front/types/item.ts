export type Item = {
  id: number;
  title: string;
  description: string | null;
  type: "doacao" | "troca" | string;
  imageUrl?: string | null;

  usageTime?: string | null;       
  reason?: string | null;          
  price?: number | null;          
  openToTrade?: boolean | null;  
};
