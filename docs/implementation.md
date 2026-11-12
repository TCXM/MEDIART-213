# Week 2 & 3 — Future Telling

Implementation and preparation notes. All file paths below are relative to the repository root. For the instructor's viewing guide, see [README](../README.md).

**Project:** Living Together: people and robots in an ordinary neighborhood in 2040.

## Open the site

Open `index.html` in a browser. No build step or backend is needed.
The three pages are linked through their shared navigation:

- `index.html`: the original personal Future Vision, preserved with an entrance to the new project.
- `day.html`: new page 1, three scenes from an imagined day.
- `community.html`: new page 2, shared spaces, a fictional community noticeboard, and open design questions.

## Reflection

`reflection.md` contains the 250–400-word English assignment reflection. It is also linked from the community page. Read and personalize it before submitting.

## Design and implementation

- `style.css` retains the first assignment's visual style and Google Fonts imports.
- `future.css` adds Flexbox navigation, scene layouts, shared spaces, notices, and mobile styles.
- Native HTML `details` / `summary` elements provide keyboard-accessible interactions without JavaScript.
- `community-sketch.js` uses p5.js to draw a small neighborhood scene. HTML buttons choose a delivery destination and pause/play motion. Reduced-motion preferences start it paused; the SVG remains a fallback without JavaScript. This is an illustration, not a robot simulator.
- p5.js 1.11.11 is stored locally in `assets/vendor/p5.min.js`, with its LGPL license in `assets/vendor/p5-LICENSE.txt`. Source: https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.min.js
- Images, illustrations, HTML, and CSS live inside this folder. Google Fonts needs an internet connection; system font fallbacks work offline.
- The five original SVG illustrations depict imagined scenes, not working systems or experimental results. The day page uses three scene-and-caption pairs; the community page uses illustrated place links and an online-to-offline visual sequence. Illustration and photo credits are in `assets/images/SOURCES.md`.
- The noticeboard is a static scenario, not a functioning service. No real signups or submissions are collected.

Submit the complete design folder and reflection using the method specified by the instructor. A GitHub push alone does not submit the assignment on the course platform.

See [requirements check](requirements.md) for the assignment and rubric check, including the remaining submission steps.
