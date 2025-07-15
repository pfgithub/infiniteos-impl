export default function CalculatorIcon({ className = "w-12 h-12 text-white" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <rect x="8" y="7" width="8" height="3" rx="1" />
            <line x1="8" y1="14" x2="8" y2="14.01" />
            <line x1="12" y1="14" x2="12" y2="14.01" />
            <line x1="16" y1="14" x2="16" y2="14.01" />
            <line x1="8" y1="17" x2="8" y2="17.01" />
            <line x1="12" y1="17" x2="12" y2="17.01" />
            <line x1="16" y1="17" x2="16" y2="17.01" />
        </svg>
    );
}
