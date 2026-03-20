import React from 'react';
import { DesignConfig, LogoStyle } from '../types';

export type TShirtView = 'front' | 'back' | 'left' | 'right';

interface TShirtMockup2DProps {
  color: string;
  view?: TShirtView;
  designs?: Record<string, DesignConfig>;
  logoStyle?: LogoStyle;
  logoColor?: string;
  className?: string;
}

const LOGO_SETS = {
  classic: {
    front: '/logos/45_classic_front.svg',
    back: '/logos/45_classic_back.svg',
    useFilter: true
  },
  dominican: {
    front: '/logos/45_dominican_front.svg',
    back: '/logos/45_dominican_back.svg',
    useFilter: false
  }
} as const;

const LOGO_SLEEVE_URL = '/logos/45_sleeve.svg';

// Base SVG Paths for the 4 views
const PATHS = {
  front: {
    viewBox: "0 0 208.81 250.45",
    // Combined silhouette for Front
    d: "m206.93,89.86c-4.97,3.25-10.35,5.96-15.84,8.2-4.36,1.78-8.87,3.24-13.49,4.18-2.41.49-4.85.85-7.31,1.01-1.18.08-2.36.11-3.55.1-.59,0-1.18-.03-1.77-.06-.3-.02-.59-.04-.88-.06,0-.44-.01-.88-.01-1.32-.1-10.42-.24-21.01,2.23-31.21,1.26-5.23,3.41-10.05,5.41-15.02,1.78-4.41,3.44-8.87,5.05-13.34,2.08-5.79,4.07-11.62,5.98-17.48,11.15,12.63,14.88,29.84,19.1,45.64,1.72,6.45,3.42,12.9,5.1,19.36-3.05,1.99-2.12-8.17,0,0 m-72.6, -86.36c-1.91,10.02-8.98,18.57-18.39,22.44-8.82,3.63-19.23,2.88-27.35-2.17-5.74-3.57-10.33-8.91-12.69-15.28-.64-1.73-1.15-3.51-1.47-5.32-.05-.3-.29-.73.04-.86.32-.13.64-.25.96-.38,1.45-.57,2.9-1.15,4.35-1.72.88,9.08,6.88,16.89,15.22,20.45,9.06,3.86,19.85,1.54,26.81-5.3,4.09-4.02,6.67-9.45,7.24-15.15,1.03.41,2.05.81,3.08,1.22.63.25,1.26.5,1.89.75.73.29.47.5.32,1.33-.05.24.04-.22,0,0 m-8.68, 4.12c-3.83,8.23-12.48,13.73-21.58,13.56-9.03-.16-17.43-5.7-21.09-13.97,7.12.58,14.28.75,21.43.75s14.3-.17,21.43-.75c-.06.14-.12.27-.18.41-.07.16.06-.14,0,0 m2.06, -7.62c-.19,1.99-.63,3.95-1.32,5.83-2.14.18-4.29.32-6.44.43-5.18.27-10.36.37-15.55.37s-10.16-.1-15.24-.36c-2.16-.11-4.32-.24-6.48-.43-.62-.05-.92-2.05-1.06-2.63-.25-1.06-.43-2.13-.53-3.22,7.74.74,15.54.92,23.31.92s15.57-.18,23.3-.92c0,.06-6.12.59,0,0 m-83.02, 15.27c9.39-4.24,18.86-8.32,28.34-12.37,1.51,9.33,7.36,17.78,15.59,22.44,8.64,4.89,19.47,5.69,28.58,1.52,9.71-4.45,16.87-13.34,18.59-23.96,7.13,3.04,14.24,6.12,21.33,9.24,7.87,3.47,15.74,7,23.32,11.08.34.18.69.37,1.03.56.3.17.03.58-.07.89-.36,1.1-.72,2.2-1.09,3.3-1.19,3.59-2.42,7.17-3.67,10.73-1.55,4.41-3.15,8.8-4.84,13.15-1.82,4.68-4,9.24-5.53,14.03-4.27,13.37-3.67,27.61-3.45,41.48.18,11.04.4,22.08.63,33.12.3,14.82.62,29.65.94,44.47.29,13.44.59,26.87.89,40.31.06,2.54.11,5.07.17,7.61.02,1.09.05,2.18.07,3.27.01.48.02.95.03,1.43-1.57.24-3.15.48-4.73.7-12.1,1.72-24.28,2.88-36.48,3.49-24.39,1.21-48.88.19-73.08-3.04-1.46-.2-2.91-.4-4.37-.61-.73-.11-1.46-.21-2.18-.32-.36-.05-.73-.11-1.09-.16-.46-.07-.36-.04-.36-.4.02-1.04.05-2.08.07-3.13.06-2.45.11-4.91.16-7.36.14-6.1.27-12.2.41-18.3.32-14.71.65-29.42.96-44.12.29-13.74.58-27.48.85-41.23.15-7.6.36-15.21.37-22.82,0-10.54.09-21.12-2.66-31.39-1.36-5.08-3.55-9.8-5.49-14.67-1.74-4.37-3.37-8.77-4.95-13.2-2-5.61-3.92-11.25-5.76-16.91-.13-.4,1.25-.92,1.6-1.1,1.19-.64,2.39-1.26,3.6-1.87,4.04-2.05,8.13-3.99,12.26-5.85,10.34-4.67-9.93,4.49,0,0 m-33.45, 39.51c1.95-7.1,4.65-14.02,8.28-20.44,1.89-3.34,4.01-6.6,6.56-9.48,2.23,6.85,4.57,13.66,7.04,20.42,1.62,4.42,3.29,8.83,5.12,13.17,2.17,5.17,4.02,10.32,5.04,15.85.97,5.23,1.33,10.55,1.43,15.86.05,2.57.04,5.14.04,7.71,0,1.16,0,2.32,0,3.48,0,.63-.01,1.26-.02,1.89-.69.05-1.38.09-2.06.11-9.5.25-18.94-2.58-27.55-6.4-3.24-1.43-6.4-3.04-9.47-4.8-.96-.55-1.9-1.11-2.84-1.7-.27-.17-.55-.34-.82-.52-.27-.17.46-2.23.56-2.6,2.77-10.63,5.59-21.25,8.5-31.84.07-.24.13-.47.2-.71,4.84-17.58-3.69,13.4,0,0 m-11.24, 42.4c.51-1.99,1.02-3.97,1.53-5.95,5.02,3.21,10.4,5.93,15.93,8.16,8.57,3.47,17.93,5.89,27.25,5.19-.02,1.16-.03,2.32-.05,3.48-.01.67-.02,1.35-.03,2.02,0,.54-.2.36-.67.37-.44.01-.88.02-1.31.02-2.65,0-5.29-.14-7.92-.44-4.77-.54-9.49-1.56-14.07-3-6.4-2-12.61-4.78-18.31-8.32-.79-.49-1.58-1-2.34-1.54.22-.87,2.75,1.93,0,0 m104.41, 153.27c-11.95,0-23.89-.54-35.79-1.61-5.98-.54-11.95-1.2-17.9-2-1.46-.2-2.91-.4-4.37-.61-.73-.11-1.46-.21-2.18-.32-.36-.06-.73-.11-1.09-.17,0-.13,0-.25,0-.38.05-2.15.1-4.3.15-6.45,24.23,3.72,48.79,5.24,73.29,4.5,16.43-.5,32.82-2,49.06-4.5.05,2.1.1,4.2.14,6.3.01.62-.06.54-.72.64-.73.11-1.45.22-2.18.33-1.58.23-3.15.45-4.73.66-5.95.8-11.92,1.47-17.9,2-11.9,1.07-23.84,1.61-35.79,1.61 m59.69, -145.88c9.31.7,18.67-1.72,27.25-5.19,5.53-2.23,10.91-4.95,15.93-8.16.51,1.99,1.03,3.97,1.54,5.96-.52.36-1.05.71-1.58,1.06-2.12,1.36-4.33,2.6-6.58,3.73-7.57,3.81-15.74,6.51-24.13,7.75-2.99.44-6.02.7-9.05.74-.76.01-1.52.01-2.29,0-.33,0-.66-.01-.99-.03,0-.46-.01-.92-.02-1.39-.02-1.49-.05-2.98-.07-4.47,1.04.08.02,1.63,0,0"
  },
  back: {
    viewBox: "0 0 208.81 250.45",
    d: "m44.69,15.27c9.39-4.24,18.86-8.32,28.34-12.37-3.93-3.08-10.74-2.81-14.15-2.58,3-1.55,10.23-2.31,14.07-.46C83,5.18,93.63,5.56,104.31,5.65c19.72-.45,34.02-3.88,38.11-4.95,2.44,1.26,8.68,1.28,14.65.62-5.78-.58-13.6-1.78-14.73.34,4.24,5.39,12.59,8.44,21.82,10.87,7.87,3.47,15.74,7,23.32,11.08.34.18.69.37,1.03.56.3.17.03.58-.07.89-.36,1.1-.72,2.2-1.09,3.3-1.19,3.59-2.42,7.17-3.67,10.73-1.55,4.41-3.15,8.8-4.84,13.15-1.82,4.68-4,9.24-5.53,14.03-4.27,13.37-3.67,27.61-3.45,41.48.18,11.04.4,22.08.63,33.12.3,14.82.62,29.65.94,44.47.29,13.44.59,26.87.89,40.31.06,2.54.11,5.07.17,7.61.02,1.09.05,2.18.07,3.27.01.48.02.95.03,1.43-1.57.24-3.15.48-4.73.7-12.1,1.72-24.28,2.88-36.48,3.49-24.39,1.21-48.88.19-73.08-3.04-1.46-.2-2.91-.4-4.37-.61-.73-.11-1.46-.21-2.18-.32-.36-.05-.73-.11-1.09-.16-.46-.07-.36-.04-.36-.4.02-1.04.05-2.08.07-3.13.06-2.45.11-4.91.16-7.36.14-6.1.27-12.2.41-18.3.32-14.71.65-29.42.96-44.12.29-13.74.58-27.48.85-41.23.15-7.6.36-15.21.37-22.82,0-10.54.09-21.12-2.66-31.39-1.36-5.08-3.55-9.8-5.49-14.67-1.74-4.37-3.37-8.77-4.95-13.2-2-5.61-3.92-11.25-5.76-16.91-.13-.4,1.25-.92,1.6-1.1,1.19-.64,2.39-1.26,3.6-1.87,4.04-2.05,8.13-3.99,12.26-5.85,10.34-4.67-9.93,4.49,0,0"
  },
  left: {
    viewBox: "0 0 57.06 102.77",
    d: "m32.06,0c.9,1.38,1.69,2.83,2.34,4.35,3.31,7.24,5.48,14.88,7.91,22.42,1.32,4.09,2.71,8.16,4.05,12.25l.89,2.3c2.75,7.18,5.43,14.41,8.38,21.52,1,2.36.32,4.2-1.71,5.82-1.59,1.26-3.41,2.02-5.34,2.54-6.86,1.86-13.84,3.2-20.84,4.45-6.6,1.17-13.26,2-19.86,3.15-.36.06-.67.36-.93.64-1.63,1.72-3.18,3.52-4.97,5.08-.2.18-.58.12-.89.15-.31-.5-.65-.99-.92-1.51-1.07-2.11-.97-4.31-.08-6.43,2.46-5.8,5.78-11.16,8.71-16.73,1.17-2.22,2.44-4.39,3.64-6.61,4.46-8.24,4.2-17.16,2.58-26.06-1.41-7.79-4.14-14.99-7.92-21.84-2.45-4.44-5.32-8.62-8.31-12.72-.6-1.04-.54-1.92,0-2.92,1.33-2.09,3.23-3.56,5.32-4.78C11.5,.31,16,.08,20.57.14c3.84.05,7.69.17,11.53.22.46.06-.05-.18-.04-.36,0,0,0,0,0,0Z"
  },
  right: {
    viewBox: "0 0 57.06 102.77",
    d: "m25,0c-.9,1.38-1.69,2.83-2.34,4.35-3.31,7.24-5.48,14.88-7.91,22.42-1.32,4.09-2.71,8.16-4.05,12.25l-.89,2.3c-2.75,7.18-5.43,14.41-8.38,21.52-1,2.36-.32,4.2,1.71,5.82,1.59,1.26,3.41,2.02,5.34,2.54,6.86,1.86,13.84,3.2,20.84,4.45,6.6,1.17,13.26,2,19.86,3.15.36.06.67.36.93.64,1.63,1.72,3.18,3.52,4.97,5.08.2.18.58.12.89.15.31-.5.65-.99.92-1.51,1.07-2.11.97-4.31.08-6.43-2.46-5.8-5.78-11.16-8.71-16.73-1.17-2.22-2.44-4.39-3.64-6.61-4.46-8.24-4.2-17.16-2.58-26.06,1.41-7.79,4.14-14.99,7.92-21.84,2.45-4.44,5.32-8.62,8.31-12.72.6-1.04.54-1.92,0-2.92-1.33-2.09-3.23-3.56-5.32-4.78-4.36-2.52-8.86-2.75-13.43-2.69-3.84.05-7.69.17-11.53.22-.46.06.05-.18.04-.36,0,0,0,0,0,0Z"
  }
};

