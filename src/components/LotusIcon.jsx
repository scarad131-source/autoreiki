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
      {/* pétalo central */}
      <path d="M12 14 C 10.8 10 10.8 6.5 12 3 C 13.2 6.5 13.2 10 12 14" />
      {/* pétalos internos */}
      <path d="M12 14 C 10.5 11.5 9.2 8.5 8.5 5.5 C 10 8 11.2 11 12 14" />
      <path d="M12 14 C 13.5 11.5 14.8 8.5 15.5 5.5 C 14 8 12.8 11 12 14" />
      {/* pétalos medios */}
      <path d="M12 14 C 9.5 12.8 7 11 5.5 8 C 7.5 9.8 10 11.5 12 14" />
      <path d="M12 14 C 14.5 12.8 17 11 18.5 8 C 16.5 9.8 14 11.5 12 14" />
      {/* pétalos exteriores */}
      <path d="M12 14 C 8.5 13.5 6 12.5 3.5 11 C 6 12 9 13 12 14" />
      <path d="M12 14 C 15.5 13.5 18 12.5 20.5 11 C 18 12 15 13 12 14" />
      {/* base curva que acuna la flor */}
      <path d="M3 15.5 Q 12 20.5 21 15.5" />
    </svg>
  );
}