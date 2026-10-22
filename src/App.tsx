import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "./components/EmptyState";
import { LogoMark, PlusIcon, SearchIcon, SlidersIcon } from "./components/Icons";
import NoteCard from "./components/NoteCard";
import NoteModal from "./components/NoteModal";
import StyleGuide from "./components/StyleGuide";
import { SEED_NOTES, newId, newItemId, progressOf, type Note, type NoteColor } from "./data";

const STORE_KEY = "sticky-task/v1";
type FilterKey = "semua" | "berjalan" | "selesai" | "ditandai";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return SEED_NOTES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0 && parsed.every((n) => n && typeof n.title === "string")) {
      return parsed as Note[];
    }
  } catch {
    /* ignore corrupt storage */
  }
  return SEED_NOTES;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(notes));
    } catch {
      /* storage unavailable */
    }
  }, [notes]);

  const stats = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const n of notes) {
      const p = progressOf(n);
      done += p.done;
      total += p.total;
    }
    return { done, total };
  }, [notes]);

  const counts = useMemo(() => {
    const berjalan = notes.filter((n) => {
      const { done, total } = progressOf(n);
      return total > 0 && done < total;
    }).length;
    const selesai = notes.filter((n) => {
      const { done, total } = progressOf(n);
      return total > 0 && done === total;
    }).length;
    return { berjalan, selesai, ditandai: notes.filter((n) => n.pinned).length };
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (filter === "berjalan") {
        const { done, total } = progressOf(n);
        if (!(total > 0 && done < total)) return false;
      }
      if (filter === "selesai") {
        const { done, total } = progressOf(n);
        if (!(total > 0 && done === total)) return false;
      }
      if (filter === "ditandai" && !n.pinned) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.meta.toLowerCase().includes(q) ||
        n.items.some((i) => i.text.toLowerCase().includes(q))
      );
    });
  }, [notes, query, filter]);

  const featured = filtered.find((n) => n.pinned && n.items.length >= 5) ?? null;
  const rest = featured ? filtered.filter((n) => n.id !== featured.id) : filtered;

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (n: Note) => {
    setEditing(n);
    setModalOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        openNew();
      } else if (e.key === "Escape") {
        setGuideOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleItem = (noteId: string, itemId: string) =>
    setNotes((ns) =>
      ns.map((n) =>
        n.id === noteId
          ? { ...n, items: n.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
          : n,
      ),
    );

  const togglePin = (noteId: string) =>
    setNotes((ns) => ns.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n)));

  const deleteNote = (noteId: string) => setNotes((ns) => ns.filter((n) => n.id !== noteId));

  const saveNote = (draft: {
    title: string;
    color: NoteColor;
    pinned: boolean;
    items: string[];
    meta: string;
  }) => {
    if (editing) {
      setNotes((ns) =>
        ns.map((n) => {
          if (n.id !== editing.id) return n;
          const pool = [...n.items];
          return {
            ...n,
            title: draft.title,
            color: draft.color,
            pinned: draft.pinned,
            meta: draft.meta,
            items: draft.items.map((text) => {
              const hit = pool.findIndex((i) => i.text === text);
              if (hit >= 0) return pool.splice(hit, 1)[0];
              return { id: newItemId(), text, done: false };
            }),
          };
        }),
      );
    } else {
      setNotes((ns) => [
        {
          id: newId(),
          title: draft.title,
          color: draft.color,
          pinned: draft.pinned,
          meta: draft.meta,
          items: draft.items.map((text) => ({ id: newItemId(), text, done: false })),
        },
        ...ns,
      ]);
      setFilter("semua");
      setQuery("");
    }
    setModalOpen(false);
    setEditing(null);
  };

  const chips: { key: FilterKey; label: string; n: number }[] = [
    { key: "semua", label: "Semua", n: notes.length },
    { key: "berjalan", label: "Berjalan", n: counts.berjalan },
    { key: "selesai", label: "Selesai", n: counts.selesai },
    { key: "ditandai", label: "Ditandai", n: counts.ditandai },
  ];

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const searchBox = (
    <div className="relative w-full lg:max-w-[440px]">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <input
        ref={searchRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        aria-label="Cari catatan"
        placeholder="Cari judul atau isi checklist…"
        className="h-11 w-full rounded-full border-2 border-line bg-white pl-11 pr-12 text-[14.5px] font-semibold text-ink placeholder:font-medium placeholder:text-sub/80 shadow-[0_3px_10px_rgba(45,45,45,.06)] transition duration-200 focus:border-ink/45 focus:outline-none"
      />
      <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-paper-2 px-1.5 py-0.5 text-[11px] font-extrabold text-sub sm:block">
        /
      </kbd>
    </div>
  );

  const logo = (
    <a href="#" className="flex shrink-0 items-center gap-2.5" aria-label="Sticky Task beranda">
      <LogoMark className="h-9 w-9" />
      <span className="leading-none">
        <span className="block font-display text-[21px] font-semibold tracking-[-0.03em]">
          Sticky Task
        </span>
        <span className="mt-[3px] block text-[9px] font-extrabold uppercase tracking-[0.2em] text-sub">
          catatan tempel harian
        </span>
      </span>
    </a>
  );

  const buttons = (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        className="hidden h-11 items-center gap-2 rounded-full border-2 border-line bg-white px-4 text-[13px] font-extrabold text-ink/70 transition duration-200 hover:border-ink/40 hover:text-ink sm:flex"
      >
        <SlidersIcon className="h-[17px] w-[17px]" />
        Style Guide
      </button>
      <button
        type="button"
        onClick={openNew}
        className="flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-[13.5px] font-extrabold text-paper shadow-[0_8px_18px_-7px_rgba(45,45,45,.65)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-8px_rgba(45,45,45,.7)] active:translate-y-0 sm:px-5"
      >
        <PlusIcon className="h-[18px] w-[18px]" />
        Catatan Baru
      </button>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="paper-grid min-h-screen">
        {/* ---------------- navbar ---------------- */}
        <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-6 lg:py-4">
            {logo}
            <div className="order-last w-full lg:order-none lg:w-auto lg:flex-1">{searchBox}</div>
            <div className="ml-auto lg:ml-0">{buttons}</div>
          </div>
        </header>

        {/* ---------------- filter ribbon ---------------- */}
        <div className="sticky top-[124px] z-30 border-b border-line bg-white/75 backdrop-blur-md lg:top-[76px]">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => {
                const active = filter === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setFilter(c.key)}
                    aria-pressed={active}
                    className={
                      active
                        ? "rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-extrabold tracking-[0.03em] text-paper"
                        : "rounded-full border-2 border-line bg-white px-3.5 py-1.5 text-[12px] font-extrabold tracking-[0.03em] text-ink/75 transition duration-200 hover:border-ink/40 hover:bg-paper-2 hover:text-ink"
                    }
                  >
                    {c.label}
                    <span className={active ? "ml-1.5 tabular-nums opacity-75" : "ml-1.5 tabular-nums text-sub"}>
                      {c.n}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="ml-auto flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] tabular-nums text-sub">
              <span className="hidden sm:inline">{notes.length} catatan ·</span>
              <span className="text-ink">
                {stats.done}/{stats.total}
              </span>
              tugas selesai
            </p>
          </div>
          <div className="perf-line" />
        </div>

        {/* ---------------- board ---------------- */}
        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sub">
                {dateStr}
              </p>
              <h1 className="mt-1.5 font-display text-[36px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[46px]">
                Papan Catatan
              </h1>
            </div>
            <p className="max-w-[36ch] text-[14.5px] font-medium leading-relaxed text-sub">
              Centang satu per satu. Saat centang terakhir, kartu terlipat di sudutnya dan
              tersegel{" "}
              <span className="font-extrabold text-brick">Selesai</span>.
            </p>
          </div>

          {notes.length === 0 ? (
            <EmptyState variant="empty" query="" onAction={openNew} />
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="noresult"
              query={query}
              onAction={() => {
                setQuery("");
                setFilter("semua");
              }}
            />
          ) : (
            <>
              <AnimatePresence>
                {featured && (
                  <NoteCard
                    key={featured.id}
                    note={featured}
                    index={0}
                    wide
                    onToggleItem={(itemId) => toggleItem(featured.id, itemId)}
                    onEdit={() => openEdit(featured)}
                    onDelete={() => deleteNote(featured.id)}
                    onTogglePin={() => togglePin(featured.id)}
                  />
                )}
              </AnimatePresence>

              <div className="gap-x-5 sm:columns-2 xl:columns-3 2xl:columns-4">
                <AnimatePresence>
                  {rest.map((n, i) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      index={i}
                      onToggleItem={(itemId) => toggleItem(n.id, itemId)}
                      onEdit={() => openEdit(n)}
                      onDelete={() => deleteNote(n.id)}
                      onTogglePin={() => togglePin(n.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>

        {/* ---------------- FAB (mobile) ---------------- */}
        <button
          type="button"
          onClick={openNew}
          aria-label="Catatan baru"
          className="fixed bottom-6 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-[0_14px_30px_-8px_rgba(45,45,45,.65)] transition duration-200 hover:-translate-y-1 active:translate-y-0 lg:hidden"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        <NoteModal
          open={modalOpen}
          note={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={saveNote}
        />

        <StyleGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-line bg-white/60 px-4 py-7 sm:px-6"
        >
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[13.5px] italic text-sub">
              Sticky Task — ditempel, dicentang, selesai.
            </p>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sub">
              Tekan <span className="text-ink">N</span> untuk catatan baru ·{" "}
              <span className="text-ink">/</span> untuk mencari
            </p>
          </div>
        </motion.footer>
      </div>
    </MotionConfig>
  );
}
