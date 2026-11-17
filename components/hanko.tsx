import type { CSSProperties } from 'react';

/** A vermilion hanko stamp. Text is set vertically (right column first), as on a real seal. */
export function Hanko({ text, size = '2.6rem', solid = false, square = false, className = '' }: {
  text: string;
  size?: string;
  solid?: boolean;
  square?: boolean;
  className?: string;
}) {
  const length = [...text].length;
  const fontSize = length <= 1 ? 'calc(var(--hanko-size) * .5)' : length <= 2 ? 'calc(var(--hanko-size) * .34)' : 'calc(var(--hanko-size) * .24)';
  return (
    <span lang="ja" aria-hidden="true"
      className={`hanko ${solid ? 'hanko-solid' : ''} ${square ? 'hanko-square' : ''} ${className}`}
      style={{ '--hanko-size': size, fontSize } as CSSProperties}>
      <span className={length > 1 ? 'vertical max-h-[78%] leading-[1.05] tracking-normal' : ''}>{text}</span>
    </span>
  );
}
