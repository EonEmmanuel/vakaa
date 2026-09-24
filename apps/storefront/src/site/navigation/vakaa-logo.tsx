export function VakaaLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center select-none ${className}`}>
            <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.22em] text-[#D4A43C] uppercase leading-none">
                VAKAA
            </span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.38em] text-[#A66B2D] uppercase font-sans font-semibold mt-0.5 sm:mt-1">
                OUTLET
            </span>
        </div>
    );
}
