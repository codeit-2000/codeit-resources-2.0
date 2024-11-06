import Button from "@/components/commons/Button";
import ListItem from "@/components/commons/ListItem";
import Skeleton from "@/components/commons/Skeleton";

export default function MeetingRoomsSettingSkeleton() {
  return (
    <div className="max-h-full min-h-[100vh] bg-gray-5 px-25 pt-64 md:px-88 md:pt-80 lg:px-118">
      <div className="flex items-center justify-between">
        <h1 className="text-24-700 text-gray-100 md:text-28-700">
          회의실 설정
        </h1>
      </div>
      <div className="mt-40 flex flex-col gap-16">
        {" "}
        <div className="flex flex-col gap-16">
          {[1, 2, 3, 4, 5].map((item) => (
            <ListItem isBackground key={item}>
              <ListItem.Title>
                <Skeleton className="h-20 w-100 rounded" />
              </ListItem.Title>
            </ListItem>
          ))}
        </div>
      </div>
      <div>
        <hr className="my-20" />
        <div className="pb-110 md:pb-20">
          <Button variant="secondary" width="w-115" height="h-45" disabled>
            분류 추가
          </Button>
        </div>
      </div>
    </div>
  );
}
