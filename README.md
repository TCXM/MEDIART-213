# Living Together

**MEDIART 213 · Week 2 & 3 A2: Future Telling**

A neighborhood in 2040 where people and robots share everyday tasks: making breakfast, learning to fold clothes, and gathering for dinner. This project expands my personal Future Vision into a wider community, with cooperation rather than replacement at its center.

## How to view the assignment

Download or clone this repository, then **open `index.html` in a browser**. Keep the other files and the `assets` folder alongside it. No installation or build step is required.

For a local web preview, run this command from the repository root:

```sh
python3 -m http.server 8000
```

Then open **http://localhost:8000**.

> GitHub's file view displays HTML source, not the finished website. Open the downloaded files in a browser or use the local preview above.

## Suggested viewing order

1. **My vision — `index.html`**
   The original personal Future Vision. Select **“Step into 2040”** to enter the new work.
2. **An ordinary day — `day.html`**
   The first new page: three illustrated scenes of people and robots cooking, learning, and spending time together.
3. **Our community — `community.html`**
   The second new page: shared spaces, a community noticeboard, and questions about access, maintenance, and work.

The top navigation connects all three pages. To begin directly with the new assignment, open **`day.html`**.

### Things to try

- On **Our community**, choose **“To the kitchen,” “To the workshop,” or “To the garden”** in the p5.js scene. Pause or resume the animation with the adjacent button.
- Click a shared-space illustration to visit the corresponding scene in **An ordinary day**.
- Expand a notice or a question to read the details. These controls also work with the keyboard.

## Reflection

Read **[reflection.md](reflection.md)** — **335 words** — or expand **“Read the full reflection”** near the bottom of **Our community**. It covers the intended audience, the community's significance, the design choices, and the designer's responsibility.

## Project files

```text
index.html                Original personal vision and entrance
day.html                  New page 1: an ordinary day
community.html            New page 2: the shared community
style.css / future.css    Typography, visual design, and Flexbox layouts
community-sketch.js       Interactive p5.js neighborhood
reflection.md             Assignment reflection
assets/                   Local images, SVG illustrations, and p5.js
docs/                     Implementation notes, requirement check, archived brief
```

The site uses semantic HTML, CSS Flexbox, and a small p5.js sketch. It adapts to smaller screens and respects reduced-motion settings. With JavaScript disabled, the community illustration remains visible. Google Fonts requires internet access; fallback fonts are provided. All images and the p5.js library are stored locally.

## Credits and scope

These are speculative scenes, not claims about current robot capabilities. The noticeboard is illustrative, with no live bookings or collected submissions. The SVG illustrations and p5.js scene were created with coding assistance. Photo sources and illustration notes are listed in [assets/images/SOURCES.md](assets/images/SOURCES.md). p5.js 1.11.11 is included with its [license](assets/vendor/p5-LICENSE.txt).

The detailed assignment check is available in [docs/requirements.md](docs/requirements.md).

## Assignment versions

Each completed assignment has an annotated Git tag marking its completed repository snapshot:

| Assignment | Version |
| --- | --- |
| Week 1 — Future Vision | [week-1-future-vision](https://github.com/TCXM/MEDIART-213-week-1/tree/week-1-future-vision) |
| Week 2 & 3 A2 — Future Telling | [week-2-3-a2-future-telling](https://github.com/TCXM/MEDIART-213-week-1/tree/week-2-3-a2-future-telling) |

The Week 1 snapshot retains its original `week1 inclass-template/` folder. The Week 2 & 3 snapshot places the site at the repository root. Select a tag on GitHub to browse or download that assignment's exact version. These tags identify repository versions, not confirmation of submission on the course platform.
