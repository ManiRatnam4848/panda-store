import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BookScene3DProps {
  title?: string;
  subtitle?: string;
  author?: string;
  coverBgColor?: string;
  coverTextColor?: string;
  accentColor?: string;
  spineColor?: string;
  interactive?: boolean;
  className?: string;
}

export const BookScene3D: React.FC<BookScene3DProps> = ({
  title = 'This Is Where We Live',
  subtitle = 'Illustrated Stories of Place and Space',
  author = 'Gestalten & Studio Monolith',
  coverBgColor = '#ECE7DE',
  coverTextColor = '#20251F',
  accentColor = '#C66B48',
  spineColor = '#DFD8CC',
  interactive = true,
  className = 'w-full h-full min-h-[380px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGlError(true);
        return;
      }
    } catch {
      setHasWebGlError(true);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGlError(true);
      return;
    }

    // Dynamic High-Res Cover Texture Canvas
    const createCoverTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base cover paper tone
        ctx.fillStyle = coverBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle paper grain pattern
        ctx.fillStyle = 'rgba(0,0,0,0.015)';
        for (let i = 0; i < 400; i++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          ctx.fillRect(rx, ry, 2, 2);
        }

        // Elegant geometric architectural frame
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

        // Thin inner hairline
        ctx.strokeStyle = 'rgba(32, 37, 31, 0.12)';
        ctx.lineWidth = 2;
        ctx.strokeRect(76, 76, canvas.width - 152, canvas.height - 152);

        // Editorial brand header
        ctx.fillStyle = accentColor;
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '4px';
        ctx.fillText('PANDA STORE · EDITIONS', canvas.width / 2, 160);

        // Central Graphic: Isometric architectural block illustration
        const cx = canvas.width / 2;
        const cy = 600;

        // Draw isometric cubes / stepped architectural massing
        ctx.save();
        ctx.translate(cx, cy);

        // Isometric cube function
        const drawIsoCube = (x: number, y: number, size: number, colorTop: string, colorLeft: string, colorRight: string) => {
          const h = size * 0.58;
          // Top face
          ctx.fillStyle = colorTop;
          ctx.beginPath();
          ctx.moveTo(x, y - h);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x - size, y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(32, 37, 31, 0.15)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Left face
          ctx.fillStyle = colorLeft;
          ctx.beginPath();
          ctx.moveTo(x - size, y);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x, y + h + size * 1.2);
          ctx.lineTo(x - size, y + size * 1.2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right face
          ctx.fillStyle = colorRight;
          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x + size, y + size * 1.2);
          ctx.lineTo(x, y + h + size * 1.2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        };

        // Stacked architectural volumes
        drawIsoCube(0, 80, 140, '#FAF7F2', '#E2DCD1', '#C66B48');
        drawIsoCube(-80, -20, 100, '#315C46', '#254736', '#FAF7F2');
        drawIsoCube(70, -40, 110, '#EAE3D6', '#D9CEBD', '#20251F');
        drawIsoCube(0, -140, 90, '#C66B48', '#A95837', '#FAF7F2');

        // Fine grid lines
        ctx.strokeStyle = 'rgba(32, 37, 31, 0.08)';
        ctx.lineWidth = 1.5;
        for (let i = -180; i <= 180; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 200);
          ctx.lineTo(i + 40, 240);
          ctx.stroke();
        }

        ctx.restore();

        // Title (Editorial Serif)
        ctx.fillStyle = coverTextColor;
        ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';

        // Word wrap title if long
        const words = title.split(' ');
        if (words.length > 3) {
          const line1 = words.slice(0, 3).join(' ');
          const line2 = words.slice(3).join(' ');
          ctx.fillText(line1, canvas.width / 2, 1020);
          ctx.fillText(line2, canvas.width / 2, 1100);
        } else {
          ctx.fillText(title, canvas.width / 2, 1060);
        }

        // Subtitle
        if (subtitle) {
          ctx.fillStyle = 'rgba(32, 37, 31, 0.7)';
          ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
          ctx.fillText(subtitle, canvas.width / 2, 1170);
        }

        // Author
        ctx.fillStyle = coverTextColor;
        ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText(author.toUpperCase(), canvas.width / 2, 1260);

        // Lower publisher seal
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 1330, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('PS', canvas.width / 2, 1336);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 4;
      return texture;
    };

    // Spine Texture
    const createSpineTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = spineColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Spine borders
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 20, canvas.width - 20, canvas.height - 40);

        // Rotated spine text
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = coverTextColor;
        ctx.font = 'bold 36px "Playfair Display", serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, 0, 12);
        ctx.restore();

        // Publisher mark at bottom of spine
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('P·S', canvas.width / 2, canvas.height - 60);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Pages edge texture
    const createPagesTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FAF6EE';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fine horizontal page lines
        ctx.strokeStyle = 'rgba(215, 204, 185, 0.35)';
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 3) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    const coverTexture = createCoverTexture();
    const spineTexture = createSpineTexture();
    const pagesTexture = createPagesTexture();

    // Book Group
    const bookGroup = new THREE.Group();

    const bookWidth = 2.2;
    const bookHeight = 3.0;
    const bookThickness = 0.42;
    const coverOverhang = 0.05;

    // Materials
    const coverFrontMaterial = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.35,
      metalness: 0.05,
    });

    const coverBackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(coverBgColor),
      roughness: 0.45,
      metalness: 0.05,
    });

    const spineMaterial = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.4,
      metalness: 0.05,
    });

    const pagesMaterial = new THREE.MeshStandardMaterial({
      map: pagesTexture,
      roughness: 0.8,
      metalness: 0.0,
    });

    const clothEdgeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(spineColor),
      roughness: 0.6,
    });

    // 1. Pages block
    const pagesGeo = new THREE.BoxGeometry(
      bookWidth - coverOverhang * 2,
      bookHeight - coverOverhang * 2,
      bookThickness - 0.04
    );
    // Face materials order: +X, -X, +Y, -Y, +Z, -Z
    const pagesMaterials = [
      pagesMaterial,     // Right (open edge)
      clothEdgeMaterial, // Left (spine inside)
      pagesMaterial,     // Top
      pagesMaterial,     // Bottom
      clothEdgeMaterial, // Front
      clothEdgeMaterial, // Back
    ];
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMaterials);
    pagesMesh.position.set(coverOverhang * 0.5, 0, 0);
    pagesMesh.castShadow = true;
    pagesMesh.receiveShadow = true;
    bookGroup.add(pagesMesh);

    // 2. Front Hardcover Board
    const coverThickness = 0.035;
    const frontCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    const frontMaterials = [
      clothEdgeMaterial, // right
      spineMaterial,     // left
      clothEdgeMaterial, // top
      clothEdgeMaterial, // bottom
      coverFrontMaterial,// front face
      clothEdgeMaterial, // inner face
    ];
    const frontCover = new THREE.Mesh(frontCoverGeo, frontMaterials);
    frontCover.position.set(0, 0, (bookThickness / 2));
    frontCover.castShadow = true;
    bookGroup.add(frontCover);

    // 3. Back Hardcover Board
    const backCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    const backMaterials = [
      clothEdgeMaterial,
      spineMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
      coverBackMaterial,
    ];
    const backCover = new THREE.Mesh(backCoverGeo, backMaterials);
    backCover.position.set(0, 0, -(bookThickness / 2));
    backCover.castShadow = true;
    bookGroup.add(backCover);

    // 4. Curved Spine
    const spineGeo = new THREE.BoxGeometry(coverThickness, bookHeight, bookThickness);
    const spineMesh = new THREE.Mesh(spineGeo, spineMaterial);
    spineMesh.position.set(-(bookWidth / 2), 0, 0);
    spineMesh.castShadow = true;
    bookGroup.add(spineMesh);

    // Initial position & tilt
    bookGroup.rotation.y = -0.42;
    bookGroup.rotation.x = 0.18;
    bookGroup.rotation.z = -0.06;
    bookGroup.position.y = 0.05;
    scene.add(bookGroup);

    // Ground Studio Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 110);
      grad.addColorStop(0, 'rgba(32, 37, 31, 0.35)');
      grad.addColorStop(0.5, 'rgba(32, 37, 31, 0.12)');
      grad.addColorStop(1, 'rgba(32, 37, 31, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.9;
    scene.add(shadowPlane);

    // Studio Lighting
    // Ambient light (warm, soft)
    const ambientLight = new THREE.AmbientLight(0xFFF9F0, 1.4);
    scene.add(ambientLight);

    // Key Light (warm directional)
    const keyLight = new THREE.DirectionalLight(0xFFF0DD, 2.0);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light (cool soft ambient balance)
    const fillLight = new THREE.DirectionalLight(0xDCE8F5, 0.9);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    // Rim Light (sharp highlight from behind)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.3);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Cursor tracking
    let targetRotY = -0.42;
    let targetRotX = 0.18;
    let targetPosY = 0.05;

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = -0.42 + x * 0.7;
      targetRotX = 0.18 - y * 0.45;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating bob
      const floatOffset = Math.sin(elapsedTime * 1.6) * 0.08;
      targetPosY = 0.05 + floatOffset;

      // Smooth damping interpolation (lerp)
      bookGroup.rotation.y += (targetRotY - bookGroup.rotation.y) * 0.06;
      bookGroup.rotation.x += (targetRotX - bookGroup.rotation.x) * 0.06;
      bookGroup.position.y += (targetPosY - bookGroup.position.y) * 0.06;

      // Dynamic shadow opacity response
      shadowPlane.scale.set(
        1 + floatOffset * 0.8,
        1 + floatOffset * 0.8,
        1
      );

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // WebGL Context Lost safety
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setHasWebGlError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      coverTexture.dispose();
      spineTexture.dispose();
      pagesTexture.dispose();
      shadowTexture.dispose();

      frontCoverGeo.dispose();
      backCoverGeo.dispose();
      pagesGeo.dispose();
      spineGeo.dispose();
      shadowGeo.dispose();

      coverFrontMaterial.dispose();
      coverBackMaterial.dispose();
      spineMaterial.dispose();
      pagesMaterial.dispose();
      clothEdgeMaterial.dispose();
      shadowMat.dispose();

      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.dispose();
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, [title, subtitle, author, coverBgColor, coverTextColor, accentColor, spineColor, interactive]);

  if (hasWebGlError) {
    // Elegant 2D Fallback Container
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <div
          className="relative w-64 h-88 rounded-md p-6 flex flex-col justify-between book-shadow border border-stone-300"
          style={{ backgroundColor: coverBgColor, color: coverTextColor }}
        >
          <div className="border border-stone-300/40 p-4 h-full flex flex-col justify-between">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest block font-medium" style={{ color: accentColor }}>
                PANDA STORE · EDITIONS
              </span>
              <div className="w-12 h-0.5 mx-auto mt-2 mb-6" style={{ backgroundColor: accentColor }} />
              <h3 className="font-editorial text-2xl font-bold leading-tight">{title}</h3>
              {subtitle && <p className="text-xs italic mt-2 opacity-75">{subtitle}</p>}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider uppercase">{author}</p>
              <div className="w-6 h-6 rounded-full border border-current mx-auto mt-3 flex items-center justify-center text-[10px] font-bold">
                PS
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative select-none overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    />
  );
};
