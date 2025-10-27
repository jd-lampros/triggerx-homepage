'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Optimized configuration constants for better performance
const TARGET_CELL_PX = 35; // Increased for fewer cells
const GAP_PX = 3; // Increased gap
const BASE_COLOR = new THREE.Color('#000000');
const HI_COLOR = new THREE.Color('#ececec');
const GRADIENT_COLOR_1 = new THREE.Color('#FFF837');
const GRADIENT_COLOR_2 = new THREE.Color('#29EC70');
const DECAY = 0.8; // Faster decay for better performance
const MAX_INTENSITY = 1.2; // Reduced intensity
const MOUSE_THROTTLE = 8; // Increased throttling for better performance
const MAX_FPS = 30; // Cap FPS for better performance

export default function GridBackground() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationRef = useRef<number | null>(null);

  // Grid state
  const gridState = useRef({
    intensities: new Float32Array(0),
    count: 0,
    rows: 0,
    cols: 0,
  });

  // Performance optimization state
  const performanceState = useRef({
    lastUpdateTime: 0,
    animationFrameId: 0,
  });

  // Set client-side state and detect mobile
  useEffect(() => {
    setIsClient(true);

    // Check if screen is mobile size (768px and below)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || isMobile) return;

    try {
      console.log('Initializing Three.js...');

      // Initialize Three.js with performance optimizations
      const container = containerRef.current;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        precision: 'highp', // Use high precision for better color quality
        logarithmicDepthBuffer: false,
        preserveDrawingBuffer: false, // Better performance
      });

      // Enable WebGL extensions for better performance
      const gl = renderer.getContext();
      if (gl.getExtension('OES_element_index_uint')) {
        console.log('OES_element_index_uint extension enabled');
      }
      if (gl.getExtension('ANGLE_instanced_arrays')) {
        console.log('ANGLE_instanced_arrays extension enabled');
      }

      renderer.setClearColor(0x090909, 1.0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
      renderer.shadowMap.enabled = false; // Disable shadows for better performance
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      container.appendChild(renderer.domElement);

      console.log('Three.js renderer created successfully');

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      rendererRef.current = renderer;
      raycasterRef.current = raycaster;
      mouseRef.current = mouse;

      // Optimized mouse move handler with increased throttling
      const onMouseMove = (e: MouseEvent) => {
        const now = performance.now();

        // Increased throttling for better performance
        if (now - performanceState.current.lastUpdateTime < MOUSE_THROTTLE) return;
        performanceState.current.lastUpdateTime = now;

        // Check if mouse is over an element that should disable grid effects
        const target = e.target as HTMLElement;
        const shouldDisableGrid =
          (target && (target.closest?.("[data-disable-grid]") ||
            target.closest?.(".disable-grid-effect") ||
            target.closest?.("button") ||
            target.closest?.("a") ||
            target.closest?.("input") ||
            target.closest?.("textarea") ||
            target.closest?.("select"))) ||
          target.closest?.("img") ||
          target.closest?.("svg");

        // If over a disabled element, don't trigger grid effects
        if (shouldDisableGrid) {
          return;
        }

        // Grid interaction
        const rect = renderer.domElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;

        if (sceneRef.current && cameraRef.current) {
          raycaster.setFromCamera(mouse, cameraRef.current);
          const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

          if (intersects.length > 0) {
            const hit = intersects[0];
            const cellMesh = hit.object as THREE.Mesh;

            if (cellMesh.userData && cellMesh.userData.index !== undefined) {
              const cellId = cellMesh.userData.index;
              gridState.current.intensities[cellId] = MAX_INTENSITY;

              // Create high-quality gradient color with multiple color interpolation
              const gradientColor = new THREE.Color();

              // Create a more complex gradient using multiple colors
              const t1 = 0.3; // First transition point
              const t2 = 0.7; // Second transition point

              if (Math.random() > 0.5) {
                // Warm gradient path
                gradientColor.copy(GRADIENT_COLOR_1).lerp(GRADIENT_COLOR_2, t1).lerp(GRADIENT_COLOR_2, t2);
              } else {
                // Cool gradient path
                gradientColor.copy(GRADIENT_COLOR_1).lerp(GRADIENT_COLOR_2, t2);
              }

              // Add some brightness variation for more dynamic look
              gradientColor.multiplyScalar(0.9 + Math.random() * 0.2);

              (cellMesh.material as THREE.MeshBasicMaterial).color.copy(gradientColor);
            }
          }
        }
      };

      // Build grid function
      const buildGrid = () => {
        console.log('Building grid...');
        const w = window.innerWidth;
        const h = window.innerHeight;
        console.log('Window size:', w, 'x', h);

        const cols = Math.max(2, Math.floor(w / TARGET_CELL_PX));
        const cellPx = w / cols;
        const rows = Math.max(2, Math.floor(h / cellPx));
        const tilePx = Math.max(1, cellPx - GAP_PX);
        const count = rows * cols;
        console.log('Grid dimensions:', rows, 'x', cols, '=', count, 'cells');

        // Update grid state
        gridState.current = {
          intensities: new Float32Array(count).fill(0),
          count,
          rows,
          cols,
        };

        // Create camera
        const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -100, 100);
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        console.log('Scene created');

        // Create grid
        const gridW = cols * cellPx;
        const gridH = rows * cellPx;
        const startX = -gridW / 2 + cellPx / 2;
        const startY = gridH / 2 - cellPx / 2;

        console.log('Creating grid cells...');
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cellGeom = new THREE.PlaneGeometry(tilePx, tilePx);
            const cellMat = new THREE.MeshBasicMaterial({
              color: BASE_COLOR.getHex(),
              transparent: false,
              side: THREE.DoubleSide,
            });

            const cellMesh = new THREE.Mesh(cellGeom, cellMat);
            const x = startX + c * cellPx;
            const y = startY - r * cellPx;
            cellMesh.position.set(x, y, 0);

            cellMesh.userData = {
              row: r,
              col: c,
              index: r * cols + c,
              material: cellMat,
            };

            scene.add(cellMesh);
          }
        }
        console.log('Grid cells created, total children:', scene.children.length);

        // Test: Make first cell yellow
        const firstCell = scene.children[0] as THREE.Mesh;
        if (firstCell) {
          (firstCell.material as THREE.MeshBasicMaterial).color.setHex(HI_COLOR.getHex());
          gridState.current.intensities[0] = MAX_INTENSITY;
        }
      };

      // Performance monitoring variables
      let frameCount = 0;
      let lastFpsTime = performance.now();

      const monitorPerformance = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
          console.log(`FPS: ${fps}`);
          frameCount = 0;
          lastFpsTime = now;
        }
      };

      // Optimized animation function with FPS limiting and reduced complexity
      let lastTime = 0;
      const frameInterval = 1000 / MAX_FPS; // Calculate frame interval

      const animate = (currentTime: number) => {
        // FPS limiting for better performance
        if (currentTime - lastTime < frameInterval) {
          performanceState.current.animationFrameId = requestAnimationFrame(animate);
          return;
        }
        lastTime = currentTime;

        if (sceneRef.current) {
          // Use more efficient traversal
          const children = sceneRef.current.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.userData && child.userData.index !== undefined) {
              const cellId = child.userData.index;
              const v = gridState.current.intensities[cellId];

              if (v > 0.01) {
                const nv = v * DECAY;
                gridState.current.intensities[cellId] = nv;

                // Simplified color calculation for better performance
                const currentColor = new THREE.Color();

                if (nv > 0.5) {
                  // High intensity - simple gradient
                  currentColor.copy(GRADIENT_COLOR_1).lerp(GRADIENT_COLOR_2, (nv - 0.5) * 2);
                } else {
                  // Low intensity - fade to base
                  currentColor.copy(BASE_COLOR).lerp(GRADIENT_COLOR_1, nv * 2);
                }

                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                  child.material.color.copy(currentColor);
                }
              } else if (v !== 0) {
                gridState.current.intensities[cellId] = 0;
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                  child.material.color.copy(BASE_COLOR);
                }
              }
            }
          }
        }

        renderer.render(sceneRef.current!, cameraRef.current!);

        // Monitor performance every 30 frames (reduced frequency)
        if (frameCount % 30 === 0) {
          monitorPerformance();
        }

        performanceState.current.animationFrameId = requestAnimationFrame(animate);
      };

      // Initialize with a small delay to ensure DOM is ready
      console.log('Initializing grid...');

      const initializeGrid = () => {
        // Set initial size
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.setSize(w, h, false);

        // Build grid
        buildGrid();
        console.log('Grid initialized, starting animation...');

        // Start animation
        animate(performance.now());
        console.log('Animation started');
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(initializeGrid);

      // Fallback: Force render after a short delay to ensure visibility
      setTimeout(() => {
        if (sceneRef.current && cameraRef.current) {
          renderer.render(sceneRef.current, cameraRef.current);
        }
      }, 100);

      // Event listeners
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.setSize(w, h, false);
        buildGrid();
      });


      // Cleanup with performance monitoring
      return () => {
        // Cancel animation frame
        const currentPerformanceState = performanceState.current;
        const currentAnimationRef = animationRef.current;

        if (currentPerformanceState.animationFrameId) {
          cancelAnimationFrame(currentPerformanceState.animationFrameId);
        }
        if (currentAnimationRef) {
          cancelAnimationFrame(currentAnimationRef);
        }

        // Remove event listeners
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', buildGrid);

        // Clean up Three.js objects
        if (sceneRef.current) {
          sceneRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(material => material.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }

        // Remove canvas and dispose renderer
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();

        // Clear performance state
        performanceState.current.animationFrameId = 0;
      };
    } catch (err) {
      console.error('Three.js initialization error:', err);
      setError('Failed to initialize 3D graphics. Please check your browser compatibility.');
    }
  }, [isClient, isMobile]);

  // Don't render anything on mobile - use CSS background instead
  if (isMobile) {
    return null;
  }

  // Show loading or error state
  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading 3D Graphics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
