export type NoteColor = "yellow" | "pink" | "mint" | "blue" | "purple";

export type ChecklistItem = { id: string; text: string; done: boolean };

export type Note = {
  id: string;
  title: string;
  color: NoteColor;
  meta: string;
  pinned: boolean;
  items: ChecklistItem[];
};

export const COLORS: Record<NoteColor, string> = {
  yellow: "#FFF3B0",
  pink: "#FFD6E0",
  mint: "#C8F7DC",
  blue: "#CDE7FF",
  purple: "#E4D4FF",
};

export const COLOR_LABEL: Record<NoteColor, string> = {
  yellow: "Kuning",
  pink: "Pink",
  mint: "Mint",
  blue: "Biru",
  purple: "Ungu",
};

export const COLOR_ORDER: NoteColor[] = ["yellow", "pink", "mint", "blue", "purple"];

let seq = 0;
const uid = (prefix = "i") => `${prefix}${Date.now().toString(36)}${(seq++).toString(36)}`;

const mk = (texts: [string, boolean][]): ChecklistItem[] =>
  texts.map(([text, done]) => ({ id: uid(), text, done }));

export const SEED_NOTES: Note[] = [
  {
    id: "n-tugas-besar",
    title: "Tugas Besar Pemrograman Web",
    color: "blue",
    meta: "Tenggat Jumat, 17.00",
    pinned: true,
    items: mk([
      ["Rancang skema database", true],
      ["Buat halaman login & register", true],
      ["Integrasi API catatan", false],
      ["Tulis dokumentasi README", false],
      ["Uji tampilan di peramban seluler", false],
      ["Gladi bersih presentasi 10 menit", false],
    ]),
  },
  {
    id: "n-belanja",
    title: "Belanja Mingguan",
    color: "yellow",
    meta: "Sabtu · Pasar Minggu",
    pinned: false,
    items: mk([
      ["Beras 5 kg", true],
      ["Telur 1 kg", true],
      ["Sayur bayam", false],
      ["Buah jeruk", false],
      ["Sabun cuci piring", false],
      ["Susu kotak", false],
    ]),
  },
  {
    id: "n-pagi",
    title: "Rutinitas Pagi",
    color: "mint",
    meta: "Setiap hari · 06.00",
    pinned: false,
    items: mk([
      ["Bangun pukul 06.00", true],
      ["Minum air putih", true],
      ["Stretching 10 menit", false],
      ["Baca 5 halaman", false],
      ["Tulis rencana hari ini", true],
    ]),
  },
  {
    id: "n-rapat",
    title: "Rapat Tim Produk Senin",
    color: "pink",
    meta: "Senin · 09.30 · Ruang Anggur",
    pinned: true,
    items: mk([
      ["Siapkan ringkasan sprint", true],
      ["Tinjau feedback pengguna", false],
      ["Bahas jadwal rilis 2.4", false],
      ["Catat keputusan & pemilik tugas", false],
    ]),
  },
  {
    id: "n-tagihan",
    title: "Bayar Tagihan",
    color: "purple",
    meta: "Selesai · 03 Feb",
    pinned: false,
    items: mk([
      ["Listrik", true],
      ["Internet rumah", true],
      ["Air", true],
      ["Langganan cloud", true],
    ]),
  },
  {
    id: "n-buku",
    title: "Baca Buku Februari",
    color: "blue",
    meta: "Target · 240 halaman",
    pinned: false,
    items: mk([
      ["Selesai bab 1–5", true],
      ["Bab 6–10", false],
      ["Rangkum jadi 10 catatan", false],
    ]),
  },
  {
    id: "n-konten",
    title: "Ide Konten Instagram",
    color: "pink",
    meta: "Draft · 4 ide",
    pinned: false,
    items: mk([
      ["Carousel tips produktivitas", false],
      ["Reels meja kerja 15 detik", false],
      ["Foto flat-lay catatan tempel", false],
      ["Balas komentar minggu ini", false],
    ]),
  },
  {
    id: "n-weekend",
    title: "Rencana Weekend",
    color: "yellow",
    meta: "Sabtu & Minggu",
    pinned: false,
    items: mk([
      ["Sarapan di kafe baru", false],
      ["Cuci sepeda", true],
      ["Telepon orang tua", false],
      ["Rapikan kamar", false],
    ]),
  },
];

/** Deterministic natural tilt between -3° and +3°, stable per note id. */
export function rotationFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((((h % 61) + 61) % 61) - 30) / 10;
}

export const progressOf = (n: Note) => {
  const total = n.items.length;
  const done = n.items.filter((i) => i.done).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
};

export const newId = () => uid("n-");
export const newItemId = () => uid("i-");
