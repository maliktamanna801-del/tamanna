import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SpaceCanvasProps {
  scrollProgress: number;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Keep refs of objects to animate them
  const objectsRef = useRef<{
    earthGroup: THREE.Group;
    moon: THREE.Mesh;
    mars: THREE.Mesh;
    satellites: THREE.Group[];
    astronaut: THREE.Group;
    asteroids: THREE.Mesh[];
    shootingStars: Array<{ mesh: THREE.Mesh; speed: number; dir: THREE.Vector3 }>;
    galaxy: THREE.Points;
    starfield: THREE.Points;
  } | null>(null);

  // Mouse position tracking for camera tilt
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Ambient fog
    scene.fog = new THREE.FogExp2(0x020204, 0.0015);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    // Position camera far away initially, will fly inward with scroll
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Add Lighting
    const ambientLight = new THREE.AmbientLight(0x0b0a1e, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(50, 20, 50);
    scene.add(sunLight);

    // Glowing nebula spot lights (purple and blue)
    const purpleLight = new THREE.PointLight(0x8b5cf6, 12, 120);
    purpleLight.position.set(-30, 20, -20);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 12, 120);
    blueLight.position.set(30, -20, -10);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xec4899, 10, 80);
    pinkLight.position.set(0, -10, 30);
    scene.add(pinkLight);

    // 3. Create Starfield (Background Stars)
    const starsCount = 4000;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Random coordinates in space
      starsPos[i] = (Math.random() - 0.5) * 500;
      starsPos[i + 1] = (Math.random() - 0.5) * 500;
      starsPos[i + 2] = (Math.random() - 0.5) * 500;

      // Color variation: mostly blueish, purpleish, white
      const r = Math.random();
      if (r > 0.8) {
        starsColors[i] = 1.0; starsColors[i+1] = 0.8; starsColors[i+2] = 0.9; // neon pink
      } else if (r > 0.5) {
        starsColors[i] = 0.6; starsColors[i+1] = 0.8; starsColors[i+2] = 1.0; // electric blue
      } else {
        starsColors[i] = 1.0; starsColors[i+1] = 1.0; starsColors[i+2] = 1.0; // pure white
      }
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    const starfield = new THREE.Points(starsGeo, starMaterial);
    scene.add(starfield);

    // 4. Create Galaxy (Spiral System in Background)
    const galaxyParticles = 3000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyParticles * 3);
    const galaxyCol = new Float32Array(galaxyParticles * 3);

    for (let i = 0; i < galaxyParticles; i++) {
      const r = Math.random() * 60;
      const theta = r * 0.2 + (i % 3) * (2 * Math.PI / 3) + Math.random() * 0.4;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * 4 * (1 - r / 60);

      const idx = i * 3;
      galaxyPos[idx] = x;
      galaxyPos[idx + 1] = y - 20; // Lower down in space
      galaxyPos[idx + 2] = z - 40; // Deeper back

      // Color gradient: hot pink core transitioning to cyan/purple arms
      if (r < 15) {
        galaxyCol[idx] = 0.95; galaxyCol[idx + 1] = 0.28; galaxyCol[idx + 2] = 0.61; // pink core
      } else if (r < 35) {
        galaxyCol[idx] = 0.54; galaxyCol[idx + 1] = 0.36; galaxyCol[idx + 2] = 0.96; // purple mid
      } else {
        galaxyCol[idx] = 0.02; galaxyCol[idx + 1] = 0.71; galaxyCol[idx + 2] = 0.83; // cyan outer
      }
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyCol, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMaterial);
    scene.add(galaxy);

    // 5. Earth + Atmosphere Group
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-15, 10, 30); // Closer to initial viewport
    scene.add(earthGroup);

    // Earth Body
    const earthGeo = new THREE.SphereGeometry(6, 64, 64);
    
    // Procedural canvas texture mapping for Earth
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 512;
    earthCanvas.height = 256;
    const ctx = earthCanvas.getContext('2d')!;
    ctx.fillStyle = '#050720';
    ctx.fillRect(0, 0, 512, 256);
    // Draw cyber grids for continents
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    // Abstract neon landmasses
    ctx.fillStyle = '#1e1b4b';
    for (let j = 0; j < 30; j++) {
      const lx = Math.random() * 512;
      const ly = Math.random() * 256;
      const lw = Math.random() * 100 + 40;
      const lh = Math.random() * 60 + 20;
      ctx.fillRect(lx, ly, lw, lh);
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(lx + 5, ly + 5, lw - 10, lh - 10);
    }

    const earthTex = new THREE.CanvasTexture(earthCanvas);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      bumpScale: 0.15,
      specular: new THREE.Color(0x8b5cf6),
      shininess: 25
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth Glow Atmosphere
    const earthGlowGeo = new THREE.SphereGeometry(6.6, 32, 32);
    const earthGlowMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const earthGlow = new THREE.Mesh(earthGlowGeo, earthGlowMat);
    earthGroup.add(earthGlow);

    // 6. Moon
    const moonGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const moonCanvas = document.createElement('canvas');
    moonCanvas.width = 128;
    moonCanvas.height = 64;
    const mctx = moonCanvas.getContext('2d')!;
    mctx.fillStyle = '#1f2937';
    mctx.fillRect(0, 0, 128, 64);
    mctx.fillStyle = '#374151';
    for (let k = 0; k < 15; k++) {
      mctx.beginPath();
      mctx.arc(Math.random()*128, Math.random()*64, Math.random()*10+4, 0, Math.PI*2);
      mctx.fill();
    }
    const moonTex = new THREE.CanvasTexture(moonCanvas);
    const moonMat = new THREE.MeshPhongMaterial({ map: moonTex });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(14, 2, 0);
    earthGroup.add(moon);

    // 7. Rotating Mars (positioned on the right side)
    const marsGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const marsCanvas = document.createElement('canvas');
    marsCanvas.width = 256;
    marsCanvas.height = 128;
    const mactx = marsCanvas.getContext('2d')!;
    mactx.fillStyle = '#7f1d1d';
    mactx.fillRect(0, 0, 256, 128);
    mactx.fillStyle = '#991b1b';
    for (let k = 0; k < 20; k++) {
      mactx.fillStyle = k % 2 === 0 ? '#b91c1c' : '#450a0a';
      mactx.fillRect(Math.random()*256, Math.random()*128, Math.random()*60+20, Math.random()*30+10);
    }
    const marsTex = new THREE.CanvasTexture(marsCanvas);
    const marsMat = new THREE.MeshPhongMaterial({
      map: marsTex,
      specular: new THREE.Color(0xef4444),
      shininess: 10
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(22, -12, -10);
    scene.add(mars);

    // 8. Custom Astronaut Group (Synthesized from metallic-looking geometric elements)
    const astronaut = new THREE.Group();
    // Helmet
    const helmetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x8b5cf6, shininess: 80 })
    );
    // Gold visor
    const visorMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshPhongMaterial({ color: 0xd97706, emissive: 0x78350f, shininess: 100 })
    );
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.position.set(0, 0, 0.6);
    astronaut.add(helmetMesh);
    astronaut.add(visorMesh);

    // Backpack life support
    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3, 1.2),
      new THREE.MeshPhongMaterial({ color: 0xdddddd })
    );
    backpack.position.set(0, -1, -1.4);
    astronaut.add(backpack);

    // Spacesuit body
    const bodySuite = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.2, 3.2, 16),
      new THREE.MeshPhongMaterial({ color: 0xeeeeee })
    );
    bodySuite.position.set(0, -2.5, 0);
    astronaut.add(bodySuite);

    // Glowing thrusters
    const thruster = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1, 8),
      new THREE.MeshBasicMaterial({ color: 0xec4899 })
    );
    thruster.position.set(0, -4.5, -0.2);
    thruster.rotation.x = Math.PI;
    astronaut.add(thruster);

    astronaut.position.set(10, 5, 45); // Floats beautifully in front of Mars/Earth
    astronaut.scale.set(0.6, 0.6, 0.6);
    scene.add(astronaut);

    // 9. Floating Satellites (Futuristic metallic frames with solar wings)
    const satellites: THREE.Group[] = [];
    const createSatellite = (pos: THREE.Vector3) => {
      const satGroup = new THREE.Group();
      
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.1 })
      );
      body.rotation.z = Math.PI / 2;
      satGroup.add(body);

      const panel1 = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.1, 0.8),
        new THREE.MeshPhongMaterial({ color: 0x0284c7, emissive: 0x075985 })
      );
      panel1.position.set(1.4, 0, 0);
      satGroup.add(panel1);

      const panel2 = panel1.clone();
      panel2.position.set(-1.4, 0, 0);
      satGroup.add(panel2);

      const antenna = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.8, 4),
        new THREE.MeshPhongMaterial({ color: 0xef4444 })
      );
      antenna.position.set(0, 1.2, 0);
      satGroup.add(antenna);

      satGroup.position.copy(pos);
      scene.add(satGroup);
      satellites.push(satGroup);
    };

    createSatellite(new THREE.Vector3(-18, -4, 20));
    createSatellite(new THREE.Vector3(25, 10, 5));

    // 10. Asteroids (Rough rock structures)
    const asteroids: THREE.Mesh[] = [];
    const asteroidGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x4b5563,
      roughness: 0.9,
      metalness: 0.2
    });

    for (let a = 0; a < 25; a++) {
      const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
      // Scatter in space
      asteroid.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 150
      );
      const randScale = Math.random() * 1.5 + 0.4;
      asteroid.scale.set(randScale, randScale, randScale);
      scene.add(asteroid);
      asteroids.push(asteroid);
    }

    // 11. Shooting Stars (mesh trail spheres flying across)
    const shootingStars: Array<{ mesh: THREE.Mesh; speed: number; dir: THREE.Vector3 }> = [];
    const starGlowGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const starGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff176 });

    for (let s = 0; s < 5; s++) {
      const star = new THREE.Mesh(starGlowGeo, starGlowMat);
      star.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 30 + 10,
        (Math.random() - 0.5) * 60
      );
      scene.add(star);
      shootingStars.push({
        mesh: star,
        speed: Math.random() * 1.5 + 1.2,
        dir: new THREE.Vector3(-1.5, -0.8, (Math.random() - 0.5) * 0.4).normalize()
      });
    }

    objectsRef.current = {
      earthGroup,
      moon,
      mars,
      satellites,
      astronaut,
      asteroids,
      shootingStars,
      galaxy,
      starfield
    };

    // 12. Mouse parallax handler
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 13. Render & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow rotation of galaxy & stars
      if (objectsRef.current) {
        const { earthGroup, moon, mars, satellites, astronaut, asteroids, shootingStars, galaxy, starfield } = objectsRef.current;
        
        // Rotate Earth & orbit Moon
        earthGroup.children[0].rotation.y += 0.003;
        earthGroup.children[1].rotation.y -= 0.001; // Atmosphere rotation
        
        // Orbit Moon
        moon.position.x = 13 * Math.cos(elapsed * 0.12);
        moon.position.z = 13 * Math.sin(elapsed * 0.12);
        moon.rotation.y += 0.005;

        // Rotate Mars
        mars.rotation.y += 0.004;
        mars.position.y += Math.sin(elapsed * 0.3) * 0.005; // hover

        // Astronaut floating effect
        astronaut.position.y = 5 + Math.sin(elapsed * 0.5) * 1.2;
        astronaut.position.x = 10 + Math.cos(elapsed * 0.3) * 0.8;
        astronaut.rotation.y += 0.004;
        astronaut.rotation.z = Math.sin(elapsed * 0.4) * 0.1;

        // Animate satellites
        satellites.forEach((sat, index) => {
          sat.rotation.y += 0.008;
          sat.position.y += Math.sin(elapsed * 0.6 + index) * 0.01;
        });

        // Rotate Asteroids
        asteroids.forEach((ast, idx) => {
          ast.rotation.x += 0.002 * (idx % 3 + 1);
          ast.rotation.y += 0.003 * (idx % 2 + 1);
        });

        // Flying Shooting Stars
        shootingStars.forEach(star => {
          star.mesh.position.addScaledVector(star.dir, star.speed);
          
          // Recycle when out of view
          if (star.mesh.position.y < -40 || star.mesh.position.x < -60) {
            star.mesh.position.set(
              Math.random() * 80 + 20,
              Math.random() * 40 + 20,
              (Math.random() - 0.5) * 50
            );
            star.speed = Math.random() * 1.5 + 1.2;
          }
        });

        // Galaxy rotation
        galaxy.rotation.y = elapsed * 0.02;
        starfield.rotation.y = elapsed * 0.004;
      }

      // Parallax mouse tilt
      if (cameraRef.current) {
        const targetX = mouseRef.current.x * 12;
        const targetY = -mouseRef.current.y * 12;
        
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 14. Handle resize using ResizeObserver for container
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: nw, height: nh } = entries[0].contentRect;
      
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = nw / nh;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(nw, nh);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup on destroy
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose materials/geometries
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  // Update camera position based on scrollProgress (flies the camera closer through space!)
  useEffect(() => {
    if (cameraRef.current) {
      // Scale camera Z from 100 down to 10 as user scrolls
      const targetZ = 100 - scrollProgress * 115;
      // Smooth interpolation
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.15;
    }
  }, [scrollProgress]);

  return (
    <div 
      id="space-stage-container"
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden" 
    />
  );
};
