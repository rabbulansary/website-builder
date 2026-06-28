export type ElementType = 'h' | 'p' | 'input' | 'button' | 'image';

export interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string; // in px, e.g. "24"
  textAlign?: 'left' | 'center' | 'right';
}

export interface ElementConfig {
  id: string;
  type: ElementType;
  text?: string;
  placeholder?: string;
  src?: string;
  alt?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
  style: ElementStyle;
}
