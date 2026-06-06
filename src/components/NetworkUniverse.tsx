import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { NetworkNode, LanguageDef } from '../types';

// List of supported languages and locations on Earth sphere
export const LANGUAGES: LanguageDef[] = [
  { code: 'en', name: 'English', greeting: 'Hello Universe', coords: [0, 2.5, 0], color: '#3b82f6' }, // Blue
  { code: 'ja', name: 'Japanese', greeting: '宇宙こんにちは', coords: [1.8, 1.5, 1], color: '#f43f5e' }, // Rose
  { code: 'zh', name: 'Chinese', greeting: '你好宇宙', coords: [-1.5, 1.2, 1.5], color: '#eab308' }, // Yellow
  { code: 'ko', name: 'Korean', greeting: '우주 안녕', coords: [1.2, 0.8, -1.8], color: '#10b981' }, // Emerald
  { code: 'ar', name: 'Arabic', greeting: 'السلام عليكم', coords: [-0.5, -1.5, 1.8], color: '#a855f7' }, // Purple
  { code: 'fr', name: 'French', greeting: 'Bonjour Univers', coords: [-1.2, 1.8, -1.2], color: '#06b6d4' }, // Cyan
  { code: 'de', name: 'German', greeting: 'Hallo Universum', coords: [-0.2, 2.2, -1.1], color: '#f97316' }, // Orange
  { code: 'es', name: 'Spanish', greeting: 'Hola Universo', coords: [-1.8, -0.8, 1.2], color: '#ec4899' }, // Pink
  { code: 'hi', name: 'Hindi', greeting: 'नमस्ते ब्रह्मांड', coords: [0.8, -1.8, 1.5], color: '#84cc16' }, // Lime
  { code: 'pt', name: 'Portuguese', greeting: 'Olá Universo', coords: [-1.1, -1.8, -1.3], color: '#6366f1' }, // Indigo
  { code: 'ru', name: 'Russian', greeting: 'Привет Вселенная', coords: [1.0, 2.0, -1.0], color: '#14b8a6' }, // Teal
];

// Planet position settings for Planetary Expansion (Scene 4)
interface PlanetConfig {
  name: string;
  color: string;
  distance: number;
  size: number;
  speed: number;
  angle: number;
}

const PLANETS: PlanetConfig[] = [
  { name: 'Mercury', color: '#94a3b8', distance: 6, size: 0.3, speed: 0.015, angle: 0 },
  { name: 'Venus', color: '#f59e0b', distance: 9, size: 0.45, speed: 0.01, angle: 1.2 },
  { name: 'Mars', color: '#ef4444', distance: 13, size: 0.4, speed: 0.008, angle: 2.5 },
  { name: 'Jupiter', color: '#d97706', distance: 18, size: 0.9, speed: 0.005, angle: 3.8 },
  { name: 'Saturn', color: '#eab308', distance: 23, size: 0.75, speed: 0.003, angle: 4.9 },
  { name: 'Neptune', color: '#3b82f6', distance: 28, size: 0.6, speed: 0.002, angle: 5.6 },
];

interface NetworkUniverseProps {
  scrollProgress: number; // 0 to 6 representing scenes
  customRoute: {
    from: string;
    to: string;
    text: string;
    triggeredAt: number;
  } | null;
}

