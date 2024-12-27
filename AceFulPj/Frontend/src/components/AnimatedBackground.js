import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const AnimatedBackground = () => {
    const sketchRef = useRef();

    useEffect(() => {
        const sketch = (p) => {
            const Particles = [];

            const opt = {
                particles: 800,
                noiseScale: 0.01,
                angle: -90,
                strokeWeight: 1.2,
                tail: 82,
            };

            class Particle {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.lx = x;
                    this.ly = y;
                    this.vx = 0;
                    this.vy = 0;
                    this.ax = 0;
                    this.ay = 0;
                }

                follow() {
                    const angle = p.noise(this.x * opt.noiseScale, this.y * opt.noiseScale) * p.TWO_PI;
                    this.ax += Math.cos(angle);
                    this.ay += Math.sin(angle);
                }

                update() {
                    this.follow();
                    this.vx += this.ax;
                    this.vy += this.ay;
                    this.vx *= 0.5;
                    this.vy *= 0.5;
                    this.x += this.vx;
                    this.y += this.vy;
                    this.ax = 0;
                    this.ay = 0;

                    if (this.x < 0) this.x = p.width;
                    if (this.x > p.width) this.x = 0;
                    if (this.y < 0) this.y = p.height;
                    if (this.y > p.height) this.y = 0;
                }

                render() {
                    p.stroke(255, 255, 255, 50);
                    p.line(this.x, this.y, this.lx, this.ly);
                    this.lx = this.x;
                    this.ly = this.y;
                }
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                for (let i = 0; i < opt.particles; i++) {
                    Particles.push(new Particle(p.random(p.width), p.random(p.height)));
                }
                p.strokeWeight(opt.strokeWeight);
            };

            p.draw = () => {
                p.background(0, 100 - opt.tail);
                for (let particle of Particles) {
                    particle.update();
                    particle.render();
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        const p5Instance = new p5(sketch, sketchRef.current);
        return () => p5Instance.remove();
    }, []);

    return <div ref={sketchRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default AnimatedBackground;
