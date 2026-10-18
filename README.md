# Roblox Account Scanner — Visual Simulation

Website statis bertema Roblox dengan pencarian username publik, avatar thumbnail, terminal animasi, progress bar, hasil simulasi, dan efek suara opsional.

## Menjalankan
Buka `index.html` di browser. Pencarian avatar membutuhkan internet dan memakai endpoint publik Roblox untuk mencari user ID serta thumbnail. Jika layanan Roblox/CORS tidak tersedia, UI menampilkan status unavailable, bukan avatar palsu.

## Deploy ke Vercel
1. Upload semua file ke GitHub.
2. Import repository di https://vercel.com/new
3. Gunakan preset `Other`, tanpa build command dan tanpa output directory khusus.
4. Deploy.

## Batasan
Scan adalah animasi visual saja. Tidak ada login, pengumpulan password/cookie, atau upaya mengakses akun privat. Avatar diambil dari endpoint thumbnail publik Roblox.