export const NetworkUniverse: React.FC<NetworkUniverseProps> = ({ scrollProgress, customRoute }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreTextRef = useRef<HTMLDivElement>(null);

  // References to pass values to animation loop without re-running useEffect
  const scrollRef = useRef(scrollProgress);
  const routeRef = useRef(customRoute);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    routeRef.current = customRoute;
  }, [customRoute]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc'); // White cyber-space background
    scene.fog = new THREE.FogExp2('#f8fafc', 0.015); // Delicate fog to recede elements smoothly

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Initial camera position (comfortably far looking at the globe)
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#e2e8f0', 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Warm radial point light near the center for deep spatial shadows
    const pointLight = new THREE.PointLight('#93c5fd', 1.5, 30);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // --- HELPER FUNCTIONS ---
    // Beautiful Canvas-based radial glow texture for nodes
    const createCircleTexture = (color: string): THREE.Texture => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.15, color);
        grad.addColorStop(0.4, color + '66');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(c);
    };

    // Canvas-based dynamic text texture for flow graphics
    const createTextTexture = (text: string, color: string): THREE.Texture => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, 512, 64);
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.fillText(text, 256, 32);
      }
      const texture = new THREE.CanvasTexture(c);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    // --- PROCEDURAL DIGITAL GLOBE (EARTH) ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe Base Wireframe Mesh
    const globeGeom = new THREE.SphereGeometry(2.5, 36, 36);
    const globeMat = new THREE.MeshBasicMaterial({
      color: '#cbd5e1',
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    globeGroup.add(globeMesh);

    // Inner Solid Sphere for occlusion & soft lighting
    const innerGeom = new THREE.SphereGeometry(2.46, 32, 32);
    const innerMat = new THREE.MeshPhongMaterial({
      color: '#ffffff',
      shininess: 30,
      transparent: true,
      opacity: 0.75,
      side: THREE.FrontSide,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    globeGroup.add(innerMesh);

    // Digital Latitude / Longitude Accent Rings
    const ringMat = new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.25 });
    for (let r = 0; r < 5; r++) {
      const radius = 2.52 * Math.sin((r / 5) * Math.PI);
      const y = 2.52 * Math.cos((r / 5) * Math.PI);
      if (radius > 0) {
        const ringGeom = new THREE.BufferGeometry().setFromPoints(
          new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2, true).getPoints(64).map(p => new THREE.Vector3(p.x, y, p.y))
        );
        const ringLine = new THREE.Line(ringGeom, ringMat);
        globeGroup.add(ringLine);
      }
    }

    // --- INFINITE BACKGROUND DATA DUST ---
    const dustCount = 1200;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      // Random coordinates distributed widely
      const r = 10 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi) + Math.random() * 5 - 2.5;

      // Clean soft gray/blue palette
      dustColors[i * 3] = 0.7 + Math.random() * 0.3;
      dustColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      dustColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // --- SPATIAL CYBER FLOOR GRID ---
    const gridHelper = new THREE.GridHelper(60, 60, '#cbd5e1', '#e2e8f0');
    gridHelper.position.y = -8;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    scene.add(gridHelper);

    // --- HIGH-PERFORMANCE INSTANCED HUMAN NODES (SCENE 1-2) ---
    // We instantiate thousands of small nodes representing users on the Globe
    const nodeCount = 1500;
    const nodeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: '#60a5fa',
      emissive: '#1d4ed8',
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
    });

    const instancedMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodeCount);
    const dummy = new THREE.Object3D();
    const nodeOrigins: THREE.Vector3[] = [];
    const nodeColors = [
      new THREE.Color('#3b82f6'), // Blue
      new THREE.Color('#f43f5e'), // Rose
      new THREE.Color('#10b981'), // Emerald
      new THREE.Color('#eab308'), // Yellow
      new THREE.Color('#a855f7'), // Purple
      new THREE.Color('#ff7849'), // Orange
    ];

    for (let i = 0; i < nodeCount; i++) {
      // Pick random spherical points on the surface
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 0.04; // Very slight elevation

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodeOrigins.push(pos);

      dummy.position.copy(pos);
      dummy.scale.setScalar(0.4 + Math.random() * 1.8);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Random color pairing
      const randomColor = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      instancedMesh.setColorAt(i, randomColor);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    globeGroup.add(instancedMesh);

    // --- SCANNING CONNECTION LINES ---
    const connectionLines: {
      line: THREE.Line;
      curve: THREE.QuadraticBezierCurve3;
      speed: number;
      progress: number;
      color: string;
    }[] = [];

    // Construct 45 unique country connections surface arcs
    const lineMaterialBase = new THREE.LineBasicMaterial({
      transparent: true,
      linewidth: 1, // Standard line rendering
    });

    for (let i = 0; i < 45; i++) {
      const idx1 = Math.floor(Math.random() * LANGUAGES.length);
      let idx2 = Math.floor(Math.random() * LANGUAGES.length);
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * LANGUAGES.length);

      const lang1 = LANGUAGES[idx1];
      const lang2 = LANGUAGES[idx2];

      const p1 = new THREE.Vector3(...lang1.coords);
      const p2 = new THREE.Vector3(...lang2.coords);

      // Midpoint pulled outward to create an elegant arched connection
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const length = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(2.6 + length * 0.25);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const curvePoints = curve.getPoints(32);
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const colorStr = lang1.color;
      const lineMaterial = lineMaterialBase.clone();
      lineMaterial.color = new THREE.Color(colorStr);
      lineMaterial.opacity = 0.25 + Math.random() * 0.4;

      const line = new THREE.Line(curveGeometry, lineMaterial);
      globeGroup.add(line);

      connectionLines.push({
        line,
        curve,
        speed: 0.007 + Math.random() * 0.012,
        progress: Math.random(),
        color: colorStr,
      });
    }

    // --- LANGUAGE TARGET NODES (SPHERE HUD GLOW & LABELS) ---
    const originalLanguageSprites: THREE.Sprite[] = [];
    const languageGlows: THREE.Mesh[] = [];

    LANGUAGES.forEach(lang => {
      // 3D Sphere Marker at exact Coordinates
      const markerGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const markerMat = new THREE.MeshPhongMaterial({
        color: lang.color,
        emissive: lang.color,
        emissiveIntensity: 0.8,
        shininess: 100,
      });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.set(...lang.coords);
      globeGroup.add(markerMesh);

      // Smooth custom Canvas Sprite Glow behind target coordinates
      const glowSpriteMap = createCircleTexture(lang.color);
      const glowSpriteMat = new THREE.SpriteMaterial({ map: glowSpriteMap, transparent: true, opacity: 0.8 });
      const glowSprite = new THREE.Sprite(glowSpriteMat);
      glowSprite.position.set(...lang.coords);
      glowSprite.scale.setScalar(0.7);
      globeGroup.add(glowSprite);

      // Glowing Text Sprite Label
      const txtMap = createTextTexture(lang.name, lang.color);
      const txtSpriteMat = new THREE.SpriteMaterial({ map: txtMap, transparent: true, opacity: 0.9 });
      const txtSprite = new THREE.Sprite(txtSpriteMat);
      // Offset text above node coordinate
      const textPos = new THREE.Vector3(...lang.coords).multiplyScalar(1.15);
      txtSprite.position.copy(textPos);
      txtSprite.scale.set(1.4, 0.2, 1);
      globeGroup.add(txtSprite);
      originalLanguageSprites.push(txtSprite);
    });

    // --- SCENE 4: INTERPLANETARY ENVIRONMENT ---
    const interplanetaryGroup = new THREE.Group();
    interplanetaryGroup.position.set(0, 0, 0);
    scene.add(interplanetaryGroup);

    // Populate actual 3D planets (Mars, Saturn, Jupiter)
    const activePlanets: {
      mesh: THREE.Group;
      config: PlanetConfig;
      angle: number;
      orbitLine: THREE.Line;
    }[] = [];

    PLANETS.forEach(plan => {
      const planetHolder = new THREE.Group();

      // Planet Sphere Body
      // For Saturn, add rings!
      let bodyMesh: THREE.Mesh;
      if (plan.name === 'Saturn') {
        const sphereGeom = new THREE.SphereGeometry(plan.size, 24, 24);
        const sphereMat = new THREE.MeshPhongMaterial({
          color: plan.color,
          emissive: plan.color,
          emissiveIntensity: 0.2,
          shininess: 30,
        });
        bodyMesh = new THREE.Mesh(sphereGeom, sphereMat);
        planetHolder.add(bodyMesh);

        // Render rings
        const ringGeom = new THREE.RingGeometry(plan.size * 1.3, plan.size * 2.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: plan.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
          wireframe: true,
        });
        const SaturnRingMesh = new THREE.Mesh(ringGeom, ringMat);
        SaturnRingMesh.rotation.x = Math.PI / 2.3;
        planetHolder.add(SaturnRingMesh);
      } else {
        const sphereGeom = new THREE.SphereGeometry(plan.size, 24, 24);
        const sphereMat = new THREE.MeshPhongMaterial({
          color: plan.color,
          emissive: plan.color,
          emissiveIntensity: 0.3,
          wireframe: plan.name === 'Venus' || plan.name === 'Neptune', // Stylized web-architecture wireframes
          shininess: 50,
        });
        bodyMesh = new THREE.Mesh(sphereGeom, sphereMat);
        planetHolder.add(bodyMesh);
      }

      // Aura circle glow around planet
      const planetGlowMap = createCircleTexture(plan.color);
      const planetGlowMat = new THREE.SpriteMaterial({ map: planetGlowMap, transparent: true, opacity: 0.6 });
      const planetGlow = new THREE.Sprite(planetGlowMat);
      planetGlow.scale.setScalar(plan.size * 2.5);
      planetHolder.add(planetGlow);

      // Planet text label Sprite
      const pltTextMap = createTextTexture(plan.name, plan.color);
      const pltTxtMat = new THREE.SpriteMaterial({ map: pltTextMap, transparent: true, opacity: 0.8 });
      const pltTxtSprite = new THREE.Sprite(pltTxtMat);
      pltTxtSprite.position.set(0, plan.size + 0.5, 0);
      pltTxtSprite.scale.set(2, 0.25, 1);
      planetHolder.add(pltTxtSprite);

      // Orbital Orbit Ellipse Path
      const orbitPoints: THREE.Vector3[] = [];
      const steps = 120;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        // Make the orbit slightly tilted horizontally for parallax view
        orbitPoints.push(new THREE.Vector3(Math.cos(a) * plan.distance, 0, Math.sin(a) * plan.distance));
      }
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: plan.color,
        transparent: true,
        opacity: 0.15,
      });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      interplanetaryGroup.add(orbitLine);

      // Initial placement
      const initX = Math.cos(plan.angle) * plan.distance;
      const initZ = Math.sin(plan.angle) * plan.distance;
      planetHolder.position.set(initX, 0, initZ);

      interplanetaryGroup.add(planetHolder);
      activePlanets.push({
        mesh: planetHolder,
        config: plan,
        angle: plan.angle,
        orbitLine,
      });
    });

    // --- INTERPLANETARY DATA HIGHWAYS ---
    // Curved Bezier pathways starting from Earth and latching onto planets
    const planetHighways: {
      line: THREE.Line;
      planetIdx: number;
      curve: THREE.QuadraticBezierCurve3;
      originEarth: THREE.Vector3;
    }[] = [];

    activePlanets.forEach((p, idx) => {
      const earthLaunchCoord = new THREE.Vector3(...LANGUAGES[idx % LANGUAGES.length].coords);
      const planetPos = p.mesh.position;

      const mid = new THREE.Vector3().addVectors(earthLaunchCoord, planetPos).multiplyScalar(0.5);
      mid.y += p.config.distance * 0.3; // High vertical warp

      const curve = new THREE.QuadraticBezierCurve3(earthLaunchCoord, mid, planetPos.clone());
      const cPoints = curve.getPoints(32);
      const cGeom = new THREE.BufferGeometry().setFromPoints(cPoints);
      const highwayMat = new THREE.LineBasicMaterial({
        color: p.config.color,
        transparent: true,
        opacity: 0.2,
      });
      const highwayLine = new THREE.Line(cGeom, highwayMat);
      interplanetaryGroup.add(highwayLine);

      planetHighways.push({
        line: highwayLine,
        planetIdx: idx,
        curve,
        originEarth: earthLaunchCoord,
      });
    });

    // --- FLYING TYPOGRAPHY TEXT GREETING PARTICLES ---
    const textParticles: {
      sprite: THREE.Sprite;
      curve: THREE.QuadraticBezierCurve3;
      progress: number;
      speed: number;
      language: string;
      color: string;
    }[] = [];

    // Instantiating 22 flying greeting text sprites distributed across connections
    const totalFlyTexts = 22;
    for (let i = 0; i < totalFlyTexts; i++) {
      const conn = connectionLines[i % connectionLines.length];
      const langDef = LANGUAGES[i % LANGUAGES.length];

      const pTextMap = createTextTexture(langDef.greeting, langDef.color);
      const pTextMat = new THREE.SpriteMaterial({ map: pTextMap, transparent: true, opacity: 0.88 });
      const sprite = new THREE.Sprite(pTextMat);
      sprite.scale.set(1.6, 0.22, 1);
      globeGroup.add(sprite);

      textParticles.push({
        sprite,
        curve: conn.curve,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        language: langDef.name,
        color: langDef.color,
      });
    }

    // Interplanetary Flying greeting particles
    const interplanetaryTextParticles: {
      sprite: THREE.Sprite;
      highwayIdx: number;
      progress: number;
      speed: number;
      text: string;
      color: string;
    }[] = [];

    planetHighways.forEach((h, hIdx) => {
      const planConfig = activePlanets[h.planetIdx].config;
      const greetText = LANGUAGES[hIdx % LANGUAGES.length].greeting;
      const textMap = createTextTexture(greetText, planConfig.color);
      const textMat = new THREE.SpriteMaterial({ map: textMap, transparent: true, opacity: 0.92 });
      const sprite = new THREE.Sprite(textMat);
      sprite.scale.set(2.2, 0.3, 1);
      interplanetaryGroup.add(sprite);

      interplanetaryTextParticles.push({
        sprite,
        highwayIdx: hIdx,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        text: greetText,
        color: planConfig.color,
      });
    });

    // --- ACTIVE SANDBOX ROUTE CONTROLLER ---
    // This allows real-time dynamic graphics when user requests "Route Network" in UI
    let activeCustomFlight: {
      sprite: THREE.Sprite;
      glowSprite: THREE.Sprite;
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
      progress: number;
      speed: number;
      fromLang: string;
      toLang: string;
    } | null = null;

    const setupCustomSandboxFlight = (fromCode: string, toCode: string, text: string) => {
      // Find language configurations
      const fromLang = LANGUAGES.find(l => l.code === fromCode) || LANGUAGES[0];
      const toLang = LANGUAGES.find(l => l.code === toCode) || LANGUAGES[1];

      const p1 = new THREE.Vector3(...fromLang.coords);
      const p2 = new THREE.Vector3(...toLang.coords);

      // Distinct arc, pulled higher outward so it stands out spectacularly
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const length = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(3.2 + length * 0.4); // Extends further outward

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const cPoints = curve.getPoints(45);
      const cGeom = new THREE.BufferGeometry().setFromPoints(cPoints);

      // High visibility bright neon line
      const highlightMat = new THREE.LineBasicMaterial({
        color: '#f43f5e', // Hot rose
        transparent: true,
        opacity: 0.9,
      });
      const highlightLine = new THREE.Line(cGeom, highlightMat);
      globeGroup.add(highlightLine);

      // Large customized Text Sprite
      const customTex = createTextTexture(`[Routing...] ${text}`, '#f43f5e');
      const customMat = new THREE.SpriteMaterial({ map: customTex, transparent: true, opacity: 1.0 });
      const customSprite = new THREE.Sprite(customMat);
      customSprite.scale.set(2.8, 0.4, 1);
      globeGroup.add(customSprite);

      // Large custom trailing circle glow
      const customGlow = createCircleTexture('#f43f5e');
      const glowMat = new THREE.SpriteMaterial({ map: customGlow, transparent: true, opacity: 0.9 });
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.scale.setScalar(1.2);
      globeGroup.add(glowSprite);

      activeCustomFlight = {
        sprite: customSprite,
        glowSprite,
        curve,
        line: highlightLine,
        progress: 0,
        speed: 0.015, // Blazing routing speed!
        fromLang: fromLang.name,
        toLang: toLang.name,
      };
    };

    // --- ANIMATION TIMELOOP ---
    const clock = new THREE.Clock();

    // Lerped coordinate values for smooth camera transition
    const lerpCamera = {
      pos: new THREE.Vector3(0, 0, 7),
      look: new THREE.Vector3(0, 0, 0),
    };

    let animFrameId = 0;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Check and update if custom query routed from Sandbox
      const currentRoute = routeRef.current;
      if (currentRoute) {
        // Build new custom flying visual path if not already created
        if (!activeCustomFlight) {
          setupCustomSandboxFlight(currentRoute.from, currentRoute.to, currentRoute.text);
        }
      }

      // --- ADVANCE CONSTANT ROTATIONS & WAVING EFFECTS ---
      // Rotate Globe smoothly
      const currentScene = scrollRef.current;
      let rotSpeed = 0.05 * delta;
      
      // Speed up rotation/interaction in Scenes 2 and 5-6 (Peak network densities)
      if (currentScene > 1.0 && currentScene < 3.0) rotSpeed *= 2.5;
      if (currentScene >= 4.8 && currentScene < 6.2) rotSpeed *= 3.0;

      globeGroup.rotation.y += rotSpeed;
      globeGroup.rotation.x = Math.sin(time * 0.15) * 0.1; // Gentle organic oscillation

      // Slowly rotate interplanetary network in opposite direction
      interplanetaryGroup.rotation.y -= rotSpeed * 0.4;

      // Pulse volumetric pointLight and inner white sphere size
      const pulseIntensity = 1.0 + Math.sin(time * 3.5) * 0.45;
      pointLight.intensity = pulseIntensity * 1.5;

      const innerScale = 1.0 + Math.sin(time * 2.0) * 0.005;
      innerMesh.scale.setScalar(innerScale);

      // Rotate/wobble Stars widely
      dustPoints.rotation.y = time * 0.003;
      dustPoints.rotation.x = time * 0.001;

      // Orbit active Planets procedurally (Scene 4)
      activePlanets.forEach(p => {
        // Orbit speed modulated by delta
        p.angle += p.config.speed * delta * 60;
        const oX = Math.cos(p.angle) * p.config.distance;
        const oZ = Math.sin(p.angle) * p.config.distance;
        p.mesh.position.set(oX, 0, oZ);

        // Slowly spin planet on its axis
        p.mesh.rotation.y += 0.01;
      });

      // --- ANIMATE STANDARD SURROUNDING TYPOGRAPHY PARTICLES ---
      textParticles.forEach(p => {
        // Modulate typography particle speed based on scroll scene density
        let factor = 1.0;
        if (currentScene > 0.8 && currentScene < 2.5) factor = 2.4; // Extreme density flight
        if (currentScene >= 5.0) factor = 3.2; // Peak data ecosystem
        
        p.progress += p.speed * factor * (delta * 60);
        if (p.progress > 1.0) {
          p.progress = 0;
          p.speed = 0.005 + Math.random() * 0.008;
        }

        // Evaluate bezier coordinate
        const tPos = p.curve.getPointAt(p.progress);
        p.sprite.position.copy(tPos);

        // Make particles slightly pulse in scale
        const scaleMod = 1.0 + Math.sin(time * 5 + p.progress * 10) * 0.12;
        p.sprite.scale.set(1.6 * scaleMod, 0.22 * scaleMod, 1);
      });

      // --- ANIMATE INTERPLANETARY HIGHWAY PARTICLES ---
      interplanetaryTextParticles.forEach(ip => {
        const associatedHighway = planetHighways[ip.highwayIdx];
        const planetPos = activePlanets[associatedHighway.planetIdx].mesh.position;

        // Re-construct the curve because the planet coordinates are dynamically orbiting!
        const reCurve = new THREE.QuadraticBezierCurve3(
          associatedHighway.originEarth,
          new THREE.Vector3().addVectors(associatedHighway.originEarth, planetPos).multiplyScalar(0.5).add(new THREE.Vector3(0, planetPos.length() * 0.4, 0)),
          planetPos
        );

        ip.progress += ip.speed * (delta * 60);
        if (ip.progress > 1.0) {
          ip.progress = 0;
        }

        const ipPos = reCurve.getPointAt(ip.progress);
        ip.sprite.position.copy(ipPos);
      });

      // --- ANIMATE ACTIVE SANDBOX CUSTOM ROUTE ---
      if (activeCustomFlight) {
        activeCustomFlight.progress += activeCustomFlight.speed * (delta * 60);
        if (activeCustomFlight.progress > 1.0) {
          // Finished Routing! Cleanup meshes from globe group
          globeGroup.remove(activeCustomFlight.sprite);
          globeGroup.remove(activeCustomFlight.glowSprite);
          globeGroup.remove(activeCustomFlight.line);
          activeCustomFlight = null;

          // Tell references that route was handled, to let UI reset
          routeRef.current = null;
        } else {
          // Interpolate coordinate
          const cPos = activeCustomFlight.curve.getPointAt(activeCustomFlight.progress);
          activeCustomFlight.sprite.position.copy(cPos);
          activeCustomFlight.glowSprite.position.copy(cPos);

          // Render neon scanning beam
          (activeCustomFlight.line.material as any).opacity = 1.0 - activeCustomFlight.progress;
        }
      }

      // --- CAMERA TIMELINE INTERPOLATOR (LERPING THE CAMERA ON SCENE SELECT) ---
      // We maps the currentScrollProgress (0 to 6) smoothly to standard vector points
      const progress = scrollRef.current;
      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();

      if (progress <= 1.0) {
        // Scene 01: Connected Humans (Comfortable front-side orbital view)
        const factor = progress;
        targetPos.set(0, 1.2 * factor, 7 - (2.5 * factor)); // Move slowly closer
        targetLook.set(0, 0, 0);

        // Normal Visibility
        globeGroup.visible = true;
        interplanetaryGroup.visible = false;
        gridHelper.material.opacity = 0.25;

        // Modulate instanced nodes size & brightness
        nodeMaterial.opacity = 0.85;
      } 
      else if (progress <= 2.0) {
        // Scene 02: Expanding connections (Camera zooming tightly inside Globe surface)
        const factor = progress - 1.0;
        // Camera moves extremely deep into core surface
        targetPos.set(0.6 * factor, 1.5 * factor, 4.5 - (2.8 * factor)); 
        targetLook.set(0.2 * factor, 0.4 * factor, 0);

        globeGroup.visible = true;
        interplanetaryGroup.visible = false;
        gridHelper.material.opacity = 0.45;

        // Peak human nodes glowing state
        nodeMaterial.opacity = 0.95;
      } 
      else if (progress <= 3.0) {
        // Scene 03: Nations connection (Fly sideways across the global continent region)
        const factor = progress - 2.0;
        targetPos.set(1.5 - (0.8 * factor), 1.8 - (0.5 * factor), 1.7 + (2.5 * factor));
        targetLook.set(0.2, 0.4 - (0.2 * factor), 0);

        globeGroup.visible = true;
        interplanetaryGroup.visible = false;
        gridHelper.material.opacity = 0.35;
      } 
      else if (progress <= 4.0) {
        // Scene 04: Planetary expansion (CAMERA ZOOMING FAR BACK to reveal Planets!)
        const factor = progress - 3.0;
        // Camera recedes to huge distances to capture outer nodes
        targetPos.set(0, 4.5 * factor, 4.2 + (23.5 * factor));
        targetLook.set(0, 0, 0);

        globeGroup.visible = true;
        interplanetaryGroup.visible = true; // Reveal Solar system planets and orbit links
        gridHelper.material.opacity = 0.15;
      } 
      else if (progress <= 5.0) {
        // Scene 05: G.trans core hub (CAMERA CRASHES BACK to target Earth center core)
        const factor = progress - 4.0;
        targetPos.set(0, 0, 27.7 - (23.9 * factor)); // Zooms tightly into center G.trans billboards
        targetLook.set(0, 0, 0);

        globeGroup.visible = true;
        interplanetaryGroup.visible = true; // Keep planets faintly visible in background
        gridHelper.material.opacity = 0.55;
      } 
      else if (progress <= 6.0) {
        // Scene 06 & 07: Infinite Revelation (Aesthetic high-depth perspective)
        const factor = progress - 5.0;
        targetPos.set(0.5 * factor, 1.2 * factor, 3.8 + (1.2 * factor));
        targetLook.set(0, 0.2 * factor, 0);

        globeGroup.visible = true;
        interplanetaryGroup.visible = true;
        gridHelper.material.opacity = 0.6;
      }

      // Smoothly interpolate camera position & tracking targets (Lerping)
      lerpCamera.pos.lerp(targetPos, 0.08);
      lerpCamera.look.lerp(targetLook, 0.08);

      camera.position.copy(lerpCamera.pos);
      camera.lookAt(lerpCamera.look);

      // --- CORE FLOATING TEXT HOVER (HTML SYNC TO CANVAS SCREEN POSITION) ---
      // We calculate exact 2D projection of Earth center, to position the CSS text
      if (coreTextRef.current) {
        const centerPos = new THREE.Vector3(0, 0.3, 0);
        centerPos.project(camera);

        // Convert projection coordinates to absolute screen styles
        const xProj = (centerPos.x * .5 + .5) * width;
        const yProj = (-(centerPos.y) * .5 + .5) * height;

        coreTextRef.current.style.transform = `translate(-50%, -50%) translate(${xProj}px, ${yProj}px)`;
        
        // Hide/fade G.trans text slightly during Scene 4 planet overview
        if (progress > 3.0 && progress < 4.2) {
          const fade = Math.max(0, 1 - (progress - 3.0) * 1.5);
          coreTextRef.current.style.opacity = `${0.3 + 0.7 * fade}`;
          coreTextRef.current.style.scale = `${1.0 - (progress - 3.0) * 0.4}`;
        } else {
          coreTextRef.current.style.opacity = '1.0';
          coreTextRef.current.style.scale = '1.0';
        }
      }

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    // --- RESIZE LISTENER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose materials/geometries/textures to avoid memory leaks
      globeGeom.dispose();
      globeMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      ringMat.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      gridHelper.dispose();
      originalLanguageSprites.forEach(sprite => sprite.material.dispose());
      languageGlows.forEach(glow => (glow.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full pointer-events-auto" id="threejs-canvas-universe" />

      {/* Floating 3D G.trans UI billboard - projected from globe center */}
      <div
        ref={coreTextRef}
        className="absolute top-0 left-0 text-center pointer-events-none transition-all duration-300 transform select-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="flex flex-col items-center">
          {/* Outer glowing halo ring wrapper */}
          <div className="relative flex items-center justify-center">
            {/* Spinning holographic border */}
            <div className="absolute -inset-10 border border-slate-300/30 rounded-full animate-spin [animation-duration:12s] pointer-events-none"></div>
            <div className="absolute -inset-16 border-2 border-dashed border-red-400/20 rounded-full animate-spin [animation-duration:22s] pointer-events-none"></div>
            
            {/* Soft backdrop blur card */}
            <div className="bg-white/40 backdrop-blur-md px-10 py-5 rounded-2xl shadow-xl border border-white/50">
              <h1 className="text-4xl sm:text-5xl font-sans tracking-[0.25em] font-extrabold text-slate-900 drop-shadow-[0_4px_12px_rgba(255,255,255,1)]">
                G.trans
              </h1>
              <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-cyan-600 block mt-1 font-bold">
                UNIVERSAL CORE ENGINE
              </span>
            </div>
          </div>
          {/* Animated small pulse dot underneath billboard */}
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-6 shadow-[0_0_12px_#f43f5e] animate-ping" />
        </div>
      </div>
    </div>
  );
};
