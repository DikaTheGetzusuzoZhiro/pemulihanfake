# Roblox Account Scanner v2

Versi ini memperbaiki status avatar yang macet di “…”: avatar memakai placeholder loading yang jelas, dua endpoint thumbnail publik dicoba bergantian, ada timeout, pesan error yang spesifik, dan tombol retry.

## Deploy
Upload semua file ke GitHub, import repository di Vercel, pilih preset Other, tanpa build command. Endpoint Roblox memerlukan internet dan bisa saja dibatasi browser/network. Untuk lingkungan yang memblokir API Roblox, solusi stabil adalah menambahkan backend proxy milik sendiri; frontend ini tidak mengumpulkan login atau data privat.

## Safety
Pencarian profil publik dan avatar saja. Terminal adalah simulasi visual, tidak meretas akun, tidak meminta password/cookie, dan tidak mengubah akun.
