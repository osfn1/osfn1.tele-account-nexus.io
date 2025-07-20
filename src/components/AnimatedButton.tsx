import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'scale' | 'glow' | 'slide' | 'bounce';
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'default',
  size = 'md',
  animation = 'scale',
  className,
  children,
  ...props
}) => {
  const animationClasses = {
    scale: 'transform transition-all duration-200 hover:scale-105 active:scale-95',
    glow: 'transition-all duration-300 hover:shadow-glow hover:shadow-primary/25',
    slide: 'relative overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:transform before:-translate-x-full before:transition-transform before:duration-300 hover:before:translate-x-0',
    bounce: 'transition-all duration-300 hover:animate-bounce-in'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    primary: 'bg-gradient-primary text-white hover:shadow-lg',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };

  return (
    <Button
      className={cn(
        'btn-animated relative',
        sizeClasses[size],
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};