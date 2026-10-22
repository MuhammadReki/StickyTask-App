type Props = { variant: "empty" | "noresult"; query: string; onAction: () => void };

export default function EmptyState({ variant, query, onAction }: Props) {
  const empty = variant === "empty";

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-line bg-paper-2/70">
      <img
        src="images/empty-board.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-multiply"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper-2/85 via-paper-2/55 to-paper-2/85" />
      <div className="paper-grid-soft pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex flex-col items-center px-6 py-14 text-center sm:py-20">
        <svg viewBox="0 0 210 160" className="h-auto w-[190px] sm:w-[230px]" aria-hidden="true">
          <g transform="rotate(-9 62 96)">
            <rect x="16" y="52" width="94" height="94" rx="11" fill="#E4D4FF" stroke="#2D2D2D" strokeWidth="3" />
          </g>
          <g transform="rotate(7 148 92)">
            <rect x="102" y="46" width="94" height="94" rx="11" fill="#C8F7DC" stroke="#2D2D2D" strokeWidth="3" />
          </g>
          <g transform="rotate(-2 105 84)">
            <rect x="56" y="30" width="100" height="104" rx="11" fill="#FFF3B0" stroke="#2D2D2D" strokeWidth="3" />
            <rect
              x="86"
              y="20"
              width="44"
              height="22"
              rx="2"
              fill="#FFFFFF"
              fillOpacity="0.6"
              stroke="#2D2D2D"
              strokeWidth="2.4"
              transform="rotate(-3 108 31)"
            />
            <circle cx="74" cy="66" r="7" fill="none" stroke="#2D2D2D" strokeWidth="3" />
            <path d="M70.5 66.3l2.6 2.7 5-5.6" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
            <path d="M90 66h52" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <circle cx="74" cy="92" r="7" fill="none" stroke="#2D2D2D" strokeWidth="3" />
            <path d="M90 92h44" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <circle cx="74" cy="118" r="7" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeDasharray="3 4" />
            <path d="M90 118h30" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
          </g>
        </svg>

        <h2 className="mt-7 font-display text-[27px] font-semibold leading-tight tracking-[-0.02em] sm:text-[33px]">
          {empty ? "Papan masih kosong" : "Tidak ada yang cocok"}
        </h2>
        <p className="mt-2.5 max-w-[38ch] text-[15px] font-medium leading-relaxed text-sub">
          {empty
            ? "Belum ada catatan tempel di sini. Mulai dari satu tugas kecil — sisanya menyusul sendiri."
            : (
                <>
                  Tidak ada catatan yang cocok dengan{" "}
                  <span className="rounded bg-st-yellow px-1.5 py-0.5 font-bold text-ink">“{query}”</span>.
                  Coba kata kunci lain, misalnya “belanja”.
                </>
              )}
        </p>
        {empty && (
          <button
            type="button"
            onClick={onAction}
            className="mt-7 rounded-xl bg-ink px-6 py-3.5 text-[14px] font-extrabold text-paper shadow-[0_10px_22px_-8px_rgba(45,45,45,.6)] transition duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Tempel catatan pertama
          </button>
        )}
      </div>
    </section>
  );
}
