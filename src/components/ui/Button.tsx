// src/components/ui/Button.tsx
import { type JSX, splitProps } from 'solid-js';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonStyles = tv({
  base: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 h-11 px-4 py-2',
  variants: {
    variant: {
      primary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-sm',
      secondary:
        'bg-zinc-950 text-zinc-100 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
    },
    size: {
      sm: 'h-9 px-3 text-xs',
      md: 'h-11 px-4 py-2',
      lg: 'h-12 px-6 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;
interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  children?: JSX.Element;
}

export const Button = (props: ButtonProps) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'class',
    'children',
  ]);
  return (
    <button
      {...rest}
      class={buttonStyles({
        variant: local.variant,
        size: local.size,
        class: local.class,
      })}
    >
      {local.children}
    </button>
  );
};