const TShirtMockup2D: React.FC<TShirtMockup2DProps> = ({ color, view = 'front', designs, logoStyle, logoColor, className }) => {
  const getLogoFilter = (hexColor: string, forceNone: boolean) => {
    if (forceNone) return 'none'; 
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? 'brightness(0)' : 'brightness(0) invert(1)';
  };

  const currentLogoSet = logoStyle ? LOGO_SETS[logoStyle] : null;

  const renderLogo = () => {
    if (!currentLogoSet) return null;
    let url = '';
    
    if (view === 'front') url = currentLogoSet.front;
    else if (view === 'back') url = currentLogoSet.back;
    else if (view === 'left') url = LOGO_SLEEVE_URL;

    if (!url) return null;

    if (logoColor && logoStyle === 'classic' && (view === 'front' || view === 'back')) {
        return (
            <div 
              style={{
                  position: 'absolute',
                  top: view === 'front' || view === 'back' ? '25%' : '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: view === 'front' || view === 'back' ? '50%' : '60%',
                  aspectRatio: '1',
                  backgroundColor: logoColor,
                  maskImage: `url(${url})`,
                  WebkitMaskImage: `url(${url})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))',
              }}
            />
        );
    }
    
    return (
       <img 
           src={url}
           alt="Logo"
           style={{
               position: 'absolute',
               top: view === 'front' || view === 'back' ? '25%' : '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               width: view === 'front' || view === 'back' ? '50%' : '60%',
               filter: `${getLogoFilter(color, !currentLogoSet.useFilter)} drop-shadow(0px 2px 2px rgba(0,0,0,0.2))`,
               transition: 'filter 0.3s ease',
               pointerEvents: 'none'
           }}
       />
    );
  };

  const currentDesign = designs?.[view];

  const getTextStyles = (): React.CSSProperties => {
      if (!currentDesign) return {};
      const isGradient = currentDesign.textColor.includes('gradient');
      return {
        textAlign: 'center',
        fontFamily: currentDesign.fontFamily,
        fontWeight: currentDesign.fontFamily.includes('Arial') ? 'bold' : 'normal',
        fontSize: view === 'left' || view === 'right' ? '18px' : '26px', 
        lineHeight: 1.1,
        wordWrap: 'break-word',
        pointerEvents: 'none',
        background: isGradient ? currentDesign.textColor : 'transparent',
        WebkitBackgroundClip: isGradient ? 'text' : 'border-box',
        backgroundClip: isGradient ? 'text' : 'border-box',
        WebkitTextFillColor: isGradient ? 'transparent' : currentDesign.textColor,
        color: isGradient ? 'transparent' : currentDesign.textColor,
        textTransform: currentDesign.textTransform as any,
        width: '100%',
        textShadow: isGradient ? 'none' : '0px 1px 2px rgba(0,0,0,0.1)'
      };
  };

  return (
    <div className={`relative flex items-center justify-center ${className || 'w-full h-full min-h-[300px]'}`}>
      
      {/* Dynamic SVG Model Rendered beautifully with 2D Drop shadows for mock 3D feel */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={PATHS[view].viewBox}
        className="w-full h-full object-contain filter drop-shadow-2xl brightness-110"
        style={{
            transform: view === 'left' || view === 'right' ? 'scale(0.8)' : 'scale(1)',
            transition: 'transform 0.4s ease'
        }}
      >
        <g fill={color} style={{ transition: 'fill 0.3s ease' }}>
           {/* Internal Shadow effect overlay trick for depth */}
           <path d={PATHS[view].d} />
           <path d={PATHS[view].d} fill="url(#shading)" style={{ mixBlendMode: 'multiply', opacity: 0.15 }} />
           <path d={PATHS[view].d} fill="url(#highlight)" style={{ mixBlendMode: 'screen', opacity: 0.1 }} />
        </g>

        <defs>
            <linearGradient id="shading" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000" stopOpacity="0"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="highlight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0"/>
                <stop offset="50%" stopColor="#fff" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
        </defs>
      </svg>
      
      {/* Logos and Texts positioned on the fabric */}
      <div 
        className="absolute w-[60%] h-[60%] flex flex-col items-center top-[15%]"
        style={{
            top: view === 'front' || view === 'back' ? '15%' : '25%',
            left: '50%',
            transform: 'translateX(-50%)'
        }}
      >
        {renderLogo()}
        {currentDesign?.enabled && currentDesign.text && (
            <div 
                className="absolute w-[80%] left-[10%] text-center"
                style={{
                  ...getTextStyles(), 
                  top: view === 'front' || view === 'back' ? '60%' : '75%'
                }}
            >
                {currentDesign.text}
            </div>
        )}
      </div>

    </div>
  );
};

export default TShirtMockup2D;
