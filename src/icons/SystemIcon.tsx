
export default function SystemIcon({ className = "h-5 w-5 flex-shrink-0" }) {

    return (

        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">

            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>

            <rect x="3" y="4" width="18" height="12" rx="1" />

            <line x1="7" y1="20" x2="17" y2="20" />

            <line x1="9" y1="16" y2="20" />

            <line x1="15" y1="16" y2="20" />

        </svg>

    );

}

