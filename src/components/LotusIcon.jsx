export default function LotusIcon({ className = "", strokeWidth = 2, ...props }) {
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
      {/* borde circular */}
      <circle cx="12" cy="12" r="8.5" />
      {/* pétalo central (más alto) */}
      <path d="M12 12 C 11 9.5 11 7 12 5 C 13 7 13 9.5 12 12" />
      {/* pétalos internos */}
      <path d="M12 12 C 10.5 10.5 9.2 8.8 8.5 7 C 9.8 8.2 11 9.8 12 12" />
      <path d="M12 12 C 13.5 10.5 14.8 8.8 15.5 7 C 14.2 8.2 13 9.8 12 12" />
      {/* pétalos exteriores (más bajos) */}
      <path d="M12 12 C 9.5 11.2 7.2 10.8 5.5 9.5 C 7.5 9.8 9.8 10.2 12 12" />
      <path d="M12 12 C 14.5 11.2 16.8 10.8 18.5 9.5 C 16.5 9.8 14.2 10.2 12 12" />
      {/* rayos de la base */}
      <path d="M9.4 20.2 7.6 22" />
      <path d="M14.6 20.2 16.4 22" />
    </svg>
  );
}