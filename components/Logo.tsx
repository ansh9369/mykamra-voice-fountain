import Link from "next/link";

export function PoweredByMykamra({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 opacity-80 ${className}`}>
      Powered by{" "}
      <Link
        href="https://mykamra.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-pulse-violet hover:underline transition-colors"
      >
        MyKamra
      </Link>
      {/* <span className="text-[11px] uppercase tracking-[0.18em]">Powered by</span> */}
      {/* <span className="font-semibold tracking-tight">MyKamra</span> */}
    </span>
  );
}
