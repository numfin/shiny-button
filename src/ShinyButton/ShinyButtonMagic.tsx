import { useEffect, useRef, useState } from "react";
import { clamp, distance, lerp } from "./math.tools";
import { createRAFLoop } from "./frame.tools";
import style from "./shiny.module.css";

const CIRCLE_RADIUS = 50;
const INTERPOLATION_STEP = 0.03;

export function ShinyButtonMagic() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [circleScale, setCircleScale] = useState(1);
  const [magicActive, setMagicActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const circleRadius = () => circleScale * CIRCLE_RADIUS;

  function updateCursorPosition(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const pos = getCursorPosWithinContainer(e, containerRef.current!);
    setCursorPos(pos);
  }

  function updateCirclePos() {
    const halfRadius = circleRadius() / 2;
    if (magicActive) {
      const halfWidth = containerRef.current?.clientWidth ?? 1 / 2;
      const halfHeight = containerRef.current?.clientWidth ?? 1 / 2;
      return setCirclePos({
        x: lerp(circlePos.x, halfWidth - halfRadius, 0.1),
        y: lerp(circlePos.y, halfHeight - halfRadius, 0.1),
      });
    }
    setCirclePos({
      x: lerp(circlePos.x, cursorPos.x - halfRadius, INTERPOLATION_STEP),
      y: lerp(circlePos.y, cursorPos.y - halfRadius, INTERPOLATION_STEP),
    });
  }

  function updateCircleScale() {
    if (magicActive) {
      return setCircleScale(lerp(circleScale, 15, 0.1));
    }
    const maxDistance = 40; // 40px
    const scale = maxDistance / distance(circlePos, cursorPos);
    const scaleNormalized = clamp(scale, 0.2, 1);
    setCircleScale(lerp(circleScale, scaleNormalized, 0.1));
  }

  function activateMagic() {
    setMagicActive(true);
  }
  function deactivateMagic() {
    setMagicActive(false);
  }
  function reset() {
    setCursorPos({ x: 150, y: -50 });
    deactivateMagic();
  }

  useEffect(() => {
    return createRAFLoop(() => {
      updateCirclePos();
      updateCircleScale();
    });
  });

  return (
    <div
      className={style["magic-container"]}
      ref={containerRef}
      onPointerMove={updateCursorPosition}
      onPointerDown={activateMagic}
      onPointerUp={deactivateMagic}
      onPointerLeave={reset}
    >
      <div
        className={style["magic-circle"]}
        style={{
          transform: `translate(${circlePos.x}px,${circlePos.y}px) scale(${circleScale})`,
        }}
      />
    </div>
  );
}

interface ClientRect {
  getBoundingClientRect(): DOMRect;
}
interface MouseCoords {
  clientX: number;
  clientY: number;
}

function getCursorPosWithinContainer(
  mouseEvent: MouseCoords,
  containerEl: ClientRect
) {
  const containerRect = containerEl?.getBoundingClientRect();
  const [cX, cY, cW, cH] = [
    containerRect?.x ?? 0,
    containerRect?.y ?? 0,
    containerRect?.width ?? 0,
    containerRect?.height ?? 0,
  ];
  return {
    x: clamp(mouseEvent.clientX - cX, 0, cW),
    y: clamp(mouseEvent.clientY - cY, 0, cH),
  };
}
