/* Original procedural artwork. Isometric projection keeps the atlas lightweight:
   every road, building, person and robot is drawn with p5.js primitives. */
window.CityArt = function (p) {
    const ink = '#173035';
    let peopleScale = 1;
    const project = (u, v, z = 0) => ({ x: (u - v) * 46, y: (u + v) * 24 - z });

    function polygon(points, fill, stroke = null, weight = 1) {
        if (fill) p.fill(fill); else p.noFill();
        if (stroke) { p.stroke(stroke); p.strokeWeight(weight); } else p.noStroke();
        p.beginShape();
        points.forEach((point) => p.vertex(point.x, point.y));
        p.endShape(p.CLOSE);
    }

    function plane(u, v, w, d, z, fill, stroke = null, weight = 1) {
        polygon([project(u, v, z), project(u + w, v, z), project(u + w, v + d, z), project(u, v + d, z)], fill, stroke, weight);
    }

    function line(a, b, color, width = 1) {
        p.stroke(color); p.strokeWeight(width);
        const start = project(...a); const end = project(...b);
        p.line(start.x, start.y, end.x, end.y);
    }

    function box(u, v, w, d, h, colors, base = 0, windows = false) {
        const [top = '#3c6665', left = '#23494d', right = '#19363e', edge = '#56827b'] = colors;
        polygon([project(u, v + d, base), project(u + w, v + d, base), project(u + w, v + d, h + base), project(u, v + d, h + base)], left, edge, .7);
        polygon([project(u + w, v, base), project(u + w, v + d, base), project(u + w, v + d, h + base), project(u + w, v, h + base)], right, edge, .7);
        plane(u, v, w, d, h + base, top, edge, .8);
        if (windows && h > 20) {
            for (let z = 10; z < h - 4; z += 13) {
                for (let i = .12; i < w - .08; i += .22) {
                    line([u + i, v + d + .007, z + base], [u + Math.min(i + .09, w - .03), v + d + .007, z + base], '#8cbeb16a', 1.7);
                }
                for (let i = .12; i < d - .08; i += .22) {
                    line([u + w + .007, v + i, z + base], [u + w + .007, v + Math.min(i + .09, d - .03), z + base], '#689fa167', 1.5);
                }
            }
        }
    }

    function tree(u, v, size = 1, base = 0) {
        const q = project(u, v, base);
        p.stroke('#5b8372'); p.strokeWeight(2 * size);
        p.line(q.x, q.y, q.x, q.y - 15 * size);
        p.noStroke(); p.fill('#356558');
        p.ellipse(q.x, q.y - 22 * size, 19 * size, 26 * size);
        p.fill('#598875'); p.ellipse(q.x - 3 * size, q.y - 26 * size, 11 * size, 16 * size);
    }

    function person(u, v, color = '#d6ad82', time = 0, seated = false) {
        const q = project(u, v);
        const stride = seated ? 0 : Math.sin(time) * 2;
        p.push(); p.translate(q.x, q.y); p.scale(peopleScale);
        p.noStroke(); p.fill('#00111545'); p.ellipse(0, 2, 19, 8);
        p.stroke('#809b98'); p.strokeWeight(3);
        p.line(-3, -9, -4 - stride, 0);
        p.line(3, -9, 5 + stride, 0);
        p.noStroke(); p.fill(color); p.rect(-6, -26, 12, 18, 4);
        p.fill('#e2bd99'); p.circle(0, -32, 10);
        p.fill('#203b3d'); p.arc(0, -34, 11, 9, Math.PI, Math.PI * 2);
        p.stroke(color); p.strokeWeight(3);
        p.line(-6, -23, -9, -13 + stride);
        p.line(6, -23, 9, -13 - stride);
        p.pop();
    }

    function robot(u, v, time = 0, cargo = false, scale = 1) {
        const q = project(u, v);
        p.push(); p.translate(q.x, q.y); p.scale(scale);
        p.noStroke(); p.fill('#00111560'); p.ellipse(0, 4, 27, 10);
        p.fill('#192a30'); p.rect(-11, -1, 6, 8, 2); p.rect(5, -1, 6, 8, 2);
        p.stroke('#8ab1aa'); p.strokeWeight(1);
        p.fill('#c2d7c9'); p.rect(-13, -24, 26, 26, 8);
        p.noStroke(); p.fill('#193e42'); p.rect(-9, -19, 18, 8, 4);
        p.fill('#bcf4db'); p.circle(-4, -15, 2); p.circle(4, -15, 2);
        p.fill('#8ab1a1'); p.rect(-8, -6, 16, 2, 1);
        if (cargo) {
            p.fill('#cda779'); p.rect(-9, -34, 18, 10, 1);
            p.stroke('#edcd95'); p.line(0, -33, 0, -25);
        }
        p.stroke('#9cc9b8'); p.line(6, -25, 6, -31);
        p.noStroke(); p.fill('#baf0c8'); p.circle(6, -32, 3 + Math.sin(time * 2) * .3);
        p.pop();
    }

    function arm(u, v, z, reach, accent, phase) {
        const q = project(u, v, z);
        p.push(); p.translate(q.x, q.y);
        p.fill('#547a77'); p.noStroke(); p.ellipse(0, 0, 25, 12);
        const elbow = { x: -12, y: -50 };
        const end = { x: reach, y: -37 + Math.sin(phase) * 7 };
        p.stroke('#b8d1c6'); p.strokeWeight(9); p.strokeCap(p.ROUND);
        p.line(0, -3, elbow.x, elbow.y); p.line(elbow.x, elbow.y, end.x, end.y);
        p.fill(accent); p.stroke('#325653'); p.strokeWeight(2);
        p.circle(elbow.x, elbow.y, 12); p.circle(end.x, end.y, 9);
        p.stroke('#b8d1c6'); p.strokeWeight(3);
        p.line(end.x, end.y + 4, end.x - 6, end.y + 13);
        p.line(end.x, end.y + 4, end.x + 6, end.y + 13);
        p.pop();
    }

    function table(u, v, w, d, top = '#b49e7d', h = 30) {
        [[0, 0], [w - .1, 0], [0, d - .1], [w - .1, d - .1]].forEach(([x, y]) => {
            box(u + x, v + y, .1, .1, h, ['#728f85', '#45685f', '#35534f']);
        });
        box(u - .06, v - .06, w + .12, d + .12, 4, [top, '#7e8066', '#676e5a'], h);
    }

    function pot(u, v, base, color = '#729a78') {
        box(u - .16, v - .16, .32, .32, 13, ['#465c47', '#9d8969', '#7e775b'], base);
        const q = project(u, v, base + 14);
        p.noStroke(); p.fill(color);
        p.ellipse(q.x - 4, q.y - 7, 8, 17); p.ellipse(q.x + 4, q.y - 4, 8, 14);
    }

    function landmark(place, time, selected) {
        const { u, v, id, color } = place;
        plane(u - .95, v - .95, 1.9, 1.9, 1, `${color}16`, color, selected ? 2 : 1);
        if (id === 'kitchen') {
            box(u - .7, v - .6, 1.4, 1.2, 38, ['#8a8064', '#575b50', '#384e46', color], 0, true);
            box(u - .85, v - .75, 1.7, 1.5, 5, ['#b19e73', '#7c8265', '#606c55', color], 38);
            for (let i = 0; i < 4; i++) line([u - .65 + i * .4, v - .75, 44], [u - .65 + i * .4, v + .75, 44], '#dec395', 1);
        } else if (id === 'workshop') {
            box(u - .6, v - .6, .8, 1.2, 90, ['#707d9b', '#384f64', '#293c53', color], 0, true);
            box(u + .25, v - .25, .55, .85, 50, ['#596d8a', '#344e61', '#263f51', color], 0, true);
            plane(u - .5, v - .5, .6, 1, 91, '#344b62', color);
            line([u - .2, v, 90], [u - .2, v, 115], color);
        } else if (id === 'transit') {
            box(u - .9, v - .5, 1.8, 1.1, 9, ['#4c7376', '#32575a', '#27434d', color]);
            for (let i = -.65; i < .9; i += .6) box(u + i, v - .4, .07, .9, 35, ['#8fb8bb', '#5e9196', '#477d88', color]);
            plane(u - 1, v - .6, 2, 1.2, 36, '#65a3ac50', color);
            box(u - .6 + Math.sin(time * .3) * .3, v - .05, .7, .25, 13, ['#b7dada', '#669fa7', '#477b8b', color], 9);
        } else if (id === 'garden') {
            for (let i = 0; i < 3; i++) {
                box(u - .8 + i * .18, v - .8 + i * .18, 1.6 - i * .36, 1.6 - i * .36, 16, ['#517455', '#2d5141', '#264738', color], i * 16);
                tree(u - .6 + i * .3, v + .45 - i * .2, .5, (i + 1) * 16);
            }
            const peak = project(u, v, 82);
            [project(u - .4, v - .4, 48), project(u + .4, v - .4, 48), project(u + .4, v + .4, 48), project(u - .4, v + .4, 48)].forEach((q) => {
                p.stroke(color); p.strokeWeight(.8); p.line(q.x, q.y, peak.x, peak.y);
            });
        } else if (id === 'commons') {
            box(u - .85, v - .75, 1.7, 1.5, 7, ['#645967', '#3c404d', '#2c3741', color]);
            for (let i = 0; i < 6; i++) {
                const a = i / 6 * Math.PI * 2;
                person(u + Math.cos(a) * .65, v + Math.sin(a) * .5, i % 2 ? '#c2939f' : '#a3b6a1');
            }
            line([u - .8, v, 40], [u + .8, v, 40], '#d6aab9');
        } else {
            box(u - .8, v - .7, .6, 1.4, 43, ['#a79c77', '#6b725c', '#4a5b4a', color], 0, true);
            box(u + .2, v - .7, .6, 1.4, 43, ['#a79c77', '#6b725c', '#4a5b4a', color], 0, true);
            tree(u, v, .65);
            line([u - .5, v - .55, 44], [u - .5, v - .1, 44], color, 3);
            line([u - .7, v - .32, 44], [u - .3, v - .32, 44], color, 3);
        }
    }

    function scene(place, moment, time, width, height, action = 0) {
        peopleScale = 1.65;
        p.background('#172b30');
        p.push();
        p.translate(width / 2, height * (width < 700 ? .34 : .47));
        p.scale(Math.min(width / 760, height / 680) * .88);
        const accent = place.color;
        // Blueprint grid behind a freestanding miniature scene.
        for (let i = -6; i <= 6; i++) {
            line([i, -5, -16], [i, 5, -16], '#42676922');
            line([-6, i, -16], [6, i, -16], '#42676922');
        }
        box(-4.7, -3.7, 9.4, 7.4, 10, ['#264744', '#1a3436', '#142b31', '#62877b'], -10);
        if (place.id === 'kitchen' || place.id === 'workshop') {
            box(-4.5, -3.5, 9, .15, 140, ['#537a70', '#2c504b', '#223b42', '#6f9886']);
            for (let i = 0; i < 3; i++) {
                polygon([project(-3.6 + i * 2.7, -3.32, 50), project(-1.6 + i * 2.7, -3.32, 50), project(-1.6 + i * 2.7, -3.32, 116), project(-3.6 + i * 2.7, -3.32, 116)], '#426e67', '#83a998');
                line([-2.6 + i * 2.7, -3.3, 51], [-2.6 + i * 2.7, -3.3, 115], '#88ad96');
            }
        }
        if (place.id === 'kitchen') {
            box(-3.8, -2.8, 6.6, .9, 38, ['#739386', '#496c5f', '#395850', accent]);
            table(-2, .1, 4.7, 1.7, '#b3a17d');
            for (let i = 0; i < 4; i++) {
                plane(-1.5 + i, .5, .45, .6, 35, '#d7d6b7', '#8fa58b');
            }
            arm(1, -2.3, 39, -48 - moment * 8, accent, time * .8);
            const steam = project(-.25, -2.3, 58);
            p.noStroke(); p.fill('#c7e0ce66');
            for (let i = 0; i < 3; i++) p.circle(steam.x + Math.sin(time + i) * 6, steam.y - 10 - ((time * 10 + i * 13) % 40), 4 + i);
            box(-.6, -2.6, .6, .6, 18, ['#bfd1bd', '#61877a', '#476a63'], 38);
            person(-2.8, -.5, '#d3ab7d');
            person(-1, 2.2, '#a4bdab', time, true);
            person(2.4, 2.2, '#c29e85', time, true);
            robot(3.5, .7 + (moment === 1 ? Math.sin(time * .5) * .5 : 0), time, true, 1.4);
            pot(-3.7, -2.4, 40);
        } else if (place.id === 'workshop') {
            table(-2.5, -.7, 4.5, 2.4, '#8a9b9b', 38);
            const shift = moment === 1 ? Math.sin(time * .7) * .15 : 0;
            plane(-1.2, -.2, 1.8 + shift, 1.2, 43, '#9fbcb5', accent, 1.4);
            line([-.3, -.2, 44], [-.3, 1, 44], '#5b8f83', 1);
            box(2.3, -1.7, .8, 1, 38, ['#b7cbd0', '#58777e', '#405b69', accent]);
            arm(2.6, -1.2, 39, -60, accent, moment === 1 ? time : 0);
            arm(1, -1.5, 39, -45, accent, moment === 1 ? time + 1 : 0);
            person(-3.1, .4, '#d3ac82', time);
            person(-1.3, 2.3, '#a3bbac', time);
            for (let i = 0; i < 3; i++) plane(.9, .5, .75, .8, 44 + i * 5, i % 2 ? '#c2b498' : '#adbea6', '#719184');
            box(-4, -2.8, 1.5, .6, 40, ['#7e8c98', '#455b69', '#354954', accent]);
            pot(3.8, 2.5, 0);
        } else if (place.id === 'transit') {
            plane(-4.6, -.3, 9.2, 1.6, 1, '#182d33', '#5b8380');
            for (let i = -4; i < 5; i++) line([i, .5, 2], [i + .4, .5, 2], '#d1bb8f', 2);
            const move = action > 0 ? -3 * (1 - action) : 0;
            box(-1.6 + move, -.1, 3.2, 1.1, 12, ['#90c8cc', '#4c7d88', '#325965', accent], 7);
            box(-1.35 + move, -.02, 2.7, .95, 34, ['#b0d8d3', '#315860', '#24424d', accent], 19);
            for (let i = 0; i < 4; i++) plane(-1.1 + i * .55 + move, .1, .35, .65, 54, '#517e82', '#8cc6cb');
            for (const wheel of [-.9, 1]) {
                const q = project(wheel + move, 1.05, 7);
                p.fill('#101e25'); p.stroke('#7eb0b0'); p.ellipse(q.x, q.y, 15, 19);
            }
            for (let i = -3; i <= 3; i += 3) box(i, -2.8, .1, 1.1, 90, ['#88ad9d', '#5a8479', '#40675f', accent]);
            plane(-3.5, -3, 7, 1.5, 91, '#547d8166', accent);
            person(-2, -1.3, '#d5b28d', time);
            person(.2, -1.3, '#c2bcc5', time);
            robot(3, 2.2, time, true, 1.3);
            box(3.7, -2, .1, .6, 55, ['#b5d7c5', '#699b8f', '#456b67', accent]);
        } else if (place.id === 'garden') {
            for (let u = -3.6; u < 4; u += 2.4) {
                box(u, -2.8, 1.4, 5.4, 12, ['#29493a', '#54724f', '#3c5c43', accent]);
                for (let v = -2.4; v < 2.5; v += .8) {
                    pot(u + .4, v, 13, '#9bc28a'); pot(u + 1, v + .2, 13, '#75a781');
                }
            }
            for (let u = -4.3; u <= 4.3; u += 2.15) {
                line([u, -3.2, 0], [u, -3.2, 100], '#83b2a766', 2);
                line([u, -3.2, 100], [u, 0, 158], '#83b2a766', 2);
                line([u, 0, 158], [u, 3.2, 100], '#83b2a766', 2);
                line([u, 3.2, 100], [u, 3.2, 0], '#83b2a766', 2);
            }
            line([-4.3, 0, 158], [4.3, 0, 158], accent);
            person(-1.65, 1.7, '#dbb589', time);
            robot(.7, moment === 1 ? Math.sin(time * .35) * 1.7 : -1, time, false, 1.4);
        } else if (place.id === 'commons') {
            box(-3.5, -3, 7, 1.6, 15, ['#796574', '#544452', '#393644', accent]);
            for (const u of [-3.5, 3.5]) box(u, -2.8, .12, .12, 130, ['#96a598', '#648778', '#476658']);
            for (let i = 0; i <= 12; i++) {
                const u = -3.5 + i * 7 / 12;
                const z = 125 - Math.sin(i / 12 * Math.PI) * 22;
                if (i < 12) line([u, -2.8, z], [u + 7 / 12, -2.8, 125 - Math.sin((i + 1) / 12 * Math.PI) * 22], '#d1c1a0');
                const q = project(u, -2.8, z);
                p.noStroke(); p.fill('#ead9a577'); p.circle(q.x, q.y + 4, 15);
                p.fill('#f3e2b7'); p.circle(q.x, q.y + 4, 5);
            }
            table(-2.5, .2, 4.5, 1.4, '#ad8f85');
            for (let i = 0; i < 4; i++) person(-2 + i * 1.1, 2, i % 2 ? '#d4b08b' : '#9fb8a6', time, true);
            person(0, -2.2, '#ccabbd', time);
            robot(3.2, moment === 1 ? Math.sin(time * .3) * 1.4 : 1.2, time, true, 1.2);
            tree(-3.8, 2.5, 1.7); tree(4, -1.5, 1.6);
        } else {
            box(-4, -3, 2, 5, 85, ['#a49c79', '#617361', '#3a544a', accent], 0, true);
            box(2, -3, 2, 5, 85, ['#a49c79', '#617361', '#3a544a', accent], 0, true);
            for (let i = 0; i < 3; i++) {
                tree(-1.2, -2.6 + i * 1.2, .9);
                plane(-.3, -3 + i * 1.4, 1, 1, 1, '#80938155', '#9cb59a');
            }
            const q = project(-.3, 1.7);
            p.stroke('#a6c8be'); p.strokeWeight(3); p.noFill(); p.circle(q.x, q.y - 5, 29);
            person(-.3, 1.7, '#c9b48a', 0, true);
            person(.6, 2.3, '#a9bbab', time);
            robot(1, moment === 1 ? .6 + Math.sin(time * .4) * .6 : .3, time, true, 1.2);
            table(-1.8, 2.6, 1.6, .5, '#a8a17e', 17);
        }
        // The action leaves a visible result in the miniature, even with motion paused.
        if (action > 0) {
            if (place.id === 'kitchen') {
                for (let i = 0; i < Math.ceil(action * 4); i++) {
                    const q = project(-1.3 + i, .8, 39);
                    p.noStroke(); p.fill('#f0c887'); p.ellipse(q.x, q.y, 22, 11);
                    p.fill('#91b078'); p.ellipse(q.x - 4, q.y - 1, 8, 5);
                    p.fill('#d88d6e'); p.ellipse(q.x + 4, q.y, 7, 4);
                }
            } else if (place.id === 'workshop') {
                plane(-1.2, -.2, 1.8 * (1 - action * .5), 1.2, 45, '#c5d9bd', '#e0ebd1', 2);
                line([-1.2 + .9 * action, -.2, 46], [-1.2 + .9 * action, 1, 46], '#edf1d4', 2);
            } else if (place.id === 'transit') {
                const q = project(-2, -1.3, 45);
                p.noFill(); p.stroke('#b9efcf'); p.strokeWeight(2);
                p.circle(q.x, q.y, 24 + Math.sin(time * 3) * 5);
                p.noStroke(); p.fill('#d5f4d8'); p.textSize(18); p.textAlign(p.CENTER); p.text('✓', q.x, q.y + 6);
            } else if (place.id === 'garden') {
                for (let i = 0; i < 50; i++) {
                    const u = -3.8 + (i * 1.73 % 7.5);
                    const v = -2.5 + (i * .79 % 5);
                    const z = action === 1 ? 24 : 28 + ((i * 13 - time * 40) % 70 + 70) % 70;
                    const q = project(u, v, z);
                    p.stroke('#a7e0dd'); p.strokeWeight(2); p.line(q.x, q.y, q.x - 2, q.y + 5);
                }
            } else if (place.id === 'commons') {
                for (let i = 0; i < 7; i++) {
                    const q = project(-3 + i, -1.9, 55 + Math.sin(time * 2 + i) * 12);
                    p.noStroke(); p.fill(['#efbbcf', '#f3d891', '#b9efae'][i % 3]);
                    p.textSize(25); p.text('♪', q.x, q.y);
                }
                for (let i = 0; i < 3; i++) person(-1 + i, -.5 + Math.sin(time * 2 + i) * .2, '#d4b4c4', time * 5);
            } else {
                const u = 1 - action * 1.3;
                box(u, 1.7, .35, .3, 13, ['#e4c390', '#bb9569', '#917855'], 5);
                const q = project(-.3, 1.7, 60);
                p.fill('#efbbcf'); p.noStroke(); p.textSize(24); p.text('♥', q.x, q.y);
            }
        }
        p.pop();
        peopleScale = 1;
    }
    return { project, polygon, plane, line, box, tree, person, robot, landmark, scene };
};
