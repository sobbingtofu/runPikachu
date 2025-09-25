import React, {
  useState,
  useEffect,
  useRef,
  type PropsWithChildren,
} from 'react';

interface ScrollingBackgroundProps {
  src: string;
  speed: number;
  isGameStarted: boolean;
}

const ScrollingBackground = ({
  src,
  speed,
  isGameStarted,
}: PropsWithChildren<ScrollingBackgroundProps>) => {
  const [imageWidth, setImageWidth] = useState(0);
  const xPosRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now()); // 마지막 프레임 시간 저장

  useEffect(() => {
    if (!viewportRef.current) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const containerHeight = viewportRef.current!.clientHeight;
      if (containerHeight > 0) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const calculatedWidth = containerHeight * aspectRatio;
        setImageWidth(calculatedWidth);
      }
    };
  }, [src]);

  // 게임 시작 상태에 따라 애니메이션을 실행/중지
  useEffect(() => {
    if (!isGameStarted || imageWidth === 0) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    // 애니메이션 시작 시 마지막 프레임 시간을 현재로 초기화
    lastFrameTimeRef.current = performance.now();

    const animate = (currentTime: DOMHighResTimeStamp) => {
      // deltaTime 계산 (ms 단위)
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // 60fps 기준으로 속도 보정
      const speedFactor = deltaTime / 16.67;
      xPosRef.current -= speed * speedFactor;

      if (xPosRef.current <= -imageWidth) {
        xPosRef.current = 0;
      }

      if (contentRef.current) {
        contentRef.current.style.transform = `translateX(${xPosRef.current}px)`;
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isGameStarted, imageWidth, speed]);

  const bgImageStyle: React.CSSProperties = {
    width: imageWidth > 0 ? `${imageWidth}px` : 'auto',
    height: '100%',
    flexShrink: 0,
  };

  return (
    <div
      ref={viewportRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        visibility: imageWidth > 0 ? 'visible' : 'hidden',
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: imageWidth > 0 ? `${imageWidth * 2}px` : '200%',
          height: '100%',
          display: 'flex',
        }}
      >
        <img src={src} style={bgImageStyle} alt='background' />
        <img src={src} style={bgImageStyle} alt='background' />
      </div>
    </div>
  );
};

export default ScrollingBackground;
