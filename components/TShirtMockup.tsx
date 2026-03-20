import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, Decal, OrbitControls, Environment, Center, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { DesignConfig, LogoStyle } from '../types';

export type TShirtView = 'front' | 'back' | 'left' | 'right';

interface TShirtMockupProps {
  color: string;
  view: TShirtView;
  className?: string;
  designs?: Record<string, DesignConfig>;
  logoStyle?: LogoStyle;
  logoColor?: string;
}

// Logos locales
const LOGO_SETS = {
  classic: {
    front: '/logos/45_classic_front.svg',
    back: '/logos/45_classic_back.svg',
    useFilter: true,
  },
  dominican: {
    front: '/logos/45_dominican_front.svg',
    back: '/logos/45_dominican_back.svg',
    useFilter: false,
  }
};

/* ── Create a texture from an SVG url with optional color tinting ── */
function useSVGTexture(
  url: string,
  tintColor?: string,
  useFilter?: boolean,
  shirtColor?: string,
  size = 512
): THREE.Texture {
  const canvasRef = useRef(document.createElement('canvas'));
  const texRef = useRef(new THREE.CanvasTexture(canvasRef.current));
  const imgRef = useRef(new Image());
  const loadedRef = useRef(false);

  // Initialize canvas size
  useMemo(() => {
    canvasRef.current.width = size;
    canvasRef.current.height = size;
  }, [size]);

  // Load image once
  useMemo(() => {
    loadedRef.current = false;
    const img = imgRef.current;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedRef.current = true;
      // Trigger initial draw
      drawLogo(canvasRef.current, img, size, tintColor, useFilter, shirtColor);
      texRef.current.needsUpdate = true;
    };
    img.src = url;
  }, [url]);

  // Redraw when tintColor or shirtColor changes
  useMemo(() => {
    if (loadedRef.current) {
      drawLogo(canvasRef.current, imgRef.current, size, tintColor, useFilter, shirtColor);
      texRef.current.needsUpdate = true;
    }
  }, [tintColor, shirtColor, useFilter, size]);

  return texRef.current;
}

/* ── Create a proportional texture from a wide SVG (like CM logo) ── */
function useWideTexture(
  url: string,
  tintColor?: string,
  useFilter?: boolean,
  shirtColor?: string,
  width = 1024,
  height = 256
): THREE.Texture {
  const canvasRef = useRef(document.createElement('canvas'));
  const texRef = useRef(new THREE.CanvasTexture(canvasRef.current));
  const imgRef = useRef(new Image());
  const loadedRef = useRef(false);

  useMemo(() => {
    canvasRef.current.width = width;
    canvasRef.current.height = height;
  }, [width, height]);

  useMemo(() => {
    loadedRef.current = false;
    const img = imgRef.current;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedRef.current = true;
      drawWide(canvasRef.current, img, width, height, tintColor, useFilter, shirtColor);
      texRef.current.needsUpdate = true;
    };
    img.src = url;
  }, [url]);

  useMemo(() => {
    if (loadedRef.current) {
      drawWide(canvasRef.current, imgRef.current, width, height, tintColor, useFilter, shirtColor);
      texRef.current.needsUpdate = true;
    }
  }, [tintColor, shirtColor, useFilter, width, height]);

  return texRef.current;
}

function drawWide(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  w: number, h: number,
  tintColor?: string,
  useFilter?: boolean,
  shirtColor?: string
) {
  const ctx = canvas.getContext('2d')!;
  const scale = Math.min(w / img.width, h / img.height) * 0.9;
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.clearRect(0, 0, w, h);

  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);

  if (tintColor && useFilter) {
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = tintColor;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  } else if (useFilter && !tintColor && shirtColor) {
    const hex = shirtColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq >= 128) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
}

function drawLogo(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  size: number,
  tintColor?: string,
  useFilter?: boolean,
  shirtColor?: string
) {
  const ctx = canvas.getContext('2d')!;
  const scale = Math.min(size / img.width, size / img.height) * 0.9;
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.clearRect(0, 0, size, size);

  if (tintColor && useFilter) {
    // Classic logo with custom logoColor: tint the entire SVG
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = tintColor;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
  } else if (useFilter && !tintColor && shirtColor) {
    // Classic logo auto-adapting: dark logo on light shirts
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    const hex = shirtColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq >= 128) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, size, size);
      ctx.globalCompositeOperation = 'source-over';
    }
  } else {
    // Dominican or no filter: draw as-is
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  }
}

