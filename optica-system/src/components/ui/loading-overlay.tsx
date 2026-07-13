import { cn } from "@/lib/utils";
import Logo from "@/assets/Logo.png";

type LoadingOverlayProps = {
  show: boolean;
  message?: string;
  className?: string;
};

export function LoadingOverlay({ show, message = "Procesando...", className }: LoadingOverlayProps) {
  if (!show) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-40 flex items-center justify-center bg-white/70 dark:bg-[#0a0f0a]/70 backdrop-blur-sm rounded-[inherit]",
        className
      )}
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-white/90 dark:bg-[#1a2a20]/90 border border-gray-100 dark:border-white/10 shadow-2xl">
        <BrandSpinner size="lg" />
        <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.25em] text-[#1a4731] dark:text-emerald-300">
          {message}
        </p>
      </div>
    </div>
  );
}

type BrandSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_MAP: Record<NonNullable<BrandSpinnerProps["size"]>, string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

export function BrandSpinner({ size = "md", className }: BrandSpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-[#1a4731]/15 dark:border-emerald-300/15 border-t-[#1a4731] dark:border-t-emerald-300 animate-spin",
        SIZE_MAP[size],
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Loader de página completa (o de sección) con el logo de la marca.
 * Pensado para el estado de carga inicial al entrar a un módulo.
 * Totalmente responsive y compatible con modo oscuro.
 */
export function PageLoader({ message = "Cargando módulo...", className }: { message?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 min-h-[60vh] w-full px-6 text-center",
        className
      )}
      aria-live="polite"
      role="status"
    >
      <div className="relative flex items-center justify-center">
        {/* Anillo giratorio alrededor del logo */}
        <span className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#1a4731]/10 dark:border-emerald-300/10 border-t-[#1a4731] dark:border-t-emerald-300 animate-spin" />
        <img
          src={Logo}
          alt="Opti-Samuel"
          className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-sm animate-pulse"
        />
      </div>
      <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-[#1a4731] dark:text-emerald-300">
        {message}
      </p>
    </div>
  );
}

export function InlineLoader({ message = "Cargando...", className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-6", className)}>
      <BrandSpinner size="sm" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
        {message}
      </span>
    </div>
  );
}
