/* Atlas controller: native HTML landmarks + an isometric p5.js map.
   All state is local. There is no map service, backend or real robot connection. */
(() => {
    'use strict';
    const places = window.CITY_PLACES;
    if (!places) return;
    const byId = new Map(places.map((place) => [place.id, place]));
    const list = document.getElementById('district-list');
    const markers = document.getElementById('map-markers');
    const host = document.getElementById('map-canvas');
    const sceneDialog = document.getElementById('scene-dialog');
    const aboutDialog = document.getElementById('about-dialog');
    const announcer = document.getElementById('announcement');
    const streetLabel = document.getElementById('street-label');
    const streetLabelName = document.getElementById('street-label-name');
    let inspectPointer = null;
    function clearInspection() { inspectPointer = null; streetLabel.hidden = true; }
    function inspectAt(event) {
        const r = host.getBoundingClientRect();
        inspectPointer = { x: event.clientX - r.left, y: event.clientY - r.top };
        redrawMap();
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const view = { panX: 0, panY: 0, zoom: 1, fit: 1, width: 0, height: 0 };
    const state = { place: null, moment: 0, hover: null, paused: reducedMotion.matches, routes: true, time: 0, sceneTime: 0, night: false, action: 0, acting: false };
    const actions = {
        kitchen: ['Serve breakfast', 'Breakfast is ready. Pull up a chair.'],
        workshop: ['Fold together', 'One more skill to share.'],
        transit: ['Call a shuttle', 'Your shared ride has arrived.'],
        garden: ['Water the garden', 'A little rain for tomorrow’s harvest.'],
        commons: ['Start the music', 'The square becomes a dance floor.'],
        care: ['Send a helping hand', 'Delivered. More time for each other.']
    };
    let mapSketch, sceneSketch, returnFocus;
    const visited = new Set();
    const stories = window.CITY_STORIES;
    const storyMarkers = document.getElementById('story-markers');
    const storyCard = document.getElementById('street-story');
    let activeStory = null;
    let storyIndex = -1;
    const storyButtons = new Map();
    stories.forEach((story) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'story-marker';
        button.hidden = true;
        button.textContent = '✦';
        button.style.setProperty('--story-color', story.color);
        button.setAttribute('aria-label', `Discover: ${story.title}`);
        button.title = story.title;
        button.dataset.story = story.id;
        button.addEventListener('click', () => revealStory(story));
        storyMarkers.append(button);
        storyButtons.set(story.id, button);
    });
    function revealStory(story) {
        activeStory = story;
        storyIndex = stories.indexOf(story);
        document.getElementById('places-panel').hidePopover();
        storyCard.hidden = false;
        document.getElementById('street-title').textContent = story.title;
        document.getElementById('street-copy').textContent = story.copy;
        storyCard.style.setProperty('--accent', story.color);
        // Keep the miniature above its caption, including on a narrow screen.
        view.zoom = Math.min(5.5, Math.max(2.5, 1.9 / view.fit));
        const scale = view.fit * view.zoom;
        view.panX = -(story.u - story.v) * 46 * scale;
        view.panY = view.height * -.08 - ((story.u + story.v) * 24 - (story.z || 0)) * scale;
        zoomAt(1);
        announcer.textContent = story.title;
    }
    function dismissStory() {
        storyCard.hidden = true;
        const button = activeStory && storyButtons.get(activeStory.id);
        activeStory = null;
        redrawMap();
        if (button && !button.hidden) button.focus({ preventScroll: true });
        else host.focus({ preventScroll: true });
    }
    document.getElementById('close-story').addEventListener('click', dismissStory);
    ['discover-story', 'next-story'].forEach((id) => document.getElementById(id).addEventListener('click', () => {
        revealStory(stories[(storyIndex + 1) % stories.length]);
        document.getElementById('close-story').focus({ preventScroll: true });
    }));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !sceneDialog.open && !aboutDialog.open && activeStory) dismissStory();
    });
    try {
        const saved = JSON.parse(sessionStorage.getItem('common-ground-explored') || '[]');
        if (Array.isArray(saved)) saved.filter((id) => byId.has(id)).forEach((id) => visited.add(id));
    } catch { /* The atlas also works when storage is unavailable. */ }

    function updateVisited() {
        document.getElementById('progress').textContent = `${String(visited.size).padStart(2, '0')} / 06 EXPLORED`;
        document.querySelectorAll('[data-place]').forEach((button) => {
            const seen = visited.has(button.dataset.place);
            button.dataset.visited = String(seen);
            const arrow = button.querySelector('.district-arrow');
            if (arrow) arrow.textContent = seen ? '✓' : '↗';
        });
        try { sessionStorage.setItem('common-ground-explored', JSON.stringify([...visited])); } catch { /* Optional. */ }
    }

    places.forEach((place) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'district-button';
        item.dataset.place = place.id;
        item.style.setProperty('--place-color', place.color);
        item.innerHTML = `<span class="district-number">${place.number}</span><span class="district-name">${place.short}</span><span class="district-arrow" aria-hidden="true">↗</span>`;
        item.setAttribute('aria-label', `Explore ${place.name}`);
        list.append(item);
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = 'map-marker';
        marker.dataset.place = place.id;
        marker.style.setProperty('--place-color', place.color);
        marker.innerHTML = `<span class="marker-id">${place.number}</span><span>${place.short}</span>`;
        marker.setAttribute('aria-label', `Enter ${place.name}`);
        markers.append(marker);
        [item, marker].forEach((button) => {
            button.addEventListener('click', () => openPlace(place.id, button));
            button.addEventListener('pointerenter', () => { state.hover = place.id; redrawMap(); });
            button.addEventListener('pointerleave', () => { state.hover = null; redrawMap(); });
            button.addEventListener('focus', () => { state.hover = place.id; redrawMap(); });
            button.addEventListener('blur', () => { state.hover = null; redrawMap(); });
        });
    });
    updateVisited();

    function setMoment(moment) {
        state.moment = moment;
        const [title, copy] = state.place.moments[moment];
        document.getElementById('moment-title').textContent = title;
        document.getElementById('moment-copy').textContent = copy;
        document.getElementById('moment-label').textContent = ['01 / ARRIVE', '02 / JOIN IN', '03 / IMAGINE'][moment];
        document.querySelectorAll('[data-moment]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.moment) === moment)));
        if (sceneSketch) sceneSketch.redraw();
    }

    function openPlace(id, source) {
        if (!byId.has(id)) return;
        if (!sceneDialog.open) returnFocus = source || document.querySelector(`[data-place="${id}"]`);
        state.place = byId.get(id);
        storyCard.hidden = true;
        activeStory = null;
        document.getElementById('places-panel').hidePopover();
        state.sceneTime = 0;
        state.action = 0;
        state.acting = false;
        document.querySelector('.scene-notes').open = false;
        document.getElementById('scene-action').textContent = `${actions[id][0]} →`;
        document.getElementById('action-status').textContent = 'Make a small moment happen.';
        visited.add(id); updateVisited();
        const place = state.place;
        document.getElementById('scene-location').textContent = `${place.number} / ${place.name.toUpperCase()}`;
        document.getElementById('scene-category').textContent = place.category;
        document.getElementById('scene-title').textContent = place.title;
        document.getElementById('scene-time').textContent = place.time;
        document.getElementById('scene-description').textContent = place.description;
        document.getElementById('scene-question').textContent = place.question;
        document.getElementById('scene-canvas').setAttribute('aria-label', `${place.name}. ${place.description}`);
        sceneDialog.style.setProperty('--accent', place.color);
        document.getElementById('next-place').innerHTML = `Next: ${places[(places.indexOf(place) + 1) % places.length].short} <span aria-hidden="true">→</span>`;
        setMoment(0);
        if (!sceneDialog.open) sceneDialog.showModal();
        sceneDialog.scrollTop = 0;
        document.getElementById('close-scene').focus({ preventScroll: true });
        if (sceneSketch) resizeScene();
        else if (window.p5) createScene();
        history.replaceState(null, '', `#${id}`);
        announcer.textContent = `Exploring ${place.name}.`;
        syncPlayback();
    }

    function closeScene() { sceneDialog.close(); }
    document.getElementById('scene-action').addEventListener('click', () => {
        state.action = state.paused ? 1 : 0;
        state.acting = !state.paused;
        state.sceneTime = 0;
        setMoment(1);
        document.getElementById('scene-action').textContent = 'Replay ↻';
        document.getElementById('action-status').textContent = state.paused ? actions[state.place.id][1] : 'A moment in motion…';
        sceneSketch?.redraw();
    });
    document.getElementById('day-toggle').addEventListener('click', (event) => {
        state.night = !state.night;
        document.body.classList.toggle('night', state.night);
        event.currentTarget.setAttribute('aria-pressed', String(state.night));
        event.currentTarget.textContent = state.night ? '☀ Day' : '☾ Night';
        redrawMap();
    });
    document.getElementById('close-scene').addEventListener('click', closeScene);
    sceneDialog.addEventListener('close', () => {
        history.replaceState(null, '', location.pathname + location.search);
        state.place = null;
        syncPlayback();
        if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
    document.querySelectorAll('[data-moment]').forEach((button) => button.addEventListener('click', () => setMoment(Number(button.dataset.moment))));
    document.getElementById('next-place').addEventListener('click', () => openPlace(places[(places.indexOf(state.place) + 1) % places.length].id));
    window.addEventListener('hashchange', () => {
        const id = location.hash.slice(1);
        if (byId.has(id)) openPlace(id);
        else if (sceneDialog.open) closeScene();
    });
    document.getElementById('about-button').addEventListener('click', () => { aboutDialog.showModal(); syncPlayback(); });
    document.getElementById('close-about').addEventListener('click', () => aboutDialog.close());
    aboutDialog.addEventListener('close', syncPlayback);
    [sceneDialog, aboutDialog].forEach((dialog) => {
        dialog.addEventListener('click', (event) => {
            if (event.target !== dialog) return;
            const r = dialog.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
        });
    });

    function syncPlayback() {
        document.getElementById('motion-toggle').textContent = state.paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
        document.getElementById('motion-toggle').setAttribute('aria-pressed', String(state.paused));
        document.getElementById('scene-motion').textContent = state.paused ? 'Play motion' : 'Pause motion';
        if (mapSketch) {
            if (state.paused || document.hidden || sceneDialog.open || aboutDialog.open) mapSketch.noLoop();
            else mapSketch.loop();
            mapSketch.redraw();
        }
        if (sceneSketch) {
            if (state.paused || document.hidden || !sceneDialog.open) sceneSketch.noLoop();
            else sceneSketch.loop();
            sceneSketch.redraw();
        }
    }
    ['motion-toggle', 'scene-motion'].forEach((id) => document.getElementById(id).addEventListener('click', () => { state.paused = !state.paused; syncPlayback(); }));
    reducedMotion.addEventListener('change', (event) => { if (event.matches) { state.paused = true; syncPlayback(); } });
    document.addEventListener('visibilitychange', syncPlayback);

    function redrawMap() { if (mapSketch && !mapSketch.isLooping()) mapSketch.redraw(); }
    function clampPan() {
        const limit = 650 * view.fit * view.zoom;
        view.panX = Math.max(-limit, Math.min(limit, view.panX));
        view.panY = Math.max(-limit * .65, Math.min(limit * .65, view.panY));
    }
    function zoomAt(factor, x = view.width / 2, y = view.height * .5) {
        clearInspection();
        const before = view.zoom;
        view.zoom = Math.max(.65, Math.min(5.5, view.zoom * factor));
        const ratio = view.zoom / before;
        view.panX = x - view.width / 2 - (x - view.width / 2 - view.panX) * ratio;
        view.panY = y - view.height * .51 - (y - view.height * .51 - view.panY) * ratio;
        clampPan(); redrawMap();
        document.getElementById('zoom-level').textContent = `${Math.round(view.zoom * 100)}%`;
        document.getElementById('zoom-in').disabled = view.zoom >= 5.5;
        document.getElementById('zoom-out').disabled = view.zoom <= .65;
    }
    function reset() {
        activeStory = null; storyCard.hidden = true;
        view.panX = 0; view.panY = 0; view.zoom = 1;
        zoomAt(1);
        announcer.textContent = 'City map centered.';
    }
    document.getElementById('zoom-in').addEventListener('click', () => zoomAt(1.22));
    document.getElementById('zoom-out').addEventListener('click', () => zoomAt(1 / 1.22));
    document.getElementById('reset-view').addEventListener('click', reset);
    document.getElementById('routes-toggle').addEventListener('click', (event) => {
        state.routes = !state.routes;
        event.currentTarget.setAttribute('aria-pressed', String(state.routes));
        redrawMap();
    });
    host.addEventListener('wheel', (event) => {
        event.preventDefault();
        const r = host.getBoundingClientRect();
        zoomAt(Math.exp(-Math.max(-100, Math.min(100, event.deltaY)) * .003), event.clientX - r.left, event.clientY - r.top);
    }, { passive: false });
    host.addEventListener('keydown', (event) => {
        const pan = 45;
        const operations = {
            ArrowLeft: () => { view.panX += pan; },
            ArrowRight: () => { view.panX -= pan; },
            ArrowUp: () => { view.panY += pan; },
            ArrowDown: () => { view.panY -= pan; },
            '+': () => zoomAt(1.22), '=': () => zoomAt(1.22),
            '-': () => zoomAt(1 / 1.22), Home: reset
        };
        if (operations[event.key]) { event.preventDefault(); clearInspection(); operations[event.key](); clampPan(); redrawMap(); }
    });
    const pointers = new Map();
    let gesture = null;
    let tapStart = null;
    let gestureMoved = false;
    function measureGesture() {
        const points = [...pointers.values()];
        if (!points.length) return null;
        if (points.length === 1) return { x: points[0].x, y: points[0].y, distance: 0 };
        return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2, distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) };
    }
    host.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        clearInspection();
        host.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        tapStart = { x: event.clientX, y: event.clientY };
        gestureMoved = pointers.size > 1;
        gesture = measureGesture();
    });
    host.addEventListener('pointermove', (event) => {
        if (!pointers.has(event.pointerId)) {
            if (event.pointerType !== 'touch') inspectAt(event);
            return;
        }
        if (tapStart && Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) > 6) gestureMoved = true;
        clearInspection();
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const current = measureGesture();
        if (gesture) {
            view.panX += current.x - gesture.x; view.panY += current.y - gesture.y;
            if (current.distance && gesture.distance) {
                const r = host.getBoundingClientRect();
                zoomAt(current.distance / gesture.distance, current.x - r.left, current.y - r.top);
            }
            clampPan(); redrawMap();
        }
        gesture = current;
    });
    function release(event) {
        const wasDown = pointers.has(event.pointerId);
        pointers.delete(event.pointerId); gesture = measureGesture();
        if (event.type === 'pointerup' && wasDown && !gestureMoved && !pointers.size) inspectAt(event);
    }
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => host.addEventListener(name, release));
    host.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'touch') clearInspection();
    });
    document.addEventListener('pointerdown', (event) => {
        if (!host.contains(event.target)) clearInspection();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' || event.key === 'Tab') clearInspection();
    });

    if (!window.p5) {
        document.getElementById('map-loading').textContent = 'The map could not load. Explore the places from the list.';
        markers.hidden = true;
        document.querySelectorAll('.map-tools button, .map-switches button').forEach((button) => { button.disabled = true; });
        return;
    }

    // Deterministic city blocks: same geometry on every visit, no network data.
    let seed = 2040;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const blocks = [];
    for (let u = -6; u <= 6; u++) {
        for (let v = -5; v <= 5; v++) {
            if (v === 0 || v === 1) continue;
            if (stories.some((story) => Math.abs(story.u - u) < 1 && Math.abs(story.v - v) < .95)) continue;
            if (places.some((place) => Math.abs(place.u - u) < 1.35 && Math.abs(place.v - v) < 1.25)) continue;
            const park = random() > .82;
            blocks.push({ u, v, park, height: 15 + random() * 66 + (u > -1 && v < -1 ? random() * 55 : 0), variant: random() });
        }
    }
    const traffic = Array.from({ length: 24 }, (_, i) => ({ u: -6 + random() * 12, v: [-4.5, -1.5, 2.5, 4.5][i % 4], speed: .14 + random() * .12, offset: random() * 12 }));

    new window.p5((p) => {
        const art = window.CityArt(p);
        const life = window.CityLife(p);
        let detailOpacity = 0;
        let lastDetailFrame = performance.now();
        let revealFrame = null;
        const smoothstep = (value) => {
            const t = Math.max(0, Math.min(1, value));
            return t * t * (3 - 2 * t);
        };
        const features = [
            ...blocks.map((block) => ({ ...block, type: 'block' })),
            ...places.map((place) => ({ ...place, type: 'place' })),
            ...stories.map((story) => ({ ...story, type: 'story' }))
        ].sort((a, b) => (a.u + a.v) - (b.u + b.v));
        let terrain;
        function resizeMap() {
            const r = host.getBoundingClientRect();
            view.width = r.width; view.height = r.height;
            view.fit = Math.min((r.width - 38) / (r.width < 700 ? 850 : 1180), (r.height - 120) / 680);
            view.fit = Math.max(.25, view.fit);
            p.resizeCanvas(r.width, r.height);
            clampPan();
            if (activeStory) revealStory(activeStory);
        }
        function terrainDrawing(a, g) {
            a.box(-7, -6, 14, 12, 18, ['#1c3537', '#142a30', '#10232b', '#395b5c'], -18);
            // Waterfront, embankments and three bridges.
            a.plane(-7, -.15, 14, 1.5, 1, '#17404a', '#457986');
            for (let i = 0; i < 8; i++) a.line([-6.8, i * .18, 2], [6.8, i * .18, 2], '#568e9c22');
            for (let u = -6.5; u < 7; u += 1) a.line([u, -6, 1], [u, 6, 1], '#3e5c5966', 4);
            for (let v = -5.5; v < 6; v += 1) {
                if (v > -.2 && v < 1.4) continue;
                a.line([-7, v, 1], [7, v, 1], '#3e5c5966', 4);
            }
            [-4.5, -.5, 4.5].forEach((u) => {
                a.plane(u - .19, -.2, .38, 1.65, 5, '#597471', '#87a99b');
                a.line([u - .19, -.2, 9], [u - .19, 1.45, 9], '#9cb5a4', .8);
                a.line([u + .19, -.2, 9], [u + .19, 1.45, 9], '#9cb5a4', .8);
            });
            // Crosswalks, paving and waterfront railings remain readable at street scale.
            for (const u of [-4.5, -.5, 4.5]) {
                for (let i = 0; i < 6; i++) {
                    a.plane(u - .25 + i * .1, -1.65, .055, .3, 2, '#a9b5a480');
                    a.plane(u - .25 + i * .1, 2.35, .055, .3, 2, '#a9b5a480');
                }
            }
            for (let u = -6.8; u < 7; u += .35) {
                a.line([u, -.13, 2], [u, -.13, 9], '#86a59b', .6);
                a.line([u, 1.36, 2], [u, 1.36, 9], '#86a59b', .6);
            }
            a.line([-7, -.13, 9], [7, -.13, 9], '#86a59b', .7);
            a.line([-7, 1.36, 9], [7, 1.36, 9], '#86a59b', .7);
            for (let u = -7; u <= 7; u++) a.line([u, 6.12, -8], [u, 6.25, -8], '#688d8166');
        }
        function drawFeatures() {
            const a = art;
            const close = detailOpacity;
            const scale = view.fit * view.zoom;
            for (const item of features) {
                const point = a.project(item.u, item.v);
                const sx = view.width / 2 + view.panX + point.x * scale;
                const sy = view.height * .51 + view.panY + point.y * scale;
                // Cull offscreen miniatures; visible artwork stays vector-sharp at 550%.
                if (sx < -200 * scale || sx > view.width + 200 * scale || sy < -150 * scale || sy > view.height + 250 * scale) continue;
                p.push();
                if (activeStory && item.type !== 'story') {
                    const target = a.project(activeStory.u, activeStory.v, activeStory.z || 0);
                    const top = point.y - (item.height || 100);
                    if (item.u + item.v > activeStory.u + activeStory.v &&
                        Math.abs(point.x - target.x) < 120 && top < target.y + 40 && point.y > target.y - 50) {
                        // A local cutaway reveals the selected street without moving its buildings.
                        p.drawingContext.globalAlpha = .18;
                    }
                }
                if (item.type === 'place') {
                    a.landmark(item, state.time, state.hover === item.id);
                    p.pop();
                    continue;
                }
                if (item.type === 'story') {
                    life.story(item, state.time, state.night, close, activeStory?.id === item.id);
                    p.pop();
                    continue;
                }
                const { u, v, park, height, variant } = item;
                if (park) {
                    a.plane(u - .36, v - .36, .72, .72, 1, '#2b4a3c', '#42684e');
                    a.tree(u - .15, v - .1, .55); a.tree(u + .19, v + .15, .65);
                } else {
                    const colors = variant > .55 ? ['#385c60', '#24434b', '#1c333f', '#597d7b'] : ['#436660', '#2b4c48', '#203b3e', '#678b7c'];
                    a.box(u - .32, v - .33, .64, .66, height, colors, 0, true);
                    if (variant > .65) a.box(u - .22, v - .23, .44, .46, 8, colors, height);
                    if (height > 92) a.line([u, v, height + 8], [u, v, height + 30], '#8aaba0');
                    else if (variant < .17) a.plane(u - .22, v - .25, .44, .5, height + .5, '#34576b', '#6b939d');
                }
                life.detail(item, state.night, close);
                p.pop();
            }
        }
        p.setup = () => {
            const r = host.getBoundingClientRect();
            const canvas = p.createCanvas(r.width, r.height);
            canvas.parent(host); canvas.attribute('aria-hidden', 'true');
            p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
            p.frameRate(30);
            mapSketch = p;
            resizeMap();
            // Cache only ground geometry; buildings and miniatures remain crisp vectors.
            terrain = p.createGraphics(1500, 950);
            terrain.pixelDensity(1.5);
            terrain.translate(750, 485);
            terrainDrawing(window.CityArt(terrain), terrain);
            document.getElementById('map-loading').hidden = true;
            new ResizeObserver(resizeMap).observe(host);
            syncPlayback();
            if (byId.has(location.hash.slice(1))) openPlace(location.hash.slice(1));
        };
        p.draw = () => {
            // Zoom reveals detail over a broad band, with a short catch-up for wheel/button jumps.
            // Reduced motion keeps the spatial gradient but removes the timed catch-up.
            const now = performance.now();
            const elapsed = Math.min((now - lastDetailFrame) / 1000, .05);
            lastDetailFrame = now;
            const targetOpacity = smoothstep((view.zoom - 1.2) / 1);
            detailOpacity = reducedMotion.matches ? targetOpacity :
                detailOpacity + (targetOpacity - detailOpacity) * (1 - Math.exp(-elapsed / .14));
            if (Math.abs(targetOpacity - detailOpacity) < .001) detailOpacity = targetOpacity;
            if (detailOpacity !== targetOpacity && !p.isLooping() && !document.hidden &&
                !sceneDialog.open && !aboutDialog.open && revealFrame === null) {
                revealFrame = requestAnimationFrame(() => { revealFrame = null; p.redraw(); });
            }
            const dt = state.paused || document.hidden || sceneDialog.open || aboutDialog.open ? 0 : Math.min(p.deltaTime / 1000, .05);
            state.time += dt;
            p.clear();
            p.push();
            p.translate(view.width / 2 + view.panX, view.height * .51 + view.panY);
            p.scale(view.fit * view.zoom);
            // A sparse survey grid extends beyond the island.
            for (let i = -14; i <= 14; i++) {
                art.line([i, -14, -24], [i, 14, -24], '#5d8a8313', .7);
                art.line([-14, i, -24], [14, i, -24], '#5d8a8313', .7);
            }
            if (terrain) p.image(terrain, -750, -485);
            if (state.routes) {
                const routeColor = '#e5bf7a8c';
                art.line([-6.5, -1.5, 2], [6.5, -1.5, 2], routeColor, 1.6);
                art.line([-6.5, 2.5, 2], [6.5, 2.5, 2], routeColor, 1.6);
                [-4.5, -.5, 4.5].forEach((u) => art.line([u, -1.5, 6], [u, 2.5, 6], routeColor, 1.6));
            }
            traffic.forEach((car, i) => {
                const u = -6.5 + ((car.offset + state.time * car.speed) % 13);
                const q = art.project(i % 2 ? u : -u, car.v, 3);
                p.noStroke(); p.fill(i % 3 ? '#a2cbbf' : '#efc486');
                p.ellipse(q.x, q.y, 5, 2.5);
            });
            // Residents walk along the open waterfront, alongside delivery robots.
            for (let i = 0; i < 16; i++) {
                const u = -6 + ((i * .83 + state.time * .09) % 12);
                const v = i % 2 ? 1.52 : -.35;
                if (i % 5 === 0) art.robot(u, v, state.time, true, .45);
                else {
                    p.push();
                    const q = art.project(u, v);
                    p.translate(q.x, q.y); p.scale(.55);
                    art.person(0, 0, ['#dcbf9b', '#b5d5bd', '#b9bce2'][i % 3], state.time * 4 + i);
                    p.pop();
                }
            }
            // A quiet water taxi and aerial couriers give the city several layers of life.
            const boatU = -6 + ((state.time * .22) % 12);
            art.box(boatU, .45, .65, .32, 7, ['#d6d9b1', '#6aa4aa', '#396574'], 3);
            for (let i = 0; i < 7; i++) {
                const q = art.project(boatU - .18 - i * .12, .6, 2);
                p.noFill(); p.stroke('#a3d9d766'); p.strokeWeight(1);
                p.ellipse(q.x, q.y, 5 + i * 3, 2 + i);
            }
            drawFeatures();
            for (let i = 0; i < 3; i++) {
                const u = Math.sin(state.time * .09 + i * 2.1) * 5;
                const v = Math.cos(state.time * .09 + i * 2.1) * 4;
                const q = art.project(u, v, 150 + i * 35);
                p.noStroke(); p.fill('#b5e5d4'); p.ellipse(q.x, q.y, 17, 6);
                p.stroke('#9dded599'); p.strokeWeight(1);
                p.line(q.x - 16, q.y - 4, q.x + 16, q.y - 4);
                p.noFill(); p.ellipse(q.x - 12, q.y - 5, 13, 4); p.ellipse(q.x + 12, q.y - 5, 13, 4);
                p.noStroke(); p.fill('#ecce91'); p.circle(q.x, q.y + 4, 3);
            }
            if (state.night) {
                blocks.filter((block) => !block.park).forEach((block) => {
                    const q = art.project(block.u + .33, block.v, block.height * .55);
                    p.noStroke(); p.fill('#f6d89c35'); p.circle(q.x, q.y, 13);
                    p.fill('#ffe5af'); p.rect(q.x - 1, q.y - 2, 2, 5);
                });
                places.forEach((place) => {
                    const q = art.project(place.u, place.v, place.height + 5);
                    p.noStroke(); p.fill(`${place.color}12`); p.circle(q.x, q.y, 110);
                    p.fill(`${place.color}18`); p.circle(q.x, q.y, 60);
                });
            }
            const nearby = life.nearbySign(inspectPointer);
            streetLabel.hidden = !nearby || sceneDialog.open || aboutDialog.open;
            if (nearby && !streetLabel.hidden) {
                streetLabelName.textContent = nearby.text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
                streetLabel.style.setProperty('--label-color', nearby.color);
                const half = streetLabel.offsetWidth / 2;
                const x = Math.max(half + 12, Math.min(view.width - half - 12, nearby.x));
                const y = Math.max(100, Math.min(view.height - 100, nearby.y - 24));
                streetLabel.style.left = `${x}px`;
                streetLabel.style.top = `${y}px`;
            }
            p.pop();
            const scale = view.fit * view.zoom;
            places.forEach((place) => {
                const q = art.project(place.u, place.v, place.height + 24);
                const marker = markers.querySelector(`[data-place="${place.id}"]`);
                const x = view.width / 2 + view.panX + q.x * scale;
                const y = view.height * .51 + view.panY + q.y * scale;
                marker.style.transform = `translate(${Math.round(x - 20)}px, ${Math.round(y - 28)}px)`;
                marker.hidden = !!activeStory || x < -40 || x > view.width - 10 || y < 0 || y > view.height - 70;
            });
            stories.forEach((story) => {
                const q = art.project(story.u, story.v, (story.z || 0) + 45);
                const x = view.width / 2 + view.panX + q.x * scale;
                const y = view.height * .51 + view.panY + q.y * scale;
                const button = storyButtons.get(story.id);
                const edgeOpacity = smoothstep(Math.min(x - 24, view.width - 24 - x, y - 85, view.height - 100 - y) / 35);
                const opacity = detailOpacity * edgeOpacity;
                button.style.transform = `translate(${Math.round(x - 17)}px, ${Math.round(y - 17)}px)`;
                button.style.opacity = String(opacity);
                button.hidden = opacity <= 0;
                button.disabled = opacity < .3;
                button.style.pointerEvents = opacity < .3 ? 'none' : '';
                button.setAttribute('aria-pressed', String(activeStory?.id === story.id));
            });
        };
    });

    function resizeScene() {
        if (!sceneSketch || !sceneDialog.open) return;
        const container = document.getElementById('scene-canvas');
        const width = container.clientWidth;
        if (width > 0) sceneSketch.resizeCanvas(width, container.clientHeight);
    }
    function createScene() {
        const container = document.getElementById('scene-canvas');
        new window.p5((p) => {
            const art = window.CityArt(p);
            p.setup = () => {
                const width = container.clientWidth;
                const canvas = p.createCanvas(width, container.clientHeight);
                canvas.parent(container); canvas.attribute('aria-hidden', 'true');
                p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
                p.frameRate(30);
                sceneSketch = p;
                new ResizeObserver(resizeScene).observe(container);
                syncPlayback();
            };
            p.draw = () => {
                if (!state.place) return;
                if (!state.paused && !document.hidden && sceneDialog.open) state.sceneTime += Math.min(p.deltaTime / 1000, .05);
                if (state.acting && !state.paused && !document.hidden) {
                    state.action = Math.min(1, state.action + Math.min(p.deltaTime / 1000, .05) / 5);
                    if (state.action === 1) {
                        state.acting = false;
                        document.getElementById('action-status').textContent = actions[state.place.id][1];
                    }
                }
                art.scene(state.place, state.moment, state.sceneTime, p.width, p.height, state.action);
            };
        });
    }
})();
