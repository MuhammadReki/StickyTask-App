import { AnimatePresence, motion } from "framer-motion";
import { COLORS, progressOf, rotationFor, type Note } from "../data";
import { cn } from "../utils/cn";
import { PencilIcon, PinIcon, TrashIcon } from "./Icons";

const EASE = [0.2, 0.8, 0.25, 1] as const;

type Props = {
  note: Note;
  index: number;
  wide?: boolean;
  onToggleItem: (itemId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
};

function Check({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "mt-[1px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-200",
        done ? "border-ink bg-ink" : "border-ink/30 bg-white/55",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[11px] w-[11px]" aria-hidden="true">
        <path
          d="M5 12.6l4.6 4.6L19 6.8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="26"
          strokeDashoffset={done ? 0 : 26}
          style={{ transition: "stroke-dashoffset 260ms cubic-bezier(.2,.8,.25,1)" }}
        />
      </svg>
    </span>
  );
}

export default function NoteCard({
  note,
  index,
  wide = false,
  onToggleItem,
  onEdit,
  onDelete,
  onTogglePin,
}: Props) {
  const { total, done, pct } = progressOf(note);
  const complete = total > 0 && done === total;
  const hex = COLORS[note.color];

  const items = (
    <ul className={cn(wide && "sm:columns-2 sm:gap-x-8")}>
      {note.items.map((it) => (
        <li key={it.id} className={cn("break-inside-avoid", wide && "mb-1")}>
          <button
            type="button"
            onClick={() => onToggleItem(it.id)}
            aria-pressed={it.done}
            className="group/item -mx-1 flex w-full items-start gap-2.5 rounded-lg px-1.5 py-[7px] text-left transition-colors duration-150 hover:bg-white/45"
          >
            <Check done={it.done} />
            <span
              className={cn(
                "relative text-[14.5px] font-semibold leading-[1.42] transition-opacity duration-200",
                it.done ? "opacity-45" : "opacity-100",
              )}
            >
              {it.text}
              <span
                aria-hidden
                className="absolute left-0 top-[53%] h-[1.5px] w-full origin-left rounded-full bg-ink/75"
                style={{
                  transform: it.done ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 300ms cubic-bezier(.2,.8,.25,1)",
                }}
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  const actions = (
    <div className="flex items-center gap-1 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <button
        type="button"
        onClick={onTogglePin}
        aria-label={note.pinned ? "Lepas tanda penting" : "Tandai penting"}
        title={note.pinned ? "Lepas penting" : "Tandai penting"}
        className={cn(
          "grid h-8 w-8 place-items-center rounded-lg transition-colors duration-150",
          note.pinned
            ? "bg-brick/15 text-brick"
            : "text-ink/55 hover:bg-white/60 hover:text-ink",
        )}
      >
        <PinIcon className="h-[17px] w-[17px]" />
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit catatan ${note.title}`}
        title="Edit"
        className="grid h-8 w-8 place-items-center rounded-lg text-ink/55 transition-colors duration-150 hover:bg-white/60 hover:text-ink"
      >
        <PencilIcon className="h-[17px] w-[17px]" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Hapus catatan ${note.title}`}
        title="Hapus"
        className="grid h-8 w-8 place-items-center rounded-lg text-ink/55 transition-colors duration-150 hover:bg-brick/12 hover:text-brick"
      >
        <TrashIcon className="h-[17px] w-[17px]" />
      </button>
    </div>
  );

  const fold = (
    <AnimatePresence>
      {complete && (
        <motion.span
          initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.34, ease: EASE }}
          style={{ transformOrigin: "100% 100%" }}
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-11 w-11 overflow-hidden rounded-br-2xl"
        >
          <span
            className="absolute inset-0 [clip-path:polygon(100%_0,0_100%,100%_100%)]"
            style={{ background: hex }}
          />
          <span
            className="absolute inset-0 [clip-path:polygon(100%_0,0_100%,100%_100%)]"
            style={{
              background:
                "linear-gradient(315deg, rgba(45,45,45,.26) 0%, rgba(45,45,45,.10) 55%, rgba(45,45,45,.04) 100%)",
            }}
          />
        </motion.span>
      )}
    </AnimatePresence>
  );

  const stamp = (
    <AnimatePresence initial={false}>
      {complete && (
        <motion.span
          initial={{ opacity: 0, scale: 0.55, rotate: 14 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          exit={{ opacity: 0, scale: 0.55 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="inline-flex shrink-0 items-center rounded-full border-[1.5px] border-brick/70 px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-brick"
        >
          Selesai
        </motion.span>
      )}
    </AnimatePresence>
  );

  const titleBlock = (
    <div className="flex min-w-0 items-center gap-2.5">
      <h3 className="relative min-w-0 text-[17px] font-extrabold leading-snug tracking-[-0.015em]">
        <span className="relative">{note.title}</span>
        <span
          aria-hidden
          className="absolute -bottom-[3px] left-0 h-[5px] w-full origin-left rounded-full bg-brick/45"
          style={{
            transform: complete ? "scaleX(1) rotate(-0.4deg)" : "scaleX(0)",
            transition: "transform 520ms cubic-bezier(.2,.8,.25,1)",
          }}
        />
      </h3>
      {stamp}
    </div>
  );

  const shell = cn(
    "note-card grain group relative rounded-2xl",
    wide ? "px-5 pb-5 pt-8 sm:px-7 sm:pb-6 sm:pt-9" : "px-5 pb-4 pt-7",
  );

  const content = wide ? (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,16.5rem)_1fr]">
      <div className="sm:border-r sm:border-ink/10 sm:pr-6">
        {note.pinned && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brick/12 px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-brick">
            <PinIcon className="h-3 w-3" /> Penting
          </span>
        )}
        {titleBlock}
        <p className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink/70">
          {note.meta}
        </p>

        <div className="mt-5 flex items-end gap-2">
          <span className="font-display text-[54px] font-semibold leading-[0.8] tabular-nums text-ink">
            {pct}
            <span className="text-[26px]">%</span>
          </span>
          <span className="pb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/70">
            selesai
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-ink/75"
            style={{ width: `${pct}%`, transition: "width 450ms cubic-bezier(.2,.8,.25,1)" }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] tabular-nums text-ink/70">
            {done}/{total} tugas
          </span>
          {actions}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-ink/70">
          Checklist
        </p>
        {items}
      </div>
    </div>
  ) : (
    <>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {titleBlock}
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/70">
            {note.meta}
          </p>
        </div>
        {note.pinned && !complete && (
          <PinIcon className="mt-[3px] h-4 w-4 shrink-0 -rotate-12 text-brick" />
        )}
      </div>

      <div className="mt-3.5">{items}</div>

      <div className="mt-4 border-t border-ink/10 pt-3">
        <div className="flex items-center gap-3">
          <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-ink/70"
              style={{ width: `${pct}%`, transition: "width 450ms cubic-bezier(.2,.8,.25,1)" }}
            />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] tabular-nums whitespace-nowrap text-ink/70">
            {done}/{total} selesai
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-display text-[15px] font-semibold tabular-nums text-ink/70">
            {pct}%
          </span>
          {actions}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.86,
        y: 6,
        transition: { duration: 0.26, ease: EASE, delay: 0 },
      }}
      transition={{ duration: 0.34, ease: EASE, delay: Math.min(index * 0.045, 0.45) }}
      className={cn("mb-5 w-full break-inside-avoid", wide && "mb-6")}
    >
      <article
        style={{ ...({ "--rot": `${rotationFor(note.id)}deg` } as React.CSSProperties), background: hex }}
        className={shell}
        aria-label={`Catatan ${note.title}`}
      >
        <span className={cn("tape -top-[13px]", wide && "hidden")} />
        {wide && (
          <>
            <span className="tape tape-left -top-[13px]" />
            <span className="tape tape-right -top-[13px]" />
          </>
        )}
        {content}
        {fold}
      </article>
    </motion.div>
  );
}
