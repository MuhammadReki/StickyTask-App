import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  COLOR_LABEL,
  COLOR_ORDER,
  COLORS,
  newItemId,
  type Note,
  type NoteColor,
} from "../data";
import { cn } from "../utils/cn";
import { CloseIcon, PlusIcon, TrashIcon } from "./Icons";

const EASE = [0.2, 0.8, 0.25, 1] as const;

type Row = { id: string; text: string };

type Props = {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (draft: { title: string; color: NoteColor; pinned: boolean; items: string[]; meta: string }) => void;
};

export default function NoteModal({ open, note, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<NoteColor>("yellow");
  const [pinned, setPinned] = useState(false);
  const [meta, setMeta] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (note) {
      setTitle(note.title);
      setColor(note.color);
      setPinned(note.pinned);
      setMeta(note.meta);
      setRows(note.items.map((i) => ({ id: i.id, text: i.text })));
    } else {
      setTitle("");
      setColor(COLOR_ORDER[Math.floor(Math.random() * COLOR_ORDER.length)]);
      setPinned(false);
      setMeta("");
      setRows([
        { id: newItemId(), text: "" },
        { id: newItemId(), text: "" },
      ]);
    }
    setError("");
    const t = setTimeout(() => titleRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open, note]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const fail = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 420);
    titleRef.current?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanRows = rows.map((r) => r.text.trim()).filter(Boolean);
    if (!cleanTitle) return fail("Beri judul catatan dulu.");
    if (cleanRows.length === 0) return fail("Tambahkan minimal satu item checklist.");
    onSave({ title: cleanTitle, color, pinned, items: cleanRows, meta: meta.trim() || "Baru dibuat" });
  };

  const hex = COLORS[color];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-[3px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={note ? "Edit catatan" : "Catatan baru"}
            initial={{ opacity: 0, scale: 0.92, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ background: hex }}
            className="grain relative w-full max-w-lg rounded-t-3xl pt-9 shadow-pop sm:rounded-3xl"
          >
            <span className="tape -top-[13px]" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup dialog"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/55 text-ink/60 transition hover:bg-white hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="thin-scroll max-h-[72vh] overflow-y-auto px-6 pb-7 sm:px-7">
            <form onSubmit={submit}>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/70">
                {note ? "Edit catatan" : "Catatan baru"}
              </p>
              <h2 className="mt-1 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em]">
                {note ? "Perbarui catatan" : "Tempel catatan"}
              </h2>

              <motion.div animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                <label className="mt-6 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/70">
                  Judul tugas
                </label>
                <input
                  ref={titleRef}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError("");
                  }}
                  maxLength={70}
                  placeholder="Mis. Belanja mingguan"
                  className="mt-2 w-full rounded-xl border-2 border-ink/12 bg-white/60 px-4 py-3 text-[16px] font-bold text-ink placeholder:font-medium placeholder:text-ink/35 transition focus:border-ink/45 focus:bg-white/85 focus:outline-none"
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/55">
                      Warna kertas
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COLOR_ORDER.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          aria-label={COLOR_LABEL[c]}
                          aria-pressed={color === c}
                          className={cn(
                            "h-9 w-9 rounded-full border-2 transition duration-200",
                            color === c
                              ? "scale-110 border-ink"
                              : "border-white/70 hover:scale-105",
                          )}
                          style={{ background: COLORS[c], boxShadow: "0 2px 6px rgba(45,45,45,.14)" }}
                        >
                          {color === c && (
                            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-ink" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/70">
                      Keterangan
                    </label>
                    <input
                      value={meta}
                      onChange={(e) => setMeta(e.target.value)}
                      maxLength={40}
                      placeholder="Mis. Tenggat Jumat"
                      className="mt-2 w-full rounded-xl border-2 border-ink/12 bg-white/60 px-3.5 py-2.5 text-[14px] font-semibold text-ink placeholder:font-medium placeholder:text-ink/35 transition focus:border-ink/45 focus:bg-white/85 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/70">
                    Item checklist · {rows.filter((r) => r.text.trim()).length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPinned((p) => !p)}
                    aria-pressed={pinned}
                    className={cn(
                      "rounded-full border-2 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] transition duration-200",
                      pinned
                        ? "border-brick bg-brick text-white"
                        : "border-ink/25 bg-white/50 text-ink/70 hover:border-ink/45 hover:text-ink",
                    )}
                  >
                    {pinned ? "Ditandai penting" : "Tandai penting"}
                  </button>
                </div>

                <ul className="mt-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {rows.map((row, i) => (
                      <motion.li
                        key={row.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="flex items-center gap-2.5"
                      >
                        <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 border-ink/30 bg-white/60 text-[10px] font-extrabold tabular-nums text-ink/70">
                          {i + 1}
                        </span>
                        <input
                          value={row.text}
                          placeholder="Apa yang perlu dikerjakan?"
                          onChange={(e) =>
                            setRows((rs) =>
                              rs.map((r) => (r.id === row.id ? { ...r, text: e.target.value } : r)),
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              setRows((rs) => [...rs, { id: newItemId(), text: "" }]);
                            }
                          }}
                          className="min-w-0 flex-1 rounded-xl border-2 border-transparent bg-white/45 px-3.5 py-2.5 text-[14.5px] font-semibold text-ink placeholder:font-medium placeholder:text-ink/35 transition focus:border-ink/35 focus:bg-white/85 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== row.id) : rs))}
                          aria-label={`Hapus item ${i + 1}`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/35 transition hover:bg-brick/12 hover:text-brick"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>

              <button
                type="button"
                onClick={() => setRows((rs) => [...rs, { id: newItemId(), text: "" }])}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/22 py-3 text-[13px] font-extrabold text-ink/70 transition hover:border-ink/45 hover:bg-white/45 hover:text-ink"
              >
                <PlusIcon className="h-4 w-4" /> Tambah item
              </button>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="mt-3 rounded-lg bg-brick/12 px-3 py-2 text-[13px] font-bold text-brick"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border-2 border-ink/15 bg-white/50 py-3.5 text-[14px] font-extrabold text-ink/65 transition hover:bg-white hover:text-ink sm:w-auto sm:flex-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-ink py-3.5 text-[14px] font-extrabold text-paper shadow-[0_8px_18px_-6px_rgba(45,45,45,.55)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-8px_rgba(45,45,45,.6)] active:translate-y-0 sm:w-auto sm:flex-[1.4]"
                >
                  {note ? "Simpan perubahan" : "Tempel ke papan"}
                </button>
              </div>
            </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
