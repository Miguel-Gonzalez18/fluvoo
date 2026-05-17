export interface CurrencyInputProps {
  id: string;
  value: number | undefined;
  onChange: (val: number) => void;
  placeholder?: string;
}
