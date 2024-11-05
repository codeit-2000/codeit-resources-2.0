/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactNode, useEffect, useRef, useState } from "react";

import useTabDrag from "./useTabDrag";

interface Props {
  /** ReactNode를 반환하는 함수를 children으로 가집니다. */
  children: (props: {
    activeIndex: number | string;
    handleClick: (id: number | string) => void;
  }) => ReactNode;
  /** 가장 처음 렌더될 때 active 상태인 탭의 index를 지정합니다. */
  defaultIndex: number | string;
  /** 탭 전체에 추가적인 CSS 클래스를 적용합니다. */
  className?: string;
}

/**
 *
 * @example
 * ```tsx
 * const DATA = [
 *   { id: 0, label: "Tab 1" },
 *   { id: 1, label: "Tab 2" },
 *   { id: 2, label: "Tab 3" },
 * ];
 *
 * function MyComponent() {
 *   return (
 *     <Tab defaultIndex={DATA[0].id}>
 *       {({ activeIndex, handleClick }) =>
 *         DATA.map(({ id, label }) => (
 *           <button
 *             key={id}
 *             onClick={() => {
 *               handleClick(id);
 *               // do something...
 *             }}
 *             className={activeIndex === id ? "bg-red-500" : ""}
 *           >
 *             {label}
 *           </button>
 *         ))
 *       }
 *     </Tab>
 *   );
 * }
 * ```
 */

export default function Tab({ children, defaultIndex, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useTabDrag(containerRef);

  const onClick = (id: number | string) => {
    setActiveIndex(id);
  };

  useEffect(() => {
    setActiveIndex(defaultIndex);
  }, [defaultIndex]);

  return (
    <div
      ref={containerRef}
      className={`no-scrollbar flex w-full select-none items-end overflow-x-scroll whitespace-nowrap ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {children({ activeIndex, handleClick: onClick })}
    </div>
  );
}
