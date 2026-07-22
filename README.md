<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/type-single--page%20site-orange" alt="Type" />
</p>

# CraftStack — Where Craft Meets Code

> A boutique digital product studio landing page. Every pixel, every transition, every interaction — built to feel unforgettable.

🌐 **Live demo:** *(isi link deploy kamu di sini, misalnya Vercel/Netlify/GitHub Pages)*

---

## 📌 About

**CraftStack** adalah single-page website untuk studio produk digital butik. Dibangun murni dengan **HTML, CSS, dan Vanilla JavaScript** — tanpa framework, tanpa build step — supaya ringan, cepat, dan mudah di-deploy di mana saja.

### ✨ Highlights

| Fitur | Deskripsi |
|---|---|
| 🎨 **Custom cursor** | Cursor ring & dot yang mengikuti gerakan mouse dengan smooth transition |
| 📊 **Scroll progress bar** | Indikator progres scroll halaman secara real-time |
| 🌀 **3D particle hero** | Animasi partikel 3D interaktif di canvas hero section |
| 🎬 **Scroll reveal** | Elemen muncul dengan animasi saat di-scroll ke viewport (IntersectionObserver) |
| 🔢 **Animated stat counters** | Angka statistik yang menghitung naik secara animasi |
| 💬 **Testimonial carousel** | Slider testimoni otomatis dengan dot navigation |
| ❓ **FAQ accordion** | Bagian FAQ yang bisa dibuka-tutup |
| 🔐 **Login/Register modal** | Form autentikasi client-side sederhana (demo/frontend only) |
| 📧 **Newsletter form** | Form berlangganan newsletter dengan validasi dasar |

---

## 🚀 Quick Start

### Opsi 1 — Buka langsung

Cukup buka file `index.html` di browser:

```bash
git clone https://github.com/<username>/CraftStack.git
cd CraftStack
open index.html   # macOS
# atau start index.html   # Windows
# atau xdg-open index.html # Linux
```

### Opsi 2 — Local server (disarankan)

```bash
# Python
python3 -m http.server 8000

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8000` di browser.

---

## 🗂️ Struktur Proyek

```
CraftStack/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── index.html          # Seluruh halaman (HTML + CSS + JS dalam satu file)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── .gitignore
├── .nojekyll
└── README.md
```

---

## 🛠️ Tech Stack

- **HTML5** — struktur semantik
- **CSS3** — custom properties (design tokens), animasi, responsive layout
- **Vanilla JavaScript** — tanpa dependency eksternal
- **Google Fonts** — Inter, Syne, JetBrains Mono

---

## 🤝 Contributing

Kontribusi apa pun sangat diterima — dari perbaikan typo sampai fitur baru.

1. **Fork** repo ini
2. **Buat branch**: `git checkout -b feat/nama-fitur`
3. **Commit**: `git commit -m 'feat: tambah fitur X'`
4. **Push**: `git push origin feat/nama-fitur`
5. **Buka Pull Request**

Baca panduan lengkap di [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 License

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

---

**⭐ Kalau proyek ini membantu, jangan lupa kasih star!**
