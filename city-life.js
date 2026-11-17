/* Street-scale vignettes: every story has its own visible miniature.
   Coordinates reserve actual space in the city; these are imagined field notes. */
window.CITY_STORIES = [
    { id: 'coffee', u: -5.8, v: -1.5, kind: 'cafe', title: 'One cup, no hurry.', copy: 'Mira remembers the regulars. Her little barista robot remembers how each of them likes their coffee.', color: '#eac093' },
    { id: 'repair', u: -2.3, v: -4.8, kind: 'repair', title: 'Not ready to throw it away.', copy: 'A neighbor brings a broken radio. Two students and a robot spend the afternoon finding its voice again.', color: '#b5c6f4' },
    { id: 'roof', u: 2.8, v: -4.8, kind: 'roof', title: 'The roof belongs to everyone.', copy: 'Above the apartments, a retired gardener teaches a child which leaves to pick. The harvest is going downstairs for dinner.', color: '#b9efae', z: 66 },
    { id: 'laundry', u: -5.8, v: -4.7, kind: 'laundry', title: 'A breeze does the drying.', copy: 'Solar panels power the wash. Wind finishes the job. A delivery robot waits for the last blue shirt.', color: '#9edcea' },
    { id: 'books', u: -2.6, v: 2.3, kind: 'books', title: 'Take a story. Leave a story.', copy: 'The street library has no checkout desk. Someone has left a handwritten recommendation inside every book.', color: '#efbbcf' },
    { id: 'chess', u: -5.7, v: 4.5, kind: 'chess', title: 'The slowest game in town.', copy: 'Two friends have played here every Thursday for twenty years. Their robot companion is only allowed to bring tea.', color: '#f3d891' },
    { id: 'market', u: 5.6, v: 4.8, kind: 'market', title: 'Grown three roofs away.', copy: 'Today’s stall sells tomatoes and herbs from nearby terraces. The small cart returns empty crates to the gardens.', color: '#eac093' },
    { id: 'music', u: 1.4, v: 5.1, kind: 'music', title: 'An audience of three.', copy: 'A musician tries a new melody by the water. One person stops, then another. The cleaning robot takes the long way round.', color: '#efbbcf' },
    { id: 'dock', u: 5.9, v: .1, kind: 'dock', title: 'The last hundred meters.', copy: 'Parcels arrive by water. A neighborhood porter and a small cart share the final trip to the door.', color: '#9edcea' },
    { id: 'bus', u: 5.7, v: -4.7, kind: 'bus', title: 'There is time to wait.', copy: 'The shuttle waits while a father fastens a child’s coat. Nobody needs to rush across the street.', color: '#b5c6f4' },
    { id: 'rain', u: .1, v: -1.6, kind: 'rain', title: 'Yesterday’s rain, tomorrow’s garden.', copy: 'Water from the roofs collects in a planted basin. A maintenance robot checks the filter while dragonflies do nothing useful at all.', color: '#b9efae' },
    { id: 'bakery', u: -3.5, v: 5.1, kind: 'bakery', title: 'The first light on the block.', copy: 'Before the offices wake up, bread is already cooling here. The baker shapes the dough; a robot takes the hot trays.', color: '#eac093' }
];

