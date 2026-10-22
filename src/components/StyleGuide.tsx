import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { COLOR_LABEL, COLOR_ORDER, COLORS } from "../data";
import { cn } from "../utils/cn";
import { CloseIcon, CopyIcon } from "./Icons";

const EASE = [0.2, 0.8, 0.25, 1] as const;

const NEUTRALS: { name: string; hex: string; use: string }[] = [
  { name: "Ink", hex: "#2D2D2D", use: "Teks utama, garis, ikon" },
  { name: "Sub", hex: "#6B6B6B", use: "Teks bacaan sekunder" },
  { name: "Muted", hex: "#8A8A8A", use: "Label dekoratif & placeholder" },
  { name: "Line", hex: "#E4E4E9", use: "Garis & border" },
  { name: "Paper", hex: "#FAFAFA", use: "Latar aplikasi" },
  { name: "Brick", hex: "#C7472D", use: "Aksen tegas: hapus, penting" },
];

const SCALE = [
  ["11", "11px", "Label small-caps"],
  ["13", "13px", "Meta & keterangan"],
  ["16", "16px", "Isi checklist"],
  ["20", "20px", "Judul kartu besar"],
  ["25", "25px", "Judul bagian"],
  ["31", "31px", "Judul dialog"],
  ["39", "39px", "Judul halaman"],
];

const SPACING = [4, 8, 12, 16, 24, 32, 48];
const RADII = [
  ["8px", "rounded-lg", "Checkbox & tombol ikon"],
  ["16px", "rounded-2xl", "Kartu sticky note"],
  ["24px", "rounded-3xl", "Dialog & panel"],
  ["999px", "rounded-full", "Chip, tombol utama"],
];

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line px-6 py-7">
      <p className="text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-muted">{label}</p>
      <h3 className="mb-4 mt-1 font-display text-[21px] font-semibold tracking-[-0.02em]">{title}</h3>
      {children}
    </section>
  );
}

