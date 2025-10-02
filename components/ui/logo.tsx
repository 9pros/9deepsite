import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showText?: boolean;
}

export function Logo({ className, variant = 'dark', showText = true }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-[#020205]' : 'text-white';
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className="w-10 h-10 bg-[#375CEC] rounded-lg flex items-center justify-center font-bold text-white text-xl">
          9
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#375CEC] rounded-full"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-xl leading-none', textColor)}>
            9Pros
          </span>
          <span className={cn('text-xs opacity-70 leading-none', textColor)}>
            AI Website Builder
          </span>
        </div>
      )}
    </div>
  );
}