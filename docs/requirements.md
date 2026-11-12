# Week 2 & 3 A2 — Future Telling: requirement check

Checked against the assignment and rubric screenshots supplied by the student.

File paths below are relative to the repository root. The instructor's viewing guide is [README](../README.md).

## Explicit assignment requirements

| Requirement | Evidence in this folder |
| --- | --- |
| Create 2 or more **new** webpages | `day.html` and `community.html` are new. The original `index.html` remains, giving 3 linked pages. |
| Expand the personal Future Vision into a broader future scenario | The original hopes for friendship, learning, and shared time lead into an imagined neighborhood in 2040 where people and robots live and work together. |
| Identify who the future empowers and how | Breakfast depicts an older resident participating without lifting heavy pots. The workshop supports students and practical learning. Shared access, reduced fees, and offline notices address different resources and abilities. |
| Express the world with design elements | Warm colors, consistent typography, scene illustrations, captions, time navigation, a p5.js neighborhood, and expandable notices support the same ordinary-life theme. |
| Use CSS Flexbox | `future.css`: `.site-nav`, `.day-scene`, `.place-list`, `.notice-list`, `.questions-layout`, and `.sketch-controls`. |
| Link the pages coherently | Shared navigation, active-page indicators, the home-page entrance, next-page links, and links between places and specific day scenes. |
| Submit a short reflection of 250–400 words | `reflection.md`: **335 words**, excluding the heading. An identical copy is available inside the community page's expandable reflection. |
| Reflection: whom does the design empower? | Paragraph 2: older residents, caregivers, students, and residents with different abilities and resources. |
| Reflection: why does it matter to you / your community? | Paragraphs 1–3: a robotics student's interest in participation, shared skills, and time together rather than speed alone. |
| Reflection: how do design choices express the future? | Paragraph 4: colors, typography, illustrations, navigation, Flexbox, and optional p5.js interaction. |

The brief does not specify a required image count, p5.js, a backend, real robot control, or a live booking system. The p5.js scene is an additional design experiment, not a replacement for the required HTML/CSS work.

## Rubric alignment — evidence, not a promised grade

- **Creativity:** a specific human–robot community, including cooperative fabric handling, shared meals, and online coordination. Images show collaboration rather than robot product portraits. Original SVGs and a controllable p5.js scene extend the concept visually.
- **Clarity:** the journey moves from personal hopes to a day in the neighborhood, then to its shared infrastructure. Image links, next-page prompts, and return links keep the pages connected.
- **Technical craft and design:** semantic HTML, a consistent heading hierarchy, external CSS and JavaScript, Flexbox layouts, local assets, alternative text, native expandable content, keyboard controls, and responsive views. The p5.js sketch has pause/play, reduced-motion support, and a static fallback.
- **Critical thinking:** questions about access, maintenance funding, paid work, and keeping meaningful human activities are visible as expandable topics. Printed notices and a community host address access beyond the website. The reflection describes the designer's responsibility without presenting these ideas as solved policy or proven robot capabilities.

## Checks performed

- Browser checks at 1440, 390, and 320 pixels: local images load; no horizontal overflow.
- Cross-page image links and section links, keyboard expansion, and the p5.js destination and pause controls work.
- JavaScript-disabled mode retains the neighborhood SVG; reduced-motion mode starts the scene paused.
- Automated axe WCAG A/AA checks returned no violations on the 3 pages at desktop width. This is a limited automated check, not a complete accessibility certification.
- Local file links, section IDs, HTML tag nesting, SVG XML, reflection word count, and the two reflection copies are checked separately.

## Before handing in

- Read and personalize the reflection so it accurately represents your own thinking and course expectations, including any rules about AI assistance.
- Submit the **complete design folder** and reflection through the instructor's specified submission method. The screenshot shows Text / Web URL options; it does not establish whether a repository link alone is accepted or how a folder should be packaged.
- If using a repository or website URL, push/deploy the new files first and verify the submitted URL opens the intended site. No new deployment or course-platform submission has been performed here.
- Screenshot deadline: **Friday, November 13, 2026, 11:59 pm**. Confirm the course-platform timezone.