/** Static mini-preview of a note card in one of the three documented states. */
function StateNote({ state }: { state: "default" | "hover" | "checked" }) {
  const done = state === "checked";
  const rows: [string, boolean][] =
    state === "checked"
      ? [
          ["Bangun pukul 06.00", true],
          ["Minum air putih", true],
          ["Stretching 10 menit", false],
        ]
      : [
          ["Bangun pukul 06.00", true],
          ["Minum air putih", false],
          ["Stretching 10 menit", false],
        ];

  const pct = state === "hover" ? 33 : state === "checked" ? 67 : 33;

  return (
    <div>
      <div
        style={
          {
            background: "#C8F7DC",
            "--rot": "-2deg",
            transform:
              state === "hover" ? "rotate(0deg) translateY(-4px)" : "rotate(-2deg)",
            boxShadow:
              state === "hover"
                ? "0 18px 34px -10px rgba(45,45,45,.2), 0 6px 12px rgba(45,45,45,.08)"
                : "0 4px 14px rgba(45,45,45,.08), 0 1px 3px rgba(45,45,45,.06)",
          } as React.CSSProperties
        }
        className="grain relative rounded-2xl px-4 pb-3.5 pt-6"
      >
        <span className="tape tape-sm -top-[11px]" />
        <div className="flex items-center gap-2">
          <h4 className="relative text-[14px] font-extrabold leading-snug">
            Rutinitas Pagi
            <span
              aria-hidden
              className="absolute -bottom-[3px] left-0 h-[4px] w-full origin-left rounded-full bg-brick/45"
              style={{ transform: done ? "scaleX(1)" : "scaleX(0)" }}
            />
          </h4>
          {done && (
            <span className="rounded-full border-[1.5px] border-brick/70 px-1.5 py-[1px] text-[8px] font-extrabold uppercase tracking-[0.14em] text-brick">
              Selesai
            </span>
          )}
        </div>
        <ul className="mt-3 space-y-1">
          {rows.map(([t, d]) => (
            <li key={t} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full border-2",
                  d ? "border-ink bg-ink" : "border-ink/30 bg-white/55",
                )}
              >
                {d && (
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5">
                    <path
                      d="M5 12.6l4.6 4.6L19 6.8"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className={cn("relative text-[12px] font-semibold leading-snug", d && "opacity-45")}>
                {t}
                <span
                  className="absolute left-0 top-[53%] h-[1.5px] w-full origin-left rounded-full bg-ink/75"
                  style={{ transform: d ? "scaleX(1)" : "scaleX(0)" }}
                />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-ink/70" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] tabular-nums text-ink/70">
            {done ? "2/3" : "1/3"} selesai
          </span>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
        {state === "default" ? "Default" : state === "hover" ? "Hover" : "Checked"}
      </p>
    </div>
  );
}

function DesktopMock() {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-line bg-white shadow-[0_6px_18px_rgba(45,45,45,.08)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-paper-2 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-brick/70" />
        <span className="h-2 w-2 rounded-full bg-st-yellow" />
        <span className="h-2 w-2 rounded-full bg-st-mint" />
        <span className="ml-2 h-3.5 flex-1 rounded-full bg-white" />
      </div>
      <div className="bg-paper">
        <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-2">
          <span className="h-3.5 w-3.5 rounded-[3px] bg-st-yellow ring-1 ring-ink/25" />
          <span className="h-1.5 w-16 rounded-full bg-ink/45" />
          <span className="ml-auto h-4 w-14 rounded-full bg-ink" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-2.5">
          {[
            ["#FFF3B0", 2],
            ["#FFD6E0", 3],
            ["#C8F7DC", 2],
            ["#CDE7FF", 3],
            ["#E4D4FF", 2],
            ["#FFF3B0", 3],
          ].map(([c, n], i) => (
            <div key={i} className="rounded-md p-1.5" style={{ background: c as string }}>
              <span className="mb-1.5 block h-1.5 w-3/4 rounded-full bg-ink/50" />
              {Array.from({ length: n as number }).map((_, k) => (
                <span key={k} className="mb-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full border border-ink/50" />
                  <span className="h-1 w-4/5 rounded-full bg-ink/25" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="w-[118px] shrink-0 rounded-[20px] border-[5px] border-ink bg-white p-1 shadow-[0_8px_20px_rgba(45,45,45,.16)]">
      <div className="relative overflow-hidden rounded-[14px] bg-paper">
        <span className="absolute left-1/2 top-1 h-1 w-8 -translate-x-1/2 rounded-full bg-ink/70" />
        <div className="mt-3.5 flex items-center gap-1 px-1.5 pb-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-st-yellow ring-1 ring-ink/25" />
          <span className="h-1.5 w-8 rounded-full bg-ink/45" />
          <span className="ml-auto h-3.5 w-3.5 rounded-full bg-ink" />
        </div>
        <div className="space-y-1.5 p-1.5">
          {[
            ["#CDE7FF", 3],
            ["#FFF3B0", 2],
            ["#FFD6E0", 3],
          ].map(([c, n], i) => (
            <div key={i} className="rounded-md p-1.5" style={{ background: c as string }}>
              <span className="mb-1 block h-1.5 w-3/4 rounded-full bg-ink/50" />
              {Array.from({ length: n as number }).map((_, k) => (
                <span key={k} className="mb-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full border border-ink/50" />
                  <span className="h-1 w-4/5 rounded-full bg-ink/25" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full bg-ink shadow-md" />
      </div>
    </div>
  );
}

export default function StyleGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Tutup style guide"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Style guide Sticky Task"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.36, ease: EASE }}
            className="thin-scroll absolute right-0 top-0 h-full w-full max-w-[420px] overflow-y-auto bg-paper shadow-[-24px_0_60px_-30px_rgba(45,45,45,.5)]"
          >
            <div className="relative h-[168px] overflow-hidden bg-paper-2">
              <img
                src="images/flatlay.jpg"
                alt="Foto flat-lay catatan tempel pastel di atas meja"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/45 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup style guide"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink/70 backdrop-blur transition hover:bg-white hover:text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-ink/70">
                  Referensi desain
                </p>
                <h2 className="font-display text-[30px] font-semibold leading-none tracking-[-0.025em]">
                  Style Guide
                </h2>
              </div>
            </div>

            <Section label="01 · Warna" title="Palet pastel & netral">
              <div className="space-y-2">
                {COLOR_ORDER.map((c) => (
                  <button
                    key={c}
                    onClick={() => copy(COLORS[c])}
                    className="group flex w-full items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5 text-left transition hover:border-ink/30"
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-ink/10"
                      style={{ background: COLORS[c] }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-extrabold">{COLOR_LABEL[c]}</span>
                      <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                        Kertas catatan
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 font-display text-[13px] tabular-nums text-ink/70">
                      {COLORS[c]}
                      <CopyIcon className="h-3.5 w-3.5 text-muted transition group-hover:text-ink" />
                    </span>
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {NEUTRALS.map((n) => (
                    <button
                      key={n.hex}
                      onClick={() => copy(n.hex)}
                      className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2 text-left transition hover:border-ink/30"
                    >
                      <span
                        className="h-7 w-7 shrink-0 rounded-md ring-1 ring-ink/10"
                        style={{ background: n.hex }}
                      />
                      <span className="min-w-0">
                        <span className="block text-[12px] font-extrabold">{n.name}</span>
                        <span className="block font-display text-[11px] tabular-nums text-muted">{n.hex}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            <Section label="02 · Tipografi" title="Fraunces × Nunito">
              <div className="rounded-xl border border-line bg-white p-4">
                <p className="font-display text-[31px] font-semibold leading-none tracking-[-0.03em]">
                  Tempel, centang, selesai.
                </p>
                <p className="mt-2 text-[13.5px] text-muted">
                  Fraunces untuk judul & angka. Nunito untuk seluruh isi antarmuka.
                </p>
              </div>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
                {SCALE.map(([px, size, use]) => (
                  <li key={px} className="flex items-center gap-3 px-3 py-2">
                    <span className="w-9 shrink-0 font-display text-[12px] tabular-nums text-muted">{size}</span>
                    <span
                      className="min-w-0 flex-1 truncate font-display text-ink"
                      style={{ fontSize: `${Math.min(Number(px), 25)}px`, lineHeight: 1.15 }}
                    >
                      Papan Catatan
                    </span>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                      {use}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {["400", "600", "700", "800"].map((w) => (
                  <span
                    key={w}
                    className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold border border-line"
                    style={{ fontWeight: w }}
                  >
                    Nunito {w}
                  </span>
                ))}
              </div>
            </Section>

            <Section label="03 · Ruang & sudut" title="Spacing, radius, shadow">
              <div className="rounded-xl border border-line bg-white p-4">
                {SPACING.map((s) => (
                  <div key={s} className="mb-2 flex items-center gap-3 last:mb-0">
                    <span className="w-10 shrink-0 font-display text-[12px] tabular-nums text-muted">{s}px</span>
                    <span className="h-3 rounded-[3px] bg-st-yellow ring-1 ring-ink/10" style={{ width: s * 3 }} />
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {RADII.map(([r, cls, use]) => (
                  <div key={r} className="rounded-xl border border-line bg-white p-3">
                    <div className={cn("mb-2 h-9 w-full bg-st-blue ring-1 ring-ink/10", cls)} />
                    <p className="font-display text-[13px] font-semibold">{r}</p>
                    <p className="text-[10.5px] font-bold text-muted">{use}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["Lembut", "0 4px 14px rgba(45,45,45,.08)"],
                  ["Terangkat", "0 18px 34px -10px rgba(45,45,45,.2)"],
                  ["Pop", "0 28px 64px -20px rgba(45,45,45,.38)"],
                ].map(([name, sh]) => (
                  <div key={name} className="rounded-xl border border-line bg-white p-3">
                    <div className="mb-3 h-11 rounded-lg bg-st-pink" style={{ boxShadow: sh }} />
                    <p className="text-center text-[10.5px] font-extrabold uppercase tracking-[0.1em]">{name}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section label="04 · Status kartu" title="Default · Hover · Checked">
              <div className="grid grid-cols-3 gap-3">
                <StateNote state="default" />
                <StateNote state="hover" />
                <StateNote state="checked" />
              </div>
            </Section>

            <Section label="05 · Mockup" title="Desktop & seluler">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <DesktopMock />
                  <p className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
                    Desktop · 3–4 kolom masonry
                  </p>
                </div>
                <div>
                  <PhoneMock />
                  <p className="mt-2 text-center text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
                    Seluler · 1 kolom + FAB
                  </p>
                </div>
              </div>
            </Section>

            <Section label="06 · Aturan" title="Do & don't">
              <ul className="space-y-2 text-[13.5px] leading-relaxed">
                {[
                  "Rotasi kartu antara -3° sampai +3° — jangan pernah rata sempurna.",
                  "Teks selalu #2D2D2D di atas kertas pastel agar kontras tetap aman.",
                  "Sembunyikan ikon edit/hapus sampai kartu di-hover (selalu terlihat di sentuhan).",
                  "Satu kartu boleh jadi lebar penuh untuk tugas yang paling menekan.",
                  "Jangan pakai bayangan keras atau sudut siku — ini kertas, bukan logam.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brick" />
                    <span className="font-medium text-ink/80">{t}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <div className="border-t border-line px-6 py-6">
              <p className="font-display text-[13px] italic text-muted">
                Sticky Task — sistem desain v1.0, dibangun dengan HTML, CSS & JavaScript.
              </p>
            </div>
          </motion.aside>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-extrabold text-paper shadow-lg"
              >
                {copied} tersalin
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
