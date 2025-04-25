import { ReactNode } from "react";

export interface ModalFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "date"
    | "password"
    | "custom"
    | "address";
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
  validation?: ("isEmpty" | "isPositiveInteger")[];
  param?: boolean;
  mdGrid?: number;
  [key: string]: unknown;
}

export interface ModalMessageProps<T> {
  open: boolean;
  title: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formData?: T;
  children?: ReactNode;
}