import { ReactNode } from "react";

interface RightProps {
  /** 오른쪽에 들어갈 내용입니다. */
  children: ReactNode;
}

function Right({ children }: RightProps) {
  return <div>{children}</div>;
}

export default Right;
