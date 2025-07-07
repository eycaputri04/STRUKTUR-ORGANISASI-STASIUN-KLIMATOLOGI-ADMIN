export interface inputProps {
  label?: string; // ✅ Tambahkan baris ini
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean; 
}
