// components/ui/Button.tsx
import { type JSX, splitProps } from 'solid-js';
import { tv, type VariantProps } from 'tailwind-variants';

// 1. extend を削除し、単一のスタイルとして定義
export const buttonStyles = tv({
  base: [
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200',
    // sharedStyles と共通のフォーカスリング設定を手動で合わせる
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  ],
  variants: {
    visual: {
      solid:
        'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset]',
      outline:
        'border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-zinc-100',
      ghost: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    visual: 'solid',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;
interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export const Button = (props: ButtonProps) => {
  const [variantProps, buttonProps] = splitProps(props, [
    'visual',
    'size',
    'class',
  ]);

  return (
    <button
      {...buttonProps}
      // buttonStyles() が直接文字列を返すようになるため、エラーが解消されます
      class={buttonStyles({
        visual: variantProps.visual,
        size: variantProps.size,
        class: variantProps.class,
      })}
    />
  );
};
