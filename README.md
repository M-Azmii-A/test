# absenweb — Sistem Monitoring Kehadiran Guru dan Staf Berbasis Web

Aplikasi presensi guru dan staf (SDLC Waterfall) yang berjalan **langsung di GitHub Pages**:
`https://<username>.github.io/absenweb/`

## Fitur
- **Presensi Pengenalan Wajah Langsung (Face Recognition AI)**: pegawai cukup berdiri di depan kamera kiosk; sistem secara otomatis mendeteksi wajah, mencocokkan identitas pegawai dengan kecocokan tinggi, dan langsung mencatat presensi masuk/pulang tanpa perlu menyentuh layar.
- **Dua Mode Kiosk**: mode *Presensi Wajah Langsung* dan mode *Presensi Manual (Pilih Nama + PIN 4 digit)* sebagai cadangan.
- **Pendaftaran Wajah Fleksibel**: daftarkan wajah langsung dari Kiosk (dengan verifikasi PIN pegawai) atau dari menu Admin Guru & Staf (via webcam langsung atau unggah file foto pasfoto).
- **Foto + geotagging dalam satu langkah**: satu kali ambil foto langsung dibubuhi nama, waktu, dan koordinat GPS.
- **Notifikasi Suara Interaktif**: bunyi chime konfirmasi saat presensi wajah berhasil dicatat.
- **Perizinan**: pegawai mengajukan sakit/izin; Kepala Sekolah menyetujui/menolak; hari kerja yang disetujui tercatat otomatis.
- **Pemantauan lokasi**: tombol **Peta** (titik GPS di Google Maps) dan foto di Riwayat dan Dashboard.
- **Laporan bulanan** dengan pencarian nama/NIP/ID, rincian individu, dan **PDF** berkolom pengesahan.
- Peran: Administrator dan Kepala Sekolah; pengaturan jam masuk, toleransi, geofencing; mode gelap.

## Akun bawaan
| Untuk | Username / Nama | Password / PIN |
|---|---|---|
| Administrator | admin | admin123 |
| Kepala Sekolah | kepsek | kepsek123 |
| Contoh pegawai | Siti Aminah / Budi Santoso | PIN 1111 / 2222 |

Ganti password dan PIN sebelum dipakai sungguhan.

## Penting: cara data disimpan
GitHub Pages hanya hosting file statis (tanpa server/database). Karena itu data disimpan di
**IndexedDB browser** perangkat yang dipakai:
- Kiosk dan halaman admin harus dibuka di **browser dan perangkat yang sama**.
- Data tidak otomatis tersinkron ke perangkat lain. Gunakan **Pengaturan → Unduh Cadangan / Pulihkan**.
- Menghapus data situs di browser akan menghapus data presensi.
- Login berjalan di sisi browser sehingga cocok untuk demonstrasi/studi kasus, bukan keamanan tingkat produksi.

Untuk penggunaan multi-perangkat dengan database terpusat, gunakan versi Flask di folder `versi-flask/`
(dijalankan di server, mis. PythonAnywhere/Render) atau sambungkan ke layanan database seperti Supabase/Firebase.

## Deploy ke GitHub Pages
1. Letakkan `index.html`, `css/`, `js/`, `icons/`, `.nojekyll` di root repo `absenweb`.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / `(root)`.
3. Buka `https://<username>.github.io/absenweb/`. Kamera dan GPS butuh HTTPS (otomatis di GitHub Pages).
