// ============================================================
// scene3d.js — Cenas 3D com Three.js (hero e CTA final)
// Objetos de "noite de jogos" a flutuar: d20, dados, cartas,
// ficha de póquer, donut e partículas. Seguem o rato, reagem
// ao scroll (via motion.js) e mudam de cor com o carrossel.
// Se o Three.js ou o WebGL falharem, o site continua igual,
// só sem 3D.
// ============================================================

const Scene3D = (() => {
  const reduceMotion = prefersReducedMotion();

  function supported() {
    if (typeof THREE === 'undefined') return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }

  // ---------- Texturas desenhadas num <canvas> 2D ----------

  function roundedRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function makeTexture(width, height, draw) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    draw(c.getContext('2d'), width, height);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return tex;
  }

  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

  function diceFace(value, bg, dot) {
    return makeTexture(256, 256, (g, s) => {
      g.fillStyle = bg;
      g.fillRect(0, 0, s, s);
      g.fillStyle = dot;
      PIPS[value].forEach(i => {
        const cx = 64 + (i % 3) * 64;
        const cy = 64 + Math.floor(i / 3) * 64;
        g.beginPath();
        g.arc(cx, cy, 22, 0, Math.PI * 2);
        g.fill();
      });
    });
  }

  function cardFace(rank, suit, ink) {
    return makeTexture(256, 360, (g, w, h) => {
      g.fillStyle = '#F2F5F3';
      roundedRect(g, 0, 0, w, h, 26);
      g.fill();
      g.fillStyle = ink;
      g.font = '800 64px "Barlow Condensed", Arial, sans-serif';
      g.textAlign = 'left';
      g.fillText(rank, 22, 70);
      g.font = '48px Arial';
      g.fillText(suit, 24, 120);
      g.font = '170px Arial';
      g.textAlign = 'center';
      g.fillText(suit, w / 2, h / 2 + 60);
    });
  }

  function chipFace(color) {
    return makeTexture(256, 256, (g, s) => {
      g.fillStyle = color;
      g.beginPath();
      g.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#F2F5F3';
      for (let k = 0; k < 8; k++) {
        g.save();
        g.translate(s / 2, s / 2);
        g.rotate((k / 8) * Math.PI * 2);
        g.fillRect(-12, -s / 2 + 4, 24, 34);
        g.restore();
      }
      g.strokeStyle = 'rgba(10,18,0,.5)';
      g.lineWidth = 6;
      g.setLineDash([10, 10]);
      g.beginPath();
      g.arc(s / 2, s / 2, 70, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = '#0A1200';
      g.font = '800 96px "Barlow Condensed", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('B', s / 2, s / 2 + 6);
    });
  }

  // ---------- Criação de uma cena ----------

  function create(canvas, { variant = 'hero', color = '#A6FF3D', surface = canvas.parentElement } = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const tint = new THREE.Color(color);
    const tintTarget = new THREE.Color(color);

    // Luzes: uma com a cor do slide, uma rosa e uma azul para dar volume
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(5, 6, 8);
    scene.add(sun);
    const keyLight = new THREE.PointLight(tint.clone(), 1.8, 30);
    keyLight.position.set(4, 2, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xff3d7f, 1.6, 30);
    rimLight.position.set(-5, -3, 3);
    scene.add(rimLight);
    const backLight = new THREE.PointLight(0x3da5ff, 1.2, 30);
    backLight.position.set(0, 5, -4);
    scene.add(backLight);

    const world = new THREE.Group();
    scene.add(world);
    const items = [];
    const tintedColor = [];     // materiais cuja .color segue a cor do slide
    const tintedEmissive = [];  // materiais cujo brilho (.emissive) segue a cor

    function add(mesh, x, y, z, { amp = 0.18, speed = 0.8, spin = [0.2, 0.3, 0] } = {}) {
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      world.add(mesh);
      items.push({
        mesh,
        base: mesh.position.clone(),
        amp,
        speed,
        phase: Math.random() * Math.PI * 2,
        spin: new THREE.Vector3(...spin),
        boost: new THREE.Vector3(),  // rotação extra quando se clica no objeto
        jump: 0,                     // altura do salto
        jumpVel: 0,
        hover: 1,                    // escala atual (cresce com o rato em cima)
        baseScale: null
      });
      return mesh;
    }

    // d20 (o "herói" da cena) com arestas a brilhar
    const d20Mat = new THREE.MeshStandardMaterial({ color: 0x0c0f11, metalness: 0.5, roughness: 0.35, flatShading: true, emissive: tint.clone(), emissiveIntensity: 0.06 });
    const d20 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 0), d20Mat);
    const edgeMat = new THREE.LineBasicMaterial({ color: tint.clone(), transparent: true, opacity: 0.9 });
    d20.add(new THREE.LineSegments(new THREE.EdgesGeometry(d20.geometry), edgeMat));
    tintedColor.push(edgeMat);
    tintedEmissive.push(d20Mat);

    // Dados: faces opostas somam 7 (+x/-x, +y/-y, +z/-z)
    const order = [1, 6, 2, 5, 3, 4];
    const whiteDie = order.map(v => new THREE.MeshStandardMaterial({ map: diceFace(v, '#F2F5F3', '#0A0C0D'), roughness: 0.35 }));
    const pinkDie = order.map(v => new THREE.MeshStandardMaterial({ map: diceFace(v, '#FF3D7F', '#F2F5F3'), roughness: 0.35 }));
    const dieGeo = new THREE.BoxGeometry(1, 1, 1);

    const cardGeo = new THREE.PlaneGeometry(0.95, 1.34);
    const cardA = new THREE.MeshStandardMaterial({ map: cardFace('A', '♠', '#0A0C0D'), side: THREE.DoubleSide, roughness: 0.5 });
    const cardK = new THREE.MeshStandardMaterial({ map: cardFace('K', '♥', '#E0244F'), side: THREE.DoubleSide, roughness: 0.5 });

    const chipTop = new THREE.MeshStandardMaterial({ map: chipFace('#A6FF3D'), roughness: 0.4 });
    const chipSide = new THREE.MeshStandardMaterial({ color: 0xa6ff3d, roughness: 0.4 });
    const chip = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 48), [chipSide, chipTop, chipTop]);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.2, 24, 64),
      new THREE.MeshStandardMaterial({ color: 0xff3d7f, metalness: 0.55, roughness: 0.25 })
    );
    const octa = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.MeshStandardMaterial({ color: 0x3da5ff, metalness: 0.4, roughness: 0.3, flatShading: true })
    );

    if (variant === 'hero') {
      add(d20, 0, 0.2, 0, { amp: 0.22, speed: 0.6, spin: [0.15, 0.25, 0.05] });
      add(new THREE.Mesh(dieGeo, whiteDie), -2.1, 1.5, 0.6, { spin: [0.4, 0.5, 0.1] });
      add(new THREE.Mesh(dieGeo, pinkDie), 1.9, -1.6, 0.9, { speed: 1, spin: [-0.3, 0.45, 0.2] }).scale.setScalar(0.8);
      add(torus, 2.1, 1.7, -0.6, { spin: [0.5, 0.2, 0] });
      add(octa, -1.8, -1.6, 0.3, { speed: 1.1, spin: [0.3, 0.6, 0] });
      add(new THREE.Mesh(cardGeo, cardA), -0.7, 2.4, -1.4, { amp: 0.25, speed: 0.5, spin: [0.1, 0.35, 0.05] });
      add(new THREE.Mesh(cardGeo, cardK), 0.6, -2.5, -1, { amp: 0.25, speed: 0.55, spin: [-0.1, 0.3, 0.08] });
      add(chip, 2.9, 0.1, 0.4, { speed: 0.9, spin: [0.6, 0.1, 0.3] });
    } else {
      // CTA: objetos em anel, a girar devagar à volta do d20
      add(d20, 0, 0, 0, { amp: 0.15, speed: 0.6, spin: [0.15, 0.25, 0.05] }).scale.setScalar(0.8);
      const ring = [
        new THREE.Mesh(dieGeo, whiteDie), torus, new THREE.Mesh(cardGeo, cardA),
        chip, new THREE.Mesh(dieGeo, pinkDie), octa, new THREE.Mesh(cardGeo, cardK)
      ];
      ring.forEach((mesh, k) => {
        const a = (k / ring.length) * Math.PI * 2;
        add(mesh, Math.cos(a) * 2.4, Math.sin(a * 2) * 0.5, Math.sin(a) * 2.4, { speed: 0.7 + k * 0.05, spin: [0.3, 0.4, 0.1] });
        mesh.scale.multiplyScalar(0.75);
      });
    }

    // Partículas de fundo
    const COUNT = variant === 'hero' ? 600 : 250;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -Math.random() * 12 + 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({ color: tint.clone(), size: 0.045, transparent: true, opacity: 0.7, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    tintedColor.push(dustMat);

    // ---------- Estado ----------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;
    let kick = 0;           // impulso de rotação quando muda o slide
    let running = false;
    let visible = true;
    let rafId = null;
    let layout = { x: 0, y: 0, scale: 1 };
    const clock = new THREE.Clock();

    // Interação: arrastar roda o grupo (com inércia), hover destaca, clique faz saltar
    const drag = { active: false, moved: 0, lastX: 0, lastY: 0, x: 0, y: 0, vx: 0, vy: 0 };
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = null;

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Largura visível no plano z=0, para encostar o grupo à direita
      const visibleW = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
      const wide = w > (variant === 'hero' ? 960 : 720);
      layout = wide
        ? { x: visibleW * (variant === 'hero' ? 0.2 : 0.24), y: 0, scale: 1 }
        : { x: 0, y: variant === 'hero' ? 1.6 : 1.1, scale: variant === 'hero' ? 0.7 : 0.6 };
      if (!running) render(0);
    }

    function applyTint() {
      tint.lerp(tintTarget, 0.06);
      keyLight.color.copy(tint);
      tintedColor.forEach(m => m.color.copy(tint));
      tintedEmissive.forEach(m => m.emissive.copy(tint));
    }

    function render(dt) {
      const t = clock.elapsedTime;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      kick *= 0.94;

      items.forEach(item => {
        if (item.baseScale === null) item.baseScale = item.mesh.scale.x;

        // Salto com "gravidade"
        item.jumpVel -= 14 * dt;
        item.jump = Math.max(0, item.jump + item.jumpVel * dt);
        if (item.jump === 0) item.jumpVel = 0;

        item.boost.multiplyScalar(0.96);
        item.hover += ((item === hovered ? 1.2 : 1) - item.hover) * 0.15;

        item.mesh.position.y = item.base.y + Math.sin(t * item.speed + item.phase) * item.amp + item.jump;
        item.mesh.rotation.x += (item.spin.x * (1 + kick) + item.boost.x) * dt;
        item.mesh.rotation.y += (item.spin.y * (1 + kick) + item.boost.y) * dt;
        item.mesh.rotation.z += (item.spin.z + item.boost.z) * dt;
        item.mesh.scale.setScalar(item.baseScale * item.hover);
      });

      // Inércia depois de largar o arrasto
      if (!drag.active) {
        drag.y += drag.vy;
        drag.x += drag.vx;
        drag.vy *= 0.95;
        drag.vx *= 0.95;
      }
      drag.x = Math.max(-0.9, Math.min(0.9, drag.x));

      const ringSpin = variant === 'cta' ? t * 0.25 : 0;
      world.rotation.y = pointer.x * 0.35 + scroll * 0.9 + ringSpin + kick * 0.15 + drag.y;
      world.rotation.x = pointer.y * 0.2 + scroll * 0.3 + drag.x;
      world.position.set(layout.x, layout.y + scroll * 2.2, 0);
      world.scale.setScalar(layout.scale * (1 - scroll * 0.15));

      dust.rotation.y = t * 0.02 + pointer.x * 0.1;
      dust.position.y = scroll * 1.2;

      applyTint();
      renderer.render(scene, camera);
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      render(Math.min(clock.getDelta(), 0.05));
    }

    function start() {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      clock.getDelta();
      loop();
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // Só anima quando o canvas está no ecrã e a aba está ativa
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(canvas);
    }

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    window.addEventListener('pointermove', e => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // ---------- Interação com os objetos ----------
    // O canvas está por baixo do texto, por isso os eventos são
    // ouvidos na secção que o contém (surface) e convertidos.
    const isControl = target => target instanceof Element && target.closest('a, button, input, select, textarea');

    function pick(e) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(items.map(i => i.mesh), false)[0];
      return hit ? items.find(i => i.mesh === hit.object) : null;
    }

    function poke(item) {
      item.jumpVel = 5.5;
      item.boost.set((Math.random() - 0.5) * 24, 14 + Math.random() * 12, (Math.random() - 0.5) * 10);
      kick = Math.max(kick, 1.5);
    }

    surface.style.touchAction = 'pan-y';   // no telemóvel, o scroll vertical continua a funcionar

    surface.addEventListener('pointerdown', e => {
      if (isControl(e.target)) return;
      if (e.pointerType === 'mouse') e.preventDefault();   // evita selecionar texto ao arrastar
      drag.active = true;
      drag.moved = 0;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.vx = drag.vy = 0;
    });

    window.addEventListener('pointermove', e => {
      if (drag.active) {
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        drag.vy = dx * 0.006;
        drag.vx = dy * 0.004;
        drag.y += drag.vy;
        drag.x += drag.vx;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        surface.style.cursor = 'grabbing';
        return;
      }
      if (!surface.contains(e.target) || isControl(e.target)) {
        hovered = null;
        return;
      }
      hovered = pick(e);
      surface.style.cursor = hovered ? 'pointer' : 'grab';
    }, { passive: true });

    window.addEventListener('pointerup', e => {
      if (!drag.active) return;
      drag.active = false;
      surface.style.cursor = '';
      // Quase sem movimento = clique: o objeto por baixo salta e gira
      if (drag.moved < 6) {
        const item = pick(e);
        if (item) poke(item);
      }
    });

    surface.addEventListener('pointerleave', () => {
      hovered = null;
    });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    resize();
    start();

    return {
      setTint(hex) {
        tintTarget.set(hex);
        if (!running) {
          tint.copy(tintTarget);
          render(0);
        }
      },
      setScroll(p) {
        scroll = p;
        if (!running) render(0);
      },
      kick() {
        kick = 6;
      },
      // Faz todos os objetos saltar (usado ao mudar de slide)
      pokeAll() {
        items.forEach(poke);
      }
    };
  }

  return { create, supported };
})();

// Cria as cenas da página (window.Scenes fica vazio se não houver 3D)
window.Scenes = (() => {
  const scenes = {};
  if (!Scene3D.supported()) return scenes;

  const heroCanvas = document.getElementById('hero-canvas');
  const ctaCanvas = document.getElementById('cta-canvas');

  try {
    if (heroCanvas) scenes.hero = Scene3D.create(heroCanvas, { variant: 'hero' });
    if (ctaCanvas) scenes.cta = Scene3D.create(ctaCanvas, { variant: 'cta' });
  } catch (err) {
    console.warn('[Scene3D] 3D desligado:', err);
  }
  return scenes;
})();
