# Yazan Hamdan — Portfolio

A motion-first, dark-cinematic personal portfolio for **Yazan Maher Hamdan** — Technical Lead, AI/ML Engineer, ERP Specialist & Full-Stack Developer.

Built from the CV with a focus on **graphics and animation**: an interactive particle-network background, a custom glowing cursor, scroll-reveal choreography, animated counters, a typing hero, project filtering, and subtle 3D card tilt — all in **vanilla HTML/CSS/JS with zero dependencies**.

## Highlights
- ⚡ Interactive canvas particle network (mouse-reactive)
- 🎯 Custom cursor with magnetic hover states
- 📜 Scroll progress bar + active-section nav
- ✨ IntersectionObserver reveal animations with stagger
- 🔢 Animated stat counters
- ⌨️ Typing role rotation in the hero
- 🗂️ Filterable project gallery (AI / ERP / Full-Stack / Security)
- 🪞 3D tilt on cards
- ♿ Respects `prefers-reduced-motion`
- 📱 Fully responsive

## Structure
```
index.html      # markup & content (from the CV)
styles.css      # theme, layout, animations
script.js       # all interactions
Yazan_Hamdan_CV.pdf
```

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)
Push to `main` and enable Pages → *Deploy from branch* → `main` / root.
A `.nojekyll` file is included so assets serve as-is.
