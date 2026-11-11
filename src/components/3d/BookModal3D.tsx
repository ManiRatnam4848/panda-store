import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, RotateCcw, Play, Pause, ShoppingBag, Check } from 'lucide-react';
import { Book } from '../../types/book';

interface BookModal3DProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
}

export const BookModal3D: React.FC<BookModal3DProps> = ({
  book,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [added, setAdded] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Dynamic cover texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = book.coverBgColor || '#F6F1E8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = book.accentColor || '#C66B48';
      ctx.lineWidth = 8;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      ctx.fillStyle = book.accentColor || '#C66B48';
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText('PANDA STORE · INSPECTION', canvas.width / 2, 160);

      // Geometric motif
      ctx.strokeStyle = 'rgba(32, 37, 31, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 600, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = book.accentColor || '#315C46';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 600, 100, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = book.coverTextColor || '#20251F';
      ctx.font = 'bold 60px "Playfair Display", Georgia, serif';
      const words = book.title.split(' ');
      if (words.length > 3) {
        ctx.fillText(words.slice(0, 3).join(' '), canvas.width / 2, 980);
        ctx.fillText(words.slice(3).join(' '), canvas.width / 2, 1060);
      } else {
        ctx.fillText(book.title, canvas.width / 2, 1020);
      }

      // Author
      ctx.fillStyle = book.coverTextColor || '#20251F';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(book.author.toUpperCase(), canvas.width / 2, 1220);
    }
    const coverTexture = new THREE.CanvasTexture(canvas);

    // Spine
    const spineCanvas = document.createElement('canvas');
    spineCanvas.width = 160;
    spineCanvas.height = 1440;
    const sCtx = spineCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = book.spineColor || '#DFD8CC';
      sCtx.fillRect(0, 0, spineCanvas.width, spineCanvas.height);

      sCtx.save();
      sCtx.translate(spineCanvas.width / 2, spineCanvas.height / 2);
      sCtx.rotate(Math.PI / 2);
      sCtx.fillStyle = book.coverTextColor || '#20251F';
      sCtx.font = 'bold 36px "Playfair Display", serif';
      sCtx.textAlign = 'center';
      sCtx.fillText(book.title, 0, 12);
      sCtx.restore();
    }
    const spineTexture = new THREE.CanvasTexture(spineCanvas);

    // Geometry
    const bookWidth = 2.2;
    const bookHeight = 3.0;
    const bookThickness = 0.42;

    const bookGroup = new THREE.Group();

    const clothEdgeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(book.spineColor || '#DFD8CC'),
      roughness: 0.5,
    });
    const coverFrontMaterial = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.35,
    });
    const coverBackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(book.coverBgColor || '#F6F1E8'),
      roughness: 0.5,
    });
    const spineMaterial = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.4,
    });
    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAF7EF,
      roughness: 0.9,
    });

    // Pages
    const pagesGeo = new THREE.BoxGeometry(bookWidth - 0.1, bookHeight - 0.1, bookThickness - 0.04);
    const pagesMesh = new THREE.Mesh(pagesGeo, [
      pagesMaterial,
      clothEdgeMaterial,
      pagesMaterial,
      pagesMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
    ]);
    bookGroup.add(pagesMesh);

    // Front Cover
    const frontCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, 0.035);
    const frontCover = new THREE.Mesh(frontCoverGeo, [
      clothEdgeMaterial,
      spineMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
      coverFrontMaterial,
      clothEdgeMaterial,
    ]);
    frontCover.position.set(0, 0, bookThickness / 2);
    bookGroup.add(frontCover);

    // Back Cover
    const backCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, 0.035);
    const backCover = new THREE.Mesh(backCoverGeo, [
      clothEdgeMaterial,
      spineMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
      clothEdgeMaterial,
      coverBackMaterial,
    ]);
    backCover.position.set(0, 0, -bookThickness / 2);
    bookGroup.add(backCover);

    // Spine
    const spineGeo = new THREE.BoxGeometry(0.035, bookHeight, bookThickness);
    const spineMesh = new THREE.Mesh(spineGeo, spineMaterial);
    spineMesh.position.set(-bookWidth / 2, 0, 0);
    bookGroup.add(spineMesh);

    scene.add(bookGroup);

    // Lights
    const ambient = new THREE.AmbientLight(0xFFFBF4, 1.6);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xD6E4F0, 1.0);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    // Interactive Drag Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      bookGroup.rotation.y += deltaX * 0.01;
      bookGroup.rotation.x += deltaY * 0.01;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        bookGroup.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      coverTexture.dispose();
      spineTexture.dispose();
      frontCoverGeo.dispose();
      backCoverGeo.dispose();
      pagesGeo.dispose();
      spineGeo.dispose();
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [isOpen, book, isRotating]);

  if (!isOpen) return null;

  const handleAdd = () => {
    onAddToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#20251F]/15 rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* 3D Canvas Column */}
        <div className="relative bg-[#ECE5D8] flex flex-col items-center justify-center min-h-[380px] md:min-h-[500px]">
          <div ref={mountRef} className="w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing" />
          
          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#5C635B] bg-[#FAF7F2]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-300">
            <span>Drag to rotate 360°</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="flex items-center gap-1 hover:text-[#20251F] transition-colors"
                title={isRotating ? 'Pause auto-rotation' : 'Play auto-rotation'}
              >
                {isRotating ? <Pause size={14} /> : <Play size={14} />}
                <span>{isRotating ? 'Pause' : 'Rotate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Book Details Column */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#315C46] font-semibold">
                  {book.category} · {book.format}
                </span>
                <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#20251F] mt-1 leading-snug">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="text-sm italic text-[#5C635B] mt-0.5">{book.subtitle}</p>
                )}
                <p className="text-sm font-medium text-[#20251F] mt-2">By {book.author}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#5C635B]">
              <p className="line-clamp-4 leading-relaxed">{book.description}</p>
              
              <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block">Pages</span>
                  <span className="font-mono font-medium text-stone-800">{book.pages} pages</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Dimensions</span>
                  <span className="font-medium text-stone-800">{book.dimensions}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">ISBN</span>
                  <span className="font-mono text-stone-800">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Binding</span>
                  <span className="font-medium text-stone-800">Clothbound & Foil Stamped</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200 mt-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block">Price (incl. taxes)</span>
              <span className="text-2xl font-bold font-mono text-[#20251F]">
                ₹{book.price.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#315C46] hover:bg-[#244434] text-white shadow-sm'
              }`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