window.CityLife = function (p) {
    const a = window.CityArt(p);
    const wood = ['#bea47d', '#826e53', '#625944', '#c8b58e'];
    const signs = [];
    function human(u, v, color, time, scale = .65) {
        const q = a.project(u, v);
        p.push(); p.translate(q.x, q.y); p.scale(scale); a.person(0, 0, color, time); p.pop();
    }
    function bench(u, v) {
        a.box(u, v, .65, .18, 6, wood);
        a.box(u, v + .16, .65, .05, 15, wood);
        for (let i = 0; i < 4; i++) a.line([u + i * .18, v, 7], [u + i * .18, v + .18, 7], '#dbc5a0', .5);
    }
    function lamp(u, v, night) {
        a.line([u, v, 0], [u, v, 30], '#83a797', 1.4);
        const q = a.project(u, v, 31);
        p.noStroke(); p.fill(night ? '#ffe4a8' : '#b8d2b7'); p.ellipse(q.x, q.y, 6, 3);
        if (night) { p.fill('#f5d99b18'); p.circle(q.x, q.y, 30); }
    }
    function sign(u, v, z, text, color) {
        const q = a.project(u, v, z);
        // Keep local transforms for screen-space inspection, without painting permanent signs.
        signs.push({ q, text, color, transform: p.drawingContext.getTransform() });
    }
    function nearbySign(pointer) {
        let nearest = null;
        let distance = 58;
        const density = p.pixelDensity();
        if (pointer) for (const { q, text, color, transform } of signs) {
            const x = (transform.a * q.x + transform.c * q.y + transform.e) / density;
            const y = (transform.b * q.x + transform.d * q.y + transform.f) / density;
            const d = Math.hypot(x - pointer.x, y - pointer.y);
            if (d < distance) {
                distance = d;
                nearest = { x, y, text, color };
            }
        }
        signs.length = 0;
        return nearest;
    }
    function plants(u, v, z) {
        a.box(u, v, .3, .16, 5, ['#364e3d', '#aa8462', '#735f49'], z);
        for (let i = 0; i < 3; i++) a.tree(u + .05 + i * .08, v + .08, .16, z + 5);
    }
    function cycle(u, v) {
        const q = a.project(u, v);
        p.push(); p.translate(q.x, q.y); p.noFill(); p.stroke('#b0c3ac'); p.strokeWeight(.8);
        p.circle(-6, -3, 7); p.circle(6, -3, 7); p.triangle(-6, -3, 0, -10, 6, -3); p.line(0, -10, 5, -10); p.pop();
    }
    function detail(block, night, close) {
        const { u, v, height: h, variant: r } = block;
        if (block.park) {
            bench(u - .3, v + .25);
            if (close > 0) {
                p.push(); p.drawingContext.globalAlpha *= close;
                cycle(u + .35, v); lamp(u - .35, v - .3, night);
                p.pop();
            }
            return;
        }
        // Individual roofs, balconies and inhabited storefronts rather than identical boxes.
        if (r < .3) {
            for (let i = 0; i < 3; i++) {
                a.plane(u - .23 + i * .15, v - .2, .12, .4, h + 2, '#35566b', '#85adb6', .5);
                a.line([u - .17 + i * .15, v - .2, h + 2], [u - .17 + i * .15, v + .2, h + 2], '#a0bbc155', .5);
            }
        } else if (r < .65) {
            plants(u - .25, v - .2, h); plants(u + .03, v + .08, h);
            a.line([u - .32, v + .33, h + 6], [u + .32, v + .33, h + 6], '#94ab93', .8);
        } else {
            a.box(u - .15, v - .15, .22, .22, 6, ['#829c8d', '#526c62', '#3c5751'], h + 8);
        }
        a.box(u - .12, v + .34, .24, .02, 11, ['#b3bc9d', '#385654', '#34524c'], 0);
        if (close <= 0) return;
        p.push();
        p.drawingContext.globalAlpha *= close;
        const colors = ['#d8b28b', '#a0c4b0', '#afa9cc'];
        a.plane(u - .3, v + .3, .6, .22, 16, colors[Math.floor(r * 3)], '#dbd7b6', .5);
        if (close >= .3) sign(u, v + .35, 20, ['TEA', 'REPAIR', 'STUDIO', 'GROCER'][Math.floor(r * 4)], '#e0d4ac');
        for (let z = 24; z < h - 8; z += 26) {
            a.plane(u - .25, v + .33, .5, .17, z, '#749183', '#9cb19b', .5);
            plants(u - .22, v + .34, z);
        }
        if (r > .7) cycle(u + .34, v + .35);
        if (r < .2) lamp(u - .4, v + .4, night);
        p.pop();
    }
    function story(s, time, night, close, selected) {
        const { u, v, kind, color } = s;
        p.push();
        const q = a.project(u, v);
        p.translate(q.x, q.y);
        const palette = [color, '#506e60', '#334f48', '#94aa8c'];
        a.plane(-.8, -.65, 1.6, 1.3, 1, '#385348', '#657d66', .5);
        if (kind === 'roof') {
            a.box(-.7, -.6, 1.4, 1.2, 66, ['#728573', '#3f5c53', '#2d4747', '#819987'], 0, true);
            p.translate(0, -66);
            for (let i = 0; i < 3; i++) {
                a.box(-.6 + i * .4, -.5, .28, .65, 5, wood);
                for (let j = 0; j < 3; j++) plants(-.6 + i * .4, -.45 + j * .2, 5);
            }
            human(-.45, .4, '#dbb78e', time, .52); human(.15, .4, '#a5c4b2', 0, .38);
            a.line([-.7, .6, 9], [.7, .6, 9], '#a2b49b');
        } else if (['cafe', 'bakery', 'market'].includes(kind)) {
            a.box(-.7, -.6, 1.2, .4, 22, palette);
            a.plane(-.8, -.65, 1.5, .65, 30, color, '#e0d1aa');
            for (let i = 0; i < 7; i++) a.line([-.75 + i * .22, -.65, 31], [-.75 + i * .22, 0, 31], '#eee0b044', 5);
            sign(-.1, -.62, 38, kind === 'cafe' ? 'CANAL COFFEE' : kind === 'bakery' ? 'DAWN BAKERY' : 'ROOFTOP HARVEST', color);
            for (let i = 0; i < 4; i++) a.box(-.6 + i * .27, -.4, .18, .15, 3, [i % 2 ? '#b9c582' : '#d59a73', '#887b51', '#6b6445'], 23);
            bench(-.6, .5); human(-.35, .38, '#d6b28c', 0, .55);
            a.robot(.55, .2 + Math.sin(time * .5) * .1, time, true, .55);
            if (kind === 'cafe') {
                a.box(.1, .2, .3, .3, 12, wood);
                const steam = a.project(.22, .3, 20);
                p.noStroke(); p.fill('#dedfc866'); p.circle(steam.x, steam.y - (time * 5 % 12), 2);
            }
        } else if (kind === 'laundry') {
            a.box(-.7, -.6, 1.3, .5, 27, palette, 0, true);
            a.line([-.65, .1, 25], [.65, .1, 25], '#c9ccb3');
            for (let i = 0; i < 5; i++) {
                const x = -.55 + i * .24; const sway = Math.sin(time + i) * .05;
                const peg = a.project(x, .08 + sway, 24);
                p.push(); p.translate(peg.x, peg.y); p.rotate(Math.sin(time + i) * .04);
                p.noStroke(); p.fill(i % 2 ? '#d9d8b5' : '#85b9d0');
                p.beginShape();
                [[-3, 0], [-7, 3], [-5, 7], [-3, 5], [-3, 13], [4, 13], [4, 5], [6, 7], [8, 3], [4, 0]].forEach(([x, y]) => p.vertex(x, y));
                p.endShape(p.CLOSE); p.pop();
            }
            human(-.5, .5, '#d6b28c', time); a.robot(.55, .45, time, true, .5);
        } else if (kind === 'repair') {
            a.box(-.65, -.5, 1.3, .35, 28, palette);
            sign(0, -.5, 34, 'FIX / SHARE', color);
            a.box(-.5, .15, .8, .35, 14, wood);
            for (let i = 0; i < 3; i++) a.box(-.4 + i * .2, .2, .12, .12, 4, palette, 14);
            human(-.5, .65, '#d2b58c', time); human(.15, .7, '#b4adcd', -time);
            a.robot(.65, .3, time, false, .6); cycle(-.65, -.05);
        } else if (kind === 'books') {
            for (let z = 0; z < 24; z += 8) {
                a.box(-.6, -.3, .8, .25, 2, wood, z);
                for (let i = 0; i < 6; i++) a.box(-.56 + i * .12, -.27, .08, .17, 5, [color, ['#bba4bb', '#a6bca1', '#cfb081'][i % 3], '#807b71'], z + 2);
            }
            bench(.15, .2); human(.35, .15, '#a8c2af', 0); a.tree(-.6, .55, .65);
        } else if (kind === 'chess') {
            bench(-.65, -.1); bench(.3, .4);
            a.box(-.2, -.1, .45, .45, 12, wood);
            for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) a.plane(-.2 + x * .11, -.1 + y * .11, .11, .11, 13, (x + y) % 2 ? '#466056' : '#d2c8a0');
            human(-.45, -.05, '#dab78e', 0); human(.5, .35, '#acbdc8', 0);
            a.robot(.65, -.4, time, true, .5); a.tree(-.65, .5, .7);
        } else if (kind === 'music') {
            a.box(-.5, -.3, 1, .65, 5, wood);
            human(0, -.05, '#d8afc6', time * 3, .8);
            const hand = a.project(.06, -.04, 17);
            p.noStroke(); p.fill('#d4ab72'); p.ellipse(hand.x, hand.y, 10, 14);
            human(.6, .5, '#a8c5b5', 0); human(-.6, .4, '#cbb58c', 0);
            if (close > 0) {
                p.push(); p.drawingContext.globalAlpha *= close;
                p.fill(color); p.textSize(10); p.text('♪', 10, -35 + Math.sin(time * 2) * 4);
                p.pop();
            }
        } else if (kind === 'dock') {
            a.plane(-.6, -.5, 1.4, 1, 4, '#8c8e70', '#b6b796');
            for (let i = 0; i < 7; i++) a.line([-.6 + i * .2, -.5, 5], [-.6 + i * .2, .5, 5], '#596e5e');
            a.box(-.3, -.1, .3, .3, 10, wood); a.box(.05, -.1, .3, .3, 7, wood);
            human(-.5, .4, '#d1b086', time); a.robot(.5, .1, time, true, .65);
        } else if (kind === 'bus') {
            a.box(-.7, -.4, .05, .5, 32, palette); a.box(.7, -.4, .05, .5, 32, palette);
            a.plane(-.8, -.5, 1.6, .7, 33, '#87afb5aa', color);
            bench(-.5, -.15); human(-.1, .35, '#b4c7bb', 0); human(.2, .4, '#d7b58b', 0, .4);
            sign(.65, -.4, 22, '03 · 2 MIN', color); cycle(-.6, .4);
        } else {
            a.plane(-.65, -.5, 1.3, .9, 2, '#497a77', '#9abdb1');
            for (let i = 0; i < 6; i++) a.tree(-.6 + i * .22, -.45, .3);
            a.robot(.6, .4, time, false, .55);
            const fly = a.project(Math.sin(time) * .3, .1, 18);
            p.stroke('#dfdba4'); p.line(fly.x - 3, fly.y, fly.x + 3, fly.y);
        }
        if (kind !== 'roof') lamp(.75, -.55, night);
        if (selected) {
            p.noFill(); p.stroke(color); p.strokeWeight(1);
            p.ellipse(0, 4, 125, 62);
        }
        p.pop();
    }
    return { detail, story, lamp, bench, nearbySign };
};
