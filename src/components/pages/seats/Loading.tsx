export default function Loading() {
  return (
    <div className="mb-200 overflow-x-auto md:mx-60">
      <div className="mx-16 my-28 grid w-[668px] auto-rows-auto grid-cols-2 gap-40 md:my-70 md:w-[1004px] xl:flex-shrink-0">
        <SeatBlockSkeleton length={4} />
        <SeatBlockSkeleton length={5} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={10} />
        <SeatBlockSkeleton length={5} />
        <SeatBlockSkeleton length={5} />
      </div>
    </div>
  );
}

function SeatBlockSkeleton({ length }: { length: number }) {
  return (
    <div className="flex w-324 flex-wrap gap-6 md:w-482 md:gap-8">
      {Array.from({ length }).map((_, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SeatButtonSkeleton key={idx} />
      ))}
    </div>
  );
}

function SeatButtonSkeleton() {
  return (
    <div className="relative mb-5 h-36 w-60 overflow-hidden rounded-3 border border-gray-100-opacity-20 bg-white px-10 md:h-48 md:w-90">
      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-gray-70 to-transparent opacity-10" />
    </div>
  );
}
