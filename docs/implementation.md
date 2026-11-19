# Common Ground — implementation

The current A2 assignment is a single-page, interactive city atlas. Open root `index.html`, or serve the repository with `python3 -m http.server 8215`.

## File map

- `index.html`: city directory, map controls, native scene and about dialogs.
- `style.css`: responsive Flexbox layouts, dark teal palette, mobile landmark badges.
- `immersive.css`: full-screen city, floating controls, popover directory, image-first scene layout.
- `city-data.js`: six imagined places, coordinates, narratives, and three moments per scene.
- `city-art.js`: original isometric building, people, robot, and scene drawing primitives.
- `city-life.js`: twelve positioned street/rooftop vignettes, short stories, shopfronts, balconies, bicycles, lamps, and roof details.
- `city.js`: p5.js instances, cached ground, depth-sorted vector buildings and vignettes, camera gestures, dialog navigation, and session progress.
- `assets/vendor/p5.min.js`: local p5.js 1.11.11; license alongside it.

## Interaction

Drag/pinch on touch screens; drag/scroll with a mouse. Focus the map for arrow-key pan, +/− zoom, and Home reset. Native buttons provide alternative access to every scene. Escape closes dialogs and returns focus.

Scene action buttons play a five-second visual sequence and leave a result in the illustration; paused mode shows the result immediately. Field notes optionally expose the three narrative moments. These are illustrative animations, not task simulations. Day/night changes the atmosphere and lights. Residents, robots, aerial couriers, and a water taxi animate the atlas. Routes and motion can be toggled. Reduced-motion preferences start playback paused; hidden tabs and dialogs suspend background animation.

Explored places are stored in this tab's `sessionStorage`; there are no accounts, backend, or submissions. Scene IDs support URL fragments such as `#garden` on initial load. Fonts may load from Google; all drawing code and p5.js are local. Without JavaScript, the page links to the reflection. If p5.js fails, the directory still opens scene narratives.

## Street-scale exploration

Shop names are proximity labels, not permanent canvas signs. Each frame projects sign anchors into screen coordinates and shows only the nearest name within 58 CSS pixels of the pointer. The lightweight label stays screen-sized as the city zooms. Mouse leave, dragging, zooming, and Escape dismiss it; a touch tap reveals it without confusing a pan or pinch with a tap. Landmark buttons retain accessible names while their visual names appear only on hover or keyboard focus.

Street details and small-story buttons fade in across 120–220% zoom using a smoothstep curve and a short time-based catch-up. Zooming out reverses the fade; buttons also fade near viewport edges and become interactive only above 30% opacity. Input-driven fades finish even when ambient motion is paused. Reduced-motion mode retains gradual zoom-dependent opacity but omits timed easing.

Selecting a story centers its miniature and opens a short, nonmodal caption; Escape closes it. The Places menu also provides sequential access to all twelve stories without canvas targeting. Main landmark labels recede while a small story is selected; nearby foreground buildings become translucent to reveal the selected miniature. The zoom range is 65–550%; zoomed-in buildings stay vector-sharp, with offscreen features culled. Vignettes reserve space in the city grid and are depth-sorted with buildings and major landmarks. Ground geometry is cached separately. Street details are fictional rather than a geographic map or a full city simulation.

Earlier images remain under `assets/images/` with their credits; the atlas does not use them. The A2 tag identifies the current atlas; earlier drafts remain in Git history, and Week 1 retains its own tag.
