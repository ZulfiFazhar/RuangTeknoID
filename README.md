# Ruang Teknologi Indonesia

Proyek ini dibangun menggunakan React, Vite, Tailwind CSS, dan Shadcn UI.

<!-- ## Daftar Isi

- [Instalasi](#instalasi)
- [Struktur Folder](#struktur-folder)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi) -->

## Instalasi

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal:

1. **Klon repositori:**
   ```bash
   git clone ttps://github.com/ZulfiFazhar/RuangTeknoID.git
   cd RuangTeknoID
   ```
2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Jalankan Server:**
   ```bash
   npm run dev
   ```

## Cara menggunakan Chatbot

1. Masuk ke https://aistudio.google.com/
2. Klik `Get API Key` dan buat API key dengan cara klik `Create API Key`
3. Buat file `.env` di root directory
4. Buat variable bernama `VITE_REACT_APP_API_KEY` dan `VITE_REACT_APP_API_URL`
5. Copy API Key yang sudah dibuat, dan masukkan kedalam variable `VITE_REACT_APP_API_KEY`
6. Copy cURL dari halaman https://aistudio.google.com/apikey yang berisi `https://generativelanguage.googleapis.com/xxx-generateContent` dan masukkan kedalam variable `VITE_REACT_APP_API_URL`
