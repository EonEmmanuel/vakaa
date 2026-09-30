export function DecorativeDotCluster({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 160 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <g fill="#D4A43C" fillOpacity="0.25">
                <circle cx="20" cy="20" r="3" />
                <circle cx="40" cy="15" r="2.5" />
                <circle cx="60" cy="25" r="3" />
                <circle cx="80" cy="18" r="2" />
                <circle cx="100" cy="28" r="3.5" />
                <circle cx="120" cy="16" r="2.5" />
                <circle cx="140" cy="24" r="3" />

                <circle cx="30" cy="45" r="3.5" />
                <circle cx="50" cy="40" r="2" />
                <circle cx="70" cy="50" r="3" />
                <circle cx="90" cy="42" r="2.5" />
                <circle cx="110" cy="52" r="3" />
                <circle cx="130" cy="44" r="2" />

                <circle cx="40" cy="65" r="2.5" />
                <circle cx="60" cy="70" r="3" />
                <circle cx="80" cy="62" r="2" />
                <circle cx="100" cy="68" r="3" />
            </g>
        </svg>
    );
}
