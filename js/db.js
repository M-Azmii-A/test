'use strict';
/* Penyimpanan data di browser (IndexedDB). GitHub Pages hanya hosting statis,
   jadi seluruh data tersimpan di peramban yang dipakai. */
const STORES = ['pegawai', 'presensi', 'perizinan', 'users', 'pengaturan'];

const PENGATURAN_DEFAULT = {
    nama_sekolah: 'Sekolah Kita', jam_masuk_standar: '07:30', toleransi_menit: '15',
    sekolah_lat: '', sekolah_lng: '', radius_meter: '0',
    nama_kepala_sekolah: '', nip_kepala_sekolah: '', kota: ''
};

const DB = {
    _db: null,
    open() {
        return new Promise((res, rej) => {
            const rq = indexedDB.open('presensi-sekolah', 1);
            rq.onupgradeneeded = () => {
                const d = rq.result;
                STORES.forEach(s => {
                    if (s === 'pengaturan') d.createObjectStore(s, { keyPath: 'kunci' });
                    else d.createObjectStore(s, { keyPath: 'id', autoIncrement: true });
                });
            };
            rq.onsuccess = () => { this._db = rq.result; res(); };
            rq.onerror = () => rej(rq.error);
        });
    },
    _tx(s, mode, fn) {
        return new Promise((res, rej) => {
            const t = this._db.transaction(s, mode);
            const r = fn(t.objectStore(s));
            t.oncomplete = () => res(r && r.result);
            t.onerror = () => rej(t.error);
            t.onabort = () => rej(t.error);
        });
    },
    all(s) { return this._tx(s, 'readonly', st => st.getAll()); },
    get(s, id) { return this._tx(s, 'readonly', st => st.get(id)); },
    put(s, o) { return this._tx(s, 'readwrite', st => st.put(o)); },   // mengembalikan id
    del(s, id) { return this._tx(s, 'readwrite', st => st.delete(id)); },
    clear(s) { return this._tx(s, 'readwrite', st => st.clear()); },

    async pengaturan() {
        const rows = await this.all('pengaturan');
        const h = Object.assign({}, PENGATURAN_DEFAULT);
        rows.forEach(r => h[r.kunci] = r.nilai);
        return h;
    },
    async simpanPengaturan(obj) {
        for (const k of Object.keys(obj)) await this.put('pengaturan', { kunci: k, nilai: String(obj[k]) });
    }
};

async function hashPassword(pw, salt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function acakSalt() { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2, '0')).join(''); }
async function buatUser(username, password, nama_lengkap, role) {
    const salt = acakSalt();
    return { username, salt, hash: await hashPassword(password, salt), nama_lengkap, role, created_at: nowStr() };
}
function nowStr() { const d = new Date(); return isoTgl(d) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0'); }
function isoTgl(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

async function seedAwal() {
    const users = await DB.all('users');
    if (!users.length) {
        await DB.put('users', await buatUser('admin', 'admin123', 'Administrator', 'admin'));
        await DB.put('users', await buatUser('kepsek', 'kepsek123', 'Kepala Sekolah', 'kepala_sekolah'));
    }
    if (!(await DB.all('pengaturan')).length) await DB.simpanPengaturan(PENGATURAN_DEFAULT);
    if (!(await DB.all('pegawai')).length) {
        const contoh = [['Siti Aminah', 'guru', 'Guru Kelas 1', '1111'], ['Budi Santoso', 'guru', 'Guru Kelas 2', '2222'],
            ['Rina Wulandari', 'guru', 'Guru Mata Pelajaran', '3333'], ['Agus Prasetyo', 'staf', 'Staf Tata Usaha', '4444'],
            ['Dewi Kartika', 'staf', 'Staf Kebersihan', '5555']];
        for (const [nama, jenis, jabatan, pin] of contoh)
            await DB.put('pegawai', { nama, nip: null, jenis, jabatan, pin, status: 'aktif', created_at: nowStr() });
    }
}
