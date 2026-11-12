/* A small p5.js illustration, not a robot controller or physics simulation.
   Coordinates use a 1000 x 540 drawing space, scaled to fit the page.
   Choose a destination with ordinary HTML buttons (also keyboard accessible). */
(() => {
    const container = document.getElementById('community-sketch');
    if (!container || !window.p5) return;

    const fallback = document.getElementById('sketch-fallback');
    const controls = document.getElementById('sketch-controls');
    const toggle = document.getElementById('motion-toggle');
    const status = document.getElementById('sketch-status');
    const buttons = [...document.querySelectorAll('[data-destination]')];
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = motionPreference.matches;
    let inView = true;
    let elapsed = 0;
    let destination = 'kitchen';
    let route = [];
    const robot = { x: 500, y: 330 };
    const stops = {
        kitchen: { x: 210, y: 270, text: 'Bringing ingredients to the shared kitchen.', arrived: 'Ingredients delivered. The neighbors can start cooking.' },
        workshop: { x: 790, y: 270, text: 'Taking clean towels to the workshop.', arrived: 'Towels delivered. Time for a folding lesson.' },
        garden: { x: 500, y: 408, text: 'Carrying gardening tools to the courtyard.', arrived: 'Tools delivered. The neighbors are ready to plant.' }
    };

    new window.p5((p) => {
        function updatePlayback() {
            toggle.textContent = paused ? 'Play animation' : 'Pause animation';
            if (paused || !inView || document.hidden) {
                p.noLoop();
                p.redraw();
            } else {
                p.loop();
            }
        }

        function chooseStop(name) {
            destination = name;
            const stop = stops[name];
            // A simple shared walkway links all three places.
            route = [{ x: robot.x, y: 330 }, { x: stop.x, y: 330 }, { x: stop.x, y: stop.y }];
            buttons.forEach((button) => {
                button.setAttribute('aria-pressed', String(button.dataset.destination === name));
            });
            status.textContent = stop.text + (paused ? ' Press Play animation to watch the delivery.' : '');
            p.redraw();
        }

        function tree(x, y, size) {
            p.stroke('#83936e');
            p.strokeWeight(5);
            p.line(x, y + size, x, y);
            p.noStroke();
            p.fill('#94aa7d');
            p.circle(x, y - 7, size * 1.5);
            p.circle(x - size * 0.4, y + size * 0.2, size);
        }

        function house(x, title, color) {
            p.noStroke();
            p.fill(color);
            p.triangle(x - 14, 130, x + 140, 57, x + 294, 130);
            p.fill('#ede4ce');
            p.rect(x, 130, 280, 128, 4);
            p.fill('#aec2aa');
            p.rect(x + 25, 177, 72, 56, 20, 20, 2, 2);
            p.stroke('#7a8b70');
            p.strokeWeight(3);
            p.line(x + 61, 178, x + 61, 232);
            p.noStroke();
            p.fill('#859a79');
            p.rect(x + 160, 174, 66, 84, 28, 28, 0, 0);
            p.fill('#334f3c');
            p.textAlign(p.CENTER);
            p.textSize(p.width < 600 ? 30 : 23);
            p.text(title, x + 140, 159);
        }

        function person(x, y, color) {
            const step = Math.sin(elapsed * 3 + x * 0.01) * 4;
            p.stroke('#52664f');
            p.strokeWeight(6);
            p.line(x - 5, y + 13, x - 7 - step, y + 28);
            p.line(x + 5, y + 13, x + 7 + step, y + 28);
            p.noStroke();
            p.fill(color);
            p.rect(x - 12, y - 10, 24, 30, 8);
            p.fill('#c79673');
            p.circle(x, y - 20, 21);
        }

        function drawRobot() {
            p.push();
            p.translate(robot.x, robot.y);
            p.noStroke();
            p.fill('#445d4d');
            p.circle(-12, 19, 12);
            p.circle(12, 19, 12);
            p.stroke('#6c826d');
            p.strokeWeight(2);
            p.fill('#f2f0de');
            p.rect(-22, -21, 44, 39, 12);
            p.noStroke();
            p.fill('#6c826d');
            p.rect(-14, -12, 28, 10, 5);
            p.fill('#f4efda');
            p.circle(-6, -7, 3);
            p.circle(6, -7, 3);
            p.fill('#b88d67');
            p.rect(-17, -34, 34, 13, 2);
            p.pop();
        }

        p.setup = () => {
            // Unhide before measuring; keep the SVG visible until setup succeeds.
            container.hidden = false;
            const width = container.clientWidth;
            const canvas = p.createCanvas(width, width * 0.54);
            canvas.parent(container);
            canvas.attribute('role', 'img');
            canvas.attribute('aria-label', 'Animated imagined community: residents walk and gather while a small robot delivers items between the kitchen, workshop, and garden. Use the buttons below to choose its destination or pause.');
            p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
            p.frameRate(30);
            p.textFont('Arial');
            fallback.hidden = true;
            controls.hidden = false;
            buttons.forEach((button) => {
                button.addEventListener('click', () => chooseStop(button.dataset.destination));
            });
            toggle.addEventListener('click', () => {
                paused = !paused;
                if (paused) status.textContent = 'Animation paused. Choose a destination, then press Play animation to continue.';
                else status.textContent = route.length ? stops[destination].text : stops[destination].arrived;
                updatePlayback();
            });
            motionPreference.addEventListener('change', (event) => {
                if (event.matches) {
                    paused = true;
                    status.textContent = 'Animation paused for reduced motion. You can play it using the button.';
                    updatePlayback();
                }
            });
            document.addEventListener('visibilitychange', updatePlayback);
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(([entry]) => {
                    inView = entry.isIntersecting;
                    updatePlayback();
                });
                observer.observe(container);
            }
            chooseStop('kitchen');
            updatePlayback();
        };

        p.windowResized = () => {
            p.resizeCanvas(container.clientWidth, container.clientWidth * 0.54);
        };

        p.draw = () => {
            const dt = paused || !inView || document.hidden ? 0 : Math.min(p.deltaTime / 1000, 0.05);
            elapsed += dt;
            if (route.length && dt > 0) {
                const target = route[0];
                const distance = Math.hypot(target.x - robot.x, target.y - robot.y);
                const step = 80 * dt;
                if (distance <= step) {
                    robot.x = target.x;
                    robot.y = target.y;
                    route.shift();
                    if (!route.length) status.textContent = stops[destination].arrived;
                } else {
                    robot.x += (target.x - robot.x) / distance * step;
                    robot.y += (target.y - robot.y) / distance * step;
                }
            }

            p.background('#e6e8d5');
            p.push();
            p.scale(p.width / 1000);
            // Paths connect the places; the garden stays a place to gather.
            p.noStroke();
            p.fill('#c0cca9');
            p.rect(0, 275, 1000, 265);
            p.stroke('#f4efdd');
            p.strokeWeight(58);
            p.line(0, 330, 1000, 330);
            p.line(210, 255, 210, 330);
            p.line(790, 255, 790, 330);
            p.line(500, 330, 500, 420);
            house(70, 'Kitchen', '#8c9c78');
            house(650, 'Workshop', '#b18c6c');
            tree(40, 220, 36);
            tree(960, 204, 42);
            tree(522, 130, 40);
            p.noStroke();
            p.fill('#ab8966');
            p.rect(235, 420, 155, 66, 5);
            p.rect(610, 420, 155, 66, 5);
            for (let x = 255; x < 385; x += 36) {
                p.fill('#718d62');
                p.ellipse(x, 437, 15, 23);
                p.ellipse(x + 355, 449, 19, 26);
            }
            p.fill('#3c6048');
            p.textAlign(p.CENTER);
            p.textSize(p.width < 600 ? 30 : 23);
            p.text('Courtyard garden', 500, 515);
            // A warm destination ring is a visual cue, not a navigation algorithm.
            const stop = stops[destination];
            p.noFill();
            p.stroke('#c19859');
            p.strokeWeight(3);
            p.ellipse(stop.x, stop.y + 14, 70, 28);
            person(115 + ((elapsed * 16) % 770), 375, '#b98664');
            person(885 - ((elapsed * 12) % 770), 300, '#7f9678');
            person(425, 440, '#bd9974');
            person(577, 445, '#8b9d80');
            drawRobot();
            p.pop();
        };
    });
})();
