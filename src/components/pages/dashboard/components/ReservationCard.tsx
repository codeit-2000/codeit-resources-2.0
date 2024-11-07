import Badge from "@/components/commons/Badge";
import Button from "@/components/commons/Button";
import useIsOngoing from "@/hooks/useIsOngoing";
import { Reservation } from "@/lib/api/amplify/helper";
import { compareTimes, getCurrentTime } from "@/lib/utils/timeUtils";

import { getResourceDetails } from "../RESOURCE_INFO";
import useDashboardAction from "../hooks/useDashboardAction";

type CardProps = {
  title: string;
  desc: string;
  badgeText: string;
  buttonText: string;
  onClickButton: () => void;
  // eslint-disable-next-line
  resourceName?: string;
  isOngoing: boolean;
};

function DetailedCard({
  title,
  desc,
  badgeText,
  buttonText,
  onClickButton,
  resourceName,
  isOngoing,
}: CardProps) {
  return (
    <div className="relative h-172 w-275 shrink-0 rounded-8 border-[1px] border-gray-100-opacity-10 p-32">
      {isOngoing && (
        <div className="absolute right-8 top-4">
          <Badge variant="primary">{badgeText}</Badge>
        </div>
      )}
      <h3 className="mb-8 truncate text-20-700 text-gray-100-opacity-80">
        {title}
      </h3>
      <p className="mb-12 text-14-500 text-gray-100-opacity-80">{desc}</p>
      <Badge variant="secondary">{resourceName}</Badge>
      {isOngoing && (
        <div className="absolute bottom-16 right-16">
          <Button size="small" variant="secondary" onClick={onClickButton}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

function SimpleCard({
  title,
  desc,
  badgeText,
  buttonText,
  onClickButton,
  isOngoing,
}: CardProps) {
  const ongoing = desc === "고정 좌석" ? false : isOngoing;
  return (
    <div className="relative flex h-172 w-275 shrink-0 flex-col items-center justify-center gap-8 rounded-8 border-[1px] border-gray-100-opacity-10 p-32 text-center">
      {isOngoing && (
        <div className="absolute right-8 top-4">
          <Badge variant="primary">{badgeText}</Badge>
        </div>
      )}
      <h3 className="text-20-700 text-gray-100-opacity-80">
        <Badge variant="secondary">{title}</Badge>
      </h3>
      <p className="text-14-500 text-gray-100-opacity-80">{desc}</p>
      {ongoing && (
        <div>
          <Button size="small" variant="secondary" onClick={onClickButton}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

function ReservationCard({
  reservation,
  isDetailed = false,
}: {
  reservation: Reservation;
  isDetailed?: boolean;
}) {
  const buttonActions = useDashboardAction(reservation);
  const isOngoing = useIsOngoing(reservation.startTime, reservation.endTime);
  const resourceDetail = getResourceDetails(reservation);
  const currentTime = getCurrentTime();

  if (
    reservation.resourceType === "ROOM" &&
    !compareTimes(currentTime, reservation.endTime)
  )
    return null;

  return isDetailed ? (
    <DetailedCard
      {...resourceDetail}
      onClickButton={buttonActions[reservation.resourceType]}
      isOngoing={isOngoing}
      resourceName={reservation.resourceName}
    />
  ) : (
    <SimpleCard
      {...resourceDetail}
      onClickButton={buttonActions[reservation.resourceType]}
      isOngoing={isOngoing}
    />
  );
}

export default ReservationCard;
