# Happy Birthday, Mounika ❤️ (Ammuuu)
### Premium 3D Romantic Birthday Surprise Website

A bespoke, luxury cinematic birthday surprise experience created exclusively for **Mounika (“Ammuuu”)** for her special day on **October 27**.

Designed with a **Luxury Black & Gold** visual theme with royal ruby red accents, realistic 3D effects powered by **Three.js**, smooth motion choreography with **Framer Motion**, and a built-in **Romantic Ambient Audio Synthesizer** (Web Audio API) ensuring 100% working music right out of the box.

---

## ✨ Features & Experiences

1. **Cinematic Movie Intro**:
   - Deep obsidian background with slowly drifting golden particles and rotating 3D golden rings.
   - Dynamic real-time countdown to **October 27** with automatic celebration mode.
   - Glowing 3D golden heart with pulsing romantic glow.
   - Grand cinematic title reveal: *“Happy Birthday, Mounika ❤️ My Ammuuu”*.
   - Interactive *"Open Your Surprise ❤️"* button that bursts with golden sparks and smoothly enters the experience.

2. **Personal Photo Gallery (Preserves Original Facial Identity)**:
   - Uses your uploaded photos directly without any AI face transformations or distortions.
   - Luxury 3D interactive tilt cards with metallic gold borders and subtle golden corner stars.
   - Cinematic fullscreen lightbox with zoom, date badges, next/previous navigation, and keyboard support (`ArrowLeft`, `ArrowRight`, `Esc`).
   - Captions: *“My Favourite Smile ❤️”*, *“Our Precious Memories”*, *“Every Picture Has a Story”*, and more.

3. **Interactive 3D Birthday Cake 🎂**:
   - Built with **Three.js** featuring a multi-tiered velvet and champagne gold cake with pearl beads.
   - 3 animated candles with realistic flickering shader point lights and flame heat waver.
   - Direct interactive clicking on individual candles or one-tap *"Blow Out Candles & Make a Wish"*.
   - Realistic smoke wisps, magical chime sound effect, and grand golden fireworks celebration upon blowing.
   - *"Relight Candles 🕯️"* feature to experience the wish again and again.

4. **Personal Love Letter (Preserved Telugu-English Wording)**:
   - Sealed in a 3D Royal Obsidian & Gold Envelope with an embossed golden wax seal bearing `"M"`.
   - Tap to break the seal: sparks fly and the royal parchment unrolls smoothly.
   - Displays the **complete, exact heartfelt letter** in Telugu + English, with all emojis, bold highlights, and tender formatting preserved.

5. **Our Love Story Timeline**:
   - Vertical gold-threaded timeline chronicling your journey:
     - *28 August 2026* — The Day We First Met (with photo keepsake).
     - *15 July 2022* — Our First Special Memory.
     - *27 September 2023* — Love Across The Distance.
     - *27 October* — Happy Birthday, Mounika ❤️.
     - *Our Future* — Hand in hand, celebrating every birthday together.
   - Fully editable via `src/config/birthdayData.ts`.

6. **Virtual 3D Gift Box 🎁**:
   - Luxury velvet red and gold gift box with a 3D heart bow.
   - Click to untie: ribbon animates, lid opens with a golden beam of light.
   - Reveals **7 Eternal Promises for Ammuuu** + personal Telugu note: *“Nuvvu naaku entha viluvainadanivo cheppadaniki ee prapancham lo unna words saripovu.”*

7. **Romantic Background Music & Audio Engine 🎵**:
   - Dual-mode music player:
     - 1) Procedural Ambient Romantic Piano Synthesizer (Web Audio API) playing soothing G-major/E-minor arpeggios with zero silence and zero loading errors.
     - 2) Native HTML5 audio player if you place any MP3 in `public/assets/our-song.mp3`.
   - Floating music control with animated wave equalizer and hover volume slider.

8. **Fireworks & Confetti Celebration**:
   - Interactive celebratory fireworks with golden stars, red heart confetti, and rose petal showers.
   - Mobile-optimized, 60fps performance with reduced-motion support.

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🛠️ Personalizing & Replacing Content

Everything is centralized in a single file: **`src/config/birthdayData.ts`**.

### 1. Adding or Replacing Photos
Place your photo files inside `public/assets/`. Then open `src/config/birthdayData.ts` and update the `photos` array:
```ts
{
  id: "photo-1",
  src: "/assets/your-new-photo.jpg",
  title: "My Favourite Smile ❤️",
  subtitle: "The smile that lights up my world",
  date: "October 2026",
  caption: "Your personal romantic note here."
}
```

### 2. Customizing Our Song / Music
Drop any MP3 into `public/assets/our-song.mp3`. If no audio file is provided, the website automatically plays the built-in ambient romantic piano melody!

### 3. Editing Timeline Milestones
Edit the `timeline` array in `src/config/birthdayData.ts`. Add, remove, or modify dates, titles, descriptions, and attached images.

---

## 🌐 Free 1-Click Online Deployment

### Deploy to Vercel (Recommended)
1. Push this folder to your GitHub account (or install the Vercel CLI: `npm i -g vercel`).
2. Run `vercel` in this folder or import the repository at [vercel.com](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**. Your custom romantic link will be live in 30 seconds!

### Deploy to Netlify
1. Run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder. Your website goes live immediately with a free public URL!

---

*Made with all my heart for Mounika (Ammuuu) ❤️*
