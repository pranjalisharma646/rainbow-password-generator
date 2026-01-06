import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn(
      "glass-card rounded-2xl p-8 shadow-2xl",
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
