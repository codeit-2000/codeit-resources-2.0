interface TooltipProps {
  title: string | null | undefined;
  participants?: string[] | null | undefined;
}

export function Tooltip({ title, participants }: TooltipProps) {
  return (
    <div className="absolute bottom-0 left-50 z-[4] -translate-x-1/2 -translate-y-full md:bottom-20">
      <div className="w-max rounded-8 bg-gray-90 px-8 py-4">
        <p className="text-13-500 text-white">{title}</p>
        {participants && (
          <p className="text-12-400 text-gray-50">
            참여자: {participants.length}명
          </p>
        )}
      </div>
      {/* 말풍선 꼬리 */}
      <div className="absolute left-1/4 top-full h-0 w-0 -translate-x-1/2 border-8 border-solid border-gray-90 border-b-transparent border-l-transparent border-r-transparent" />
    </div>
  );
}
