type P = { className?: string };

/** Brand mark: a sticky note with a lifted corner, drawn by hand. */
export const LogoMark = ({ className = "" }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path
      d="M6 8.5C6 7.1 7.1 6 8.5 6h23C32.9 6 34 7.1 34 8.5v16.2c0 1 -.4 2 -1.1 2.7l-7.4 7.4c-.7.7-1.7 1.1-2.7 1.1H8.5C7.1 35.9 6 34.8 6 33.4V8.5Z"
      fill="#FFF3B0"
      stroke="#2D2D2D"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M34 27.4l-7.6 7.6c-.7.7-1.7 1.1-2.7 1.1h6.7c1.5 0 2.7-1.2 2.7-2.7v-6.7c0-1 .4-2 1.1-2.7-.7-.7-1.7.2-1.9.4Z"
      fill="#C7472D"
      stroke="#2D2D2D"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M12.5 14.5h15M12.5 20.5h11M12.5 26.5h7" stroke="#2D2D2D" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.1" />
    <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

export const PlusIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const PencilIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M4 20.2l.9-4a9 9 0 0 1 2.5-4.2l8-8a2.6 2.6 0 0 1 3.7 0l1 1a2.6 2.6 0 0 1 0 3.7l-8 8a9 9 0 0 1-4.2 2.5l-3.9.9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M14.5 6.5l3.9 3.9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TrashIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M4.5 6.5h15" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    <path
      d="M9 6.5V5a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 5v1.5"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <path
      d="M6.6 6.5l.9 12.1a2 2 0 0 0 2 1.9h5a2 2 0 0 0 2-1.9l.9-12.1"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <path d="M10.4 10.5v6M13.6 10.5v6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

export const PinIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M14.6 3.4l6 6-2.1 1.1c-.9.5-1.5 1.3-1.7 2.3l-.6 3.1c-.2.9-1 1.5-1.9 1.5h-4.6c-.9 0-1.7-.6-1.9-1.5l-.6-3.1c-.2-1-.8-1.8-1.7-2.3L3.4 9.4l6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      transform="rotate(12 12 12)"
    />
    <path d="M12 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
  </svg>
);

export const SlidersIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M4 7.5h9M18.5 7.5H20M4 16.5h4.5M14 16.5h6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="15.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2.1" />
    <circle cx="11" cy="16.5" r="2.6" stroke="currentColor" strokeWidth="2.1" />
  </svg>
);

export const CheckIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M5 12.6l4.6 4.6L19 6.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CopyIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.6" stroke="currentColor" strokeWidth="2" />
    <path d="M15.5 5.5H6.8A2.3 2.3 0 0 0 4.5 7.8v8.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
