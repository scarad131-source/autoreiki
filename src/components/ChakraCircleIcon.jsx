export default function ChakraCircleIcon({ className = "", strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* anillo exterior */}
      <circle cx="12" cy="12" r="9.5" />
      {/* anillo interior */}
      <circle cx="12" cy="12" r="4.5" />
      {/* centro */}
      <circle cx="12" cy="12" r="1.4" />
      {/* 8 radios / pétalos */}
      <line x1="12" y1="2.5" x2="12" y2="7.5" />
      <line x1="12" y1="16.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="7.5" y2="12" />
      <line x1="16.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.2" y1="5.2" x2="8.6" y2="8.6" />
      <line x1="15.4" y1="15.4" x2="18.8" y2="18.8" />
      <line x1="18.8" y1="5.2" x2="15.4" y2="8.6" />
      <line x1="8.6" y1="15.4" x2="5.2" y2="18.8" />
    </svg>
  );
}