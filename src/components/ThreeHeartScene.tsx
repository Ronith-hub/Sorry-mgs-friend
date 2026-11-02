import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ApologyConfig } from '../types/apology';
import { soundFx } from '../utils/audio';

interface ThreeHeartSceneProps {
  config: ApologyConfig;
  onForgive: () => void;
  onExploreClick: () => void;
}

/**
 * Procedural soft glowing pink sparkle flare texture (zero external files)
 */
function createSparkleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Soft luminous radial glow
  const radGrad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radGrad.addColorStop(0.18, 'rgba(255, 214, 235, 0.95)');
  radGrad.addColorStop(0.42, 'rgba(244, 114, 182, 0.6)');
  radGrad.addColorStop(0.72, 'rgba(236, 72, 153, 0.22)');
  radGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');

  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 128, 128);

  // Soft 4-pointed sparkle star lens flare in the center
  const flareGrad = ctx.createRadialGradient(64, 64, 0, 64, 64, 52);
  flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = flareGrad;
  ctx.beginPath();
  ctx.moveTo(64, 18);
  ctx.quadraticCurveTo(64, 64, 110, 64);
  ctx.quadraticCurveTo(64, 64, 64, 110);
  ctx.quadraticCurveTo(64, 64, 18, 64);
  ctx.quadraticCurveTo(64, 64, 64, 18);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ThreeHeartScene: React.FC<ThreeHeartSceneProps> = ({
  config,
  onForgive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const configRef = useRef(config);
  configRef.current = config;
  const onForgiveRef = useRef(onForgive);
  onForgiveRef.current = onForgive;

  const heartMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const apologyDomRef = useRef<HTMLElement | null>(null);
  const sparkleMaterialRef = useRef<THREE.PointsMaterial | null>(null);

  // Update DOM content inside CSS2DObject whenever config changes
  useEffect(() => {
    if (!apologyDomRef.current) return;
    const dom = apologyDomRef.current;

    const kickerEl = dom.querySelector('.css2d-kicker-text');
    if (kickerEl) {
      kickerEl.textContent = `To My Bestie ${config.friendName || ''}`;
    }

    const titleEl = dom.querySelector('.css2d-title');
    if (titleEl) {
      titleEl.textContent = config.forgiven ? 'Thank You!' : 'I am sorry';
    }

    const subEl = dom.querySelector('.css2d-subtitle');
    if (subEl) {
      subEl.textContent = config.forgiven
        ? 'Best friends forever.'
        : `"${config.customMessage || 'Please forgive me.'}"`;
    }

    const btnEl = dom.querySelector<HTMLButtonElement>('.css2d-action-btn');
    if (btnEl) {
      if (config.forgiven) {
        btnEl.innerHTML = `<span>Forgiven! ❤️</span>`;
        btnEl.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      } else {
        btnEl.innerHTML = `<span>I forgive you ✨</span>`;
        btnEl.style.background = 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)';
      }
    }

    // Update material colors for optimal contrast
    if (heartMaterialRef.current) {
      if (config.forgiven) {
        heartMaterialRef.current.color.setHex(0xb91c1c);
        heartMaterialRef.current.emissive.setHex(0xd97706);
        heartMaterialRef.current.emissiveIntensity = 0.45;
      } else {
        heartMaterialRef.current.color.setStyle(config.heartColor);
        heartMaterialRef.current.emissive.setStyle(config.heartEmissive);
        heartMaterialRef.current.emissiveIntensity = 0.22;
      }
    }

    // Update sparkles when forgiven
    if (sparkleMaterialRef.current) {
      if (config.forgiven) {
        sparkleMaterialRef.current.size = 2.2;
        sparkleMaterialRef.current.opacity = 0.95;
      } else {
        sparkleMaterialRef.current.size = 1.45;
        sparkleMaterialRef.current.opacity = 0.85;
      }
    }
  }, [config]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let animFrameId = 0;
    let isDisposed = false;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Create Heart Geometry from bezier curves
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 4);
    heartShape.bezierCurveTo(0, 8, -4, 10, -7, 10);
    heartShape.bezierCurveTo(-11, 10, -13, 4, -13, -1);
    heartShape.bezierCurveTo(-13, -8, -7, -12, 0, -17);
    heartShape.bezierCurveTo(7, -12, 13, -8, 13, -1);
    heartShape.bezierCurveTo(13, 4, 11, 10, 7, 10);
    heartShape.bezierCurveTo(4, 10, 0, 8, 0, 4);

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 4.2,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 1,
      bevelSize: 0.85,
      bevelThickness: 0.95,
      curveSegments: 28,
    });
    heartGeometry.center();
    heartGeometry.scale(1, -1, 1);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080106, 0.007);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 32);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Procedural Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. CSS2D Renderer for HTML Overlays
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'fixed';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.width = '100vw';
    labelRenderer.domElement.style.height = '100vh';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '5';
    containerRef.current.appendChild(labelRenderer.domElement);

    // 5. Main Heart Group
    const heartGroup = new THREE.Group();
    const isMobile = window.innerWidth < 768;
    heartGroup.position.set(isMobile ? 0 : 8, isMobile ? 3 : 0, 0);

    // High contrast deep velvet material
    const heartMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(configRef.current.heartColor),
      metalness: 0.25,
      roughness: 0.35,
      emissive: new THREE.Color(configRef.current.heartEmissive),
      emissiveIntensity: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
    });
    heartMaterialRef.current = heartMaterial;

    const mainHeartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    mainHeartMesh.scale.setScalar(1.85);
    heartGroup.add(mainHeartMesh);

    // 6. Glowing, Soft Pink Sparkles Particle System around the Heart
    const sparkleTexture = createSparkleTexture();
    const sparkleCount = 340;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);

    interface SparkleData {
      baseX: number;
      baseY: number;
      baseZ: number;
      currentY: number;
      driftSpeedY: number;
      swaySpeed: number;
      swayRadius: number;
      phase: number;
    }

    const sparkleData: SparkleData[] = [];
    const colorPalette = [
      new THREE.Color(0xffffff), // Pure white brilliant center
      new THREE.Color(0xffd1dc), // Soft blush pink
      new THREE.Color(0xf472b6), // Glowing rose
      new THREE.Color(0xfbcfe8), // Cotton candy pink
      new THREE.Color(0xf43f5e), // Warm coral pink
      new THREE.Color(0xff99c8), // Radiant cherry blossom
    ];

    for (let i = 0; i < sparkleCount; i++) {
      // Shape-guided distribution following heart contour & aura
      const t = Math.random() * Math.PI * 2;
      // Mathematical heart curve basis + random radial spread
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      const auraSpread = 0.42 + Math.random() * 0.45;
      const x = heartX * auraSpread + (Math.random() - 0.5) * 4;
      const y = heartY * auraSpread + (Math.random() - 0.5) * 4 + 1.0;
      const z = (Math.random() - 0.5) * 7.5;

      sparklePositions[i * 3] = x;
      sparklePositions[i * 3 + 1] = y;
      sparklePositions[i * 3 + 2] = z;

      // Color assigned with soft pink gradient
      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      sparkleColors[i * 3] = chosenColor.r;
      sparkleColors[i * 3 + 1] = chosenColor.g;
      sparkleColors[i * 3 + 2] = chosenColor.b;

      sparkleData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        currentY: y,
        driftSpeedY: 0.012 + Math.random() * 0.024,
        swaySpeed: 0.8 + Math.random() * 1.6,
        swayRadius: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const sparkleGeometry = new THREE.BufferGeometry();
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    const sparkleMaterial = new THREE.PointsMaterial({
      size: 1.45,
      map: sparkleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    sparkleMaterialRef.current = sparkleMaterial;

    const sparklePoints = new THREE.Points(sparkleGeometry, sparkleMaterial);
    // Add sparkles directly to heartGroup so they tilt, position, and float in sync with the heart
    heartGroup.add(sparklePoints);

    // 7. Reduced & High Contrast Centered CSS2DObject Overlay using HTML tags
    const apologyDom = document.createElement('article');
    apologyDom.className = 'css2d-apology-box';
    apologyDom.innerHTML = `
      <header class="css2d-header">
        <div class="css2d-kicker">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f472b6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="css2d-kicker-text">To My Bestie ${configRef.current.friendName || ''}</span>
        </div>
        <h1 class="css2d-title">${configRef.current.forgiven ? 'Thank You!' : 'I am sorry'}</h1>
      </header>
      <p class="css2d-subtitle">"${configRef.current.customMessage || 'Please forgive me.'}"</p>
      <button class="css2d-action-btn" type="button">
        <span>I forgive you ✨</span>
      </button>
    `;
    apologyDomRef.current = apologyDom;

    const forgiveBtn = apologyDom.querySelector('.css2d-action-btn');
    if (forgiveBtn) {
      forgiveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFx.playChime();
        onForgiveRef.current();
      });
    }

    apologyDom.addEventListener('click', () => {
      soundFx.playHeartbeat();
    });

    const css2dObject = new CSS2DObject(apologyDom);
    css2dObject.position.set(0, 0, 4.0);
    heartGroup.add(css2dObject);

    scene.add(heartGroup);

    // 8. Balanced Lighting for High Text Contrast
    const ambient = new THREE.AmbientLight(0xffe4e6, 0.45);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(12, 18, 16);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf472b6, 1.4);
    rimLight.position.set(-20, -12, 6);
    scene.add(rimLight);

    // 9. Starfield
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 350;
      starPositions[i + 1] = (Math.random() - 0.5) * 260;
      starPositions[i + 2] = (Math.random() - 0.5) * 200 - 30;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffd1dc,
      size: 0.38,
      transparent: true,
      opacity: 0.75,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 10. Floating mini hearts
    const miniHeartColors = [0x9d174d, 0xbe123c, 0xf43f5e, 0xf472b6, 0xfce7f3];
    const miniHearts: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      rotX: number;
      rotY: number;
      initialY: number;
      phase: number;
    }[] = [];

    const miniHeartGeom = heartGeometry.clone();
    miniHeartGeom.scale(0.24, 0.24, 0.24);

    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: miniHeartColors[i % miniHeartColors.length],
        emissive: 0x4a0429,
        emissiveIntensity: 0.18,
        roughness: 0.4,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(miniHeartGeom, mat);
      const radius = 18 + Math.random() * 22;
      const angle = (i / 14) * Math.PI * 2;
      const posX = Math.cos(angle) * radius;
      const posY = (Math.random() - 0.5) * 30;
      const posZ = (Math.random() - 0.5) * 25 - 8;

      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      scene.add(mesh);
      miniHearts.push({
        mesh,
        speedX: 0.005,
        speedY: 0.006,
        rotX: 0.008 + Math.random() * 0.01,
        rotY: 0.01 + Math.random() * 0.01,
        initialY: posY,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 11. Mouse & Scroll Syncing
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleCanvasClick = () => {
      soundFx.playHeartbeat();
      miniHearts.forEach((h) => {
        const nextColor = miniHeartColors[Math.floor(Math.random() * miniHeartColors.length)];
        (h.mesh.material as THREE.MeshStandardMaterial).color.setHex(nextColor);
      });
    };
    canvasRef.current.addEventListener('click', handleCanvasClick);

    // 12. Resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);

      if (w < 768) {
        heartGroup.position.x = 0;
        heartGroup.position.y = 4;
        camera.position.z = 36;
      } else {
        heartGroup.position.x = 7.5;
        heartGroup.position.y = 0.5;
        camera.position.z = 30;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // 13. Animation Loop with Sparkle Emission
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      const time = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const tempoMultiplier =
        configRef.current.tempo === 'gentle' ? 2.5 : configRef.current.tempo === 'fast' ? 5.2 : 3.8;

      const beat1 = Math.sin(time * tempoMultiplier);
      const beat2 = Math.sin(time * tempoMultiplier * 2);
      const pulse = Math.max(0, beat1) * 0.07 + Math.max(0, beat2) * 0.03;

      const baseScale = configRef.current.forgiven ? 2.05 : 1.85;
      mainHeartMesh.scale.setScalar(baseScale * (1 + pulse));

      const floatY = Math.sin(time * 1.5) * 0.45;
      heartGroup.position.y = (window.innerWidth < 768 ? 4 : 0.5) + floatY - scrollY * 0.008;

      heartGroup.rotation.x = mouse.y * 0.3 + Math.sin(time * 0.8) * 0.03;
      heartGroup.rotation.y = mouse.x * 0.4 + Math.cos(time * 0.7) * 0.05;

      // Update glowing soft pink sparkles around the heart
      const posAttr = sparkleGeometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < sparkleCount; i++) {
        const item = sparkleData[i];
        item.currentY += item.driftSpeedY;

        // Reset particle if it drifts too far up
        if (item.currentY > item.baseY + 12.0) {
          item.currentY = item.baseY - 4.0;
        }

        const sway = Math.sin(time * item.swaySpeed + item.phase) * item.swayRadius;
        const swayZ = Math.cos(time * item.swaySpeed + item.phase) * (item.swayRadius * 0.6);

        positions[i * 3] = item.baseX + sway;
        positions[i * 3 + 1] = item.currentY;
        positions[i * 3 + 2] = item.baseZ + swayZ;
      }
      posAttr.needsUpdate = true;

      // Subtle pulse on sparkle size & opacity
      if (sparkleMaterialRef.current) {
        const twinkle = Math.sin(time * 3.5) * 0.08;
        sparkleMaterialRef.current.opacity = (configRef.current.forgiven ? 0.95 : 0.85) + twinkle;
      }

      // Floating mini hearts
      miniHearts.forEach((h) => {
        h.mesh.rotation.x += h.rotX;
        h.mesh.rotation.y += h.rotY;
        h.mesh.position.y = h.initialY + Math.sin(time * 1.2 + h.phase) * 1.6;
      });

      starPoints.rotation.y = time * 0.012;

      const targetCamZ = (window.innerWidth < 768 ? 36 : 30) + scrollY * 0.015;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.x = mouse.x * 1.2;

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }

      if (labelRenderer.domElement && containerRef.current) {
        if (containerRef.current.contains(labelRenderer.domElement)) {
          containerRef.current.removeChild(labelRenderer.domElement);
        }
      }

      heartGeometry.dispose();
      miniHeartGeom.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      heartMaterial.dispose();
      sparkleGeometry.dispose();
      sparkleMaterial.dispose();
      sparkleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none select-none z-0">
      <canvas ref={canvasRef} id="bg-canvas" className="pointer-events-auto" />
    </div>
  );
};
