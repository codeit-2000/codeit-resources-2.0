import Button from "@/components/commons/Button";
import { ResourceType } from "@/lib/api/amplify/helper";
import Link from "next/link";

import RESOURCE_EMPTY_INFO from "../RESOURCE_INFO";

function EmptyReservation({ resourceType }: { resourceType: ResourceType }) {
  return (
    <div className="flex h-172 w-full flex-col items-center justify-center gap-16 rounded-16 bg-gray-15">
      <p className="text-18-400 text-gray-100-opacity-80">
        {RESOURCE_EMPTY_INFO[resourceType].desc}
      </p>
      <Link href={RESOURCE_EMPTY_INFO[resourceType].to}>
        <Button variant="secondary">
          {RESOURCE_EMPTY_INFO[resourceType].buttonText}
        </Button>
      </Link>
    </div>
  );
}

export default EmptyReservation;