/* ── Create a texture from text ── */
function useTextTexture(text: string, design: DesignConfig | undefined, size = 512): THREE.Texture | null {
  const texture = useMemo(() => {
    if (!text || !design) return null;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const tex = new THREE.CanvasTexture(canvas);

    const fontFamily = design.fontFamily || 'Arial';
    const fontSize = Math.floor(size * 0.18);
    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${fontSize}px ${fontFamily}, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const color = design.textColor || '#FFFFFF';
    if (color.includes('gradient')) {
      // Parse CSS gradient colors and create canvas gradient
      const colorMatches = color.match(/#[0-9A-Fa-f]{3,8}/g);
      if (colorMatches && colorMatches.length >= 2) {
        const gradient = ctx.createLinearGradient(0, size * 0.3, size, size * 0.7);
        colorMatches.forEach((c: string, i: number) => {
          gradient.addColorStop(i / (colorMatches.length - 1), c);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#FFFFFF';
      }
    } else {
      ctx.fillStyle = color;
    }

    let displayText = text;
    if (design.textTransform === 'uppercase') displayText = text.toUpperCase();
    else if (design.textTransform === 'lowercase') displayText = text.toLowerCase();
    else if (design.textTransform === 'capitalize') {
      displayText = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }

    ctx.fillText(displayText, size / 2, size / 2, size * 0.9);
    tex.needsUpdate = true;
    return tex;
  }, [text, design?.textColor, design?.fontFamily, design?.textTransform, size]);
  return texture;
}

/* ── Shirt mesh with Decal logos + text ── */
const Shirt = ({ color, logoStyle = 'classic', logoColor, designs }: {
  color: string;
  logoStyle: LogoStyle;
  logoColor?: string;
  designs?: Record<string, DesignConfig>;
}) => {
  type GLTFResult = {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };
  const { nodes, materials } = useGLTF('/shirt_baked.glb') as unknown as GLTFResult;
  const logoSet = LOGO_SETS[logoStyle];

  const frontTex = useSVGTexture(logoSet.front, logoColor, logoSet.useFilter, color);
  const backTex = useSVGTexture(logoSet.back, logoColor, logoSet.useFilter, color);

  // CM Brand logo on left sleeve — proportional wide texture, synced with logo color
  const cmSleeveTex = useWideTexture('/logos/CM_Logo_Blanc.svg', logoColor, true, color, 1024, 204);

  // Text textures
  const frontText = designs?.front?.enabled ? designs.front.text : '';
  const backText = designs?.back?.enabled ? designs.back.text : '';
  const leftText = designs?.left?.enabled ? designs.left.text : '';
  const rightText = designs?.right?.enabled ? designs.right.text : '';
  const frontTextTex = useTextTexture(frontText || '', designs?.front, 512);
  const backTextTex = useTextTexture(backText || '', designs?.back, 512);
  const leftTextTex = useTextTexture(leftText || '', designs?.left, 512);
  const rightTextTex = useTextTexture(rightText || '', designs?.right, 512);

  useFrame((_, delta) => {
    if (materials.lambert1) {
      easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  return (
    <mesh
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      {/* Front logo decal */}
      <Decal
        position={[0, 0.13, 0.15]}
        rotation={[0, 0, 0]}
        scale={0.20}
        map={frontTex}
        map-anisotropy={16}
        depthTest={false}
      />

      {/* Back logo decal */}
      <Decal
        position={[0, 0.13, -0.15]}
        rotation={[0, Math.PI, 0]}
        scale={0.20}
        map={backTex}
        map-anisotropy={16}
        depthTest={false}
      />

      {/* Left sleeve: CM brand logo (on sleeve fabric, centered) */}
      <Decal
        position={[0.27, 0.03, - 0.02]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.08, 0.02, 0.10]}
        map={cmSleeveTex}
        map-anisotropy={16}
        depthTest={false}
      />

      {/* Left sleeve: custom text (above CM logo) */}
      {leftTextTex && (
        <Decal
          position={[0.27, 0.05, -0.02]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[0.07, 0.07, 0.10]}
          map={leftTextTex}
          map-anisotropy={16}
          depthTest={false}
        />
      )}

      {/* Right sleeve: custom text */}
      {rightTextTex && (
        <Decal
          position={[-0.27, 0.03, -0.02]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[0.07, 0.07, 0.10]}
          map={rightTextTex}
          map-anisotropy={16}
          depthTest={false}
        />
      )}

      {/* Front text decal */}
      {frontTextTex && (
        <Decal
          position={[0, 0.04, 0.15]}
          rotation={[0, 0, 0]}
          scale={0.18}
          map={frontTextTex}
          map-anisotropy={16}
          depthTest={false}
        />
      )}

      {/* Back text decal */}
      {backTextTex && (
        <Decal
          position={[0, 0.01, -0.15]}
          rotation={[0, Math.PI, 0]}
          scale={0.18}
          map={backTextTex}
          map-anisotropy={16}
          depthTest={false}
        />
      )}
    </mesh>
  );
};

/* ── Camera animator ── */
const CameraController = ({ view }: { view: TShirtView }) => {
  const ref = useRef<React.ElementRef<typeof OrbitControls>>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t =
      view === 'front' ? 0 :
        view === 'back' ? Math.PI :
          view === 'right' ? -Math.PI / 2 :
            Math.PI / 2;

    ref.current.setAzimuthalAngle(
      THREE.MathUtils.lerp(ref.current.getAzimuthalAngle(), t, 0.15)
    );
    ref.current.update();
  });

  return (
    <OrbitControls
      ref={ref}
      enableZoom minDistance={1.5} maxDistance={4}
      enablePan={false}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.8}
    />
  );
};

/* ── Main component ── */
const TShirtMockup: React.FC<TShirtMockupProps> = ({
  color, view, className,
  designs, logoStyle = 'classic', logoColor,
}) => (
  <div className={`relative ${className}`} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
    <Canvas
      camera={{ position: [0, 0, 0], fov: 35 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <directionalLight position={[0, 3, -6]} intensity={0.6} />
      <directionalLight position={[0, -2, -4]} intensity={0.3} />
      <Environment preset="studio" />

      <Suspense fallback={null}>
        <Center>
          <Shirt color={color} logoStyle={logoStyle} logoColor={logoColor} designs={designs} />
        </Center>
      </Suspense>

      <CameraController view={view} />
    </Canvas>
  </div>
);

useGLTF.preload('/shirt_baked.glb');
export default TShirtMockup;