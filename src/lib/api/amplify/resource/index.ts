import { Dispatch, SetStateAction, useEffect } from "react";

import { Resource, ResourceType, client } from "../helper";

// Create

type CreateResourceParams = {
  resourceType: ResourceType;
  resourceSubtype?: string;
  name: string;
  description?: string;
  image?: string;
};

/**
 * @description Resource 생성 (관리자만 생성할 수 있습니다.)
 *
 * @example
 * ```tsx
 * const handleClick = async () => {
 *   await createResource({
 *     resourceType: "ROOM",
 *     resourceSubtype: "미팅룸",
 *     name: "미팅룸A",
 *   });
 * };
 * ```
 */

export const createResource = async (resourceData: CreateResourceParams) =>
  client.models.Resource.create(resourceData);

// Read

export const getResourceListByName = async (name: string) =>
  client.models.Resource.getResourceByName({
    name,
  });

export const getResourceList = async ({
  resourceType,
  resourceSubtype,
}: {
  resourceType?: "ROOM" | "SEAT" | "EQUIPMENT";
  resourceSubtype?: string;
  // eslint-disable-next-line
} = {}) => {
  // resourceSubtype이 정의되었지만 resourceType이 없는 경우 에러 처리
  if (resourceSubtype && !resourceType) {
    throw new Error("resourceSubtype을 사용할 경우 resourceType은 필수입니다.");
  }

  // 전체 목록을 가져오는 경우
  if (resourceType === undefined) return client.models.Resource.list();

  // resourceType에 따른 목록을 가져오는 경우
  if (resourceType && resourceSubtype === undefined) {
    return client.models.Resource.listResourceByTypeAndName(
      {
        resourceType,
      },
      {
        sortDirection: "ASC",
      },
    );
  }

  // resourceType과 resourceSubtype에 따른 목록을 가져오는 경우
  if (resourceType && resourceSubtype) {
    return client.models.Resource.listResourceByTypeAndName(
      {
        resourceType,
      },
      {
        filter: { resourceSubtype: { eq: resourceSubtype } },
        sortDirection: "ASC",
      },
    );
  }
};

export const getSeatResourceListByResourceStatus = async (
  status: "DISABLED" | "FIXED",
) =>
  client.models.Resource.listResourceByResourceStatus(
    { resourceStatus: status },
    {
      filter: { resourceType: { eq: "SEAT" } },
      sortDirection: "ASC",
      selectionSet: ["name", "resourceSubtype", "owner"],
    },
  );

export const checkUserFixedSeat = async (userId: string) => {
  const { data } = await client.models.Resource.listResourceByResourceStatus(
    { resourceStatus: "FIXED" },
    {
      filter: { resourceType: { eq: "SEAT" }, owner: { eq: userId } },
      sortDirection: "ASC",
      selectionSet: ["id"],
    },
  );

  if (data.length === 0) return false;
  return data[0].id;
};

/**
 * @description 구독을 통한 실시간 업데이트 훅
 *
 * @example
 * ```tsx
 * const [resource, setResource] = useState<Array<Schema["Resource"]["type"]>>([]);
 *
 * useSubscribeResource(setResource);
 * ```
 */
export const useSubscribeResource = (
  setResource: Dispatch<SetStateAction<Array<Resource>>>,
) => {
  useEffect(() => {
    const subscription = client.models.Resource.observeQuery().subscribe({
      next: (data) => setResource([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, [setResource]);
};

// Update

interface UpdateResourceNameParams {
  id: string;
  name: string;
}

/**
 * @description Resource의 이름을 업데이트하는 함수
 *
 * @example
 * ```tsx
 * const params = {
 *   id: "resourceId123", // 고유 ID
 *   name: "미팅룸1", // 업데이트할 이름
 * };
 *
 * await updateResourceName(params);
 * ```
 */

export const updateResourceName = async (params: UpdateResourceNameParams) =>
  client.models.Resource.update(params);

interface EditResourceParams {
  id: string;
  resourceStatus: "fixed" | "disabled" | "enable";
  owner?: string;
}

export const editResource = async ({
  id,
  resourceStatus,
  owner,
  // eslint-disable-next-line
}: EditResourceParams) => {
  if (resourceStatus === "fixed") {
    return client.models.Resource.update({
      id,
      resourceStatus: "FIXED",
      owner,
    });
  }

  if (resourceStatus === "disabled") {
    return client.models.Resource.update({
      id,
      resourceStatus: "DISABLED",
    });
  }

  if (resourceStatus === "enable") {
    return client.models.Resource.update({
      id,
      resourceStatus: null,
    });
  }
};

export const deleteSeatResourceStatus = async (id: string) =>
  client.models.Resource.update({
    id,
    resourceStatus: null,
    owner: null,
  });

// Delete

/**
 *
 * @description Resource를 삭제하는 함수
 *
 * @example
 * ```tsx
 * const id = "resourceId123";
 * await deleteResource(id);
 * ```
 */

export const deleteResource = async (id: string) =>
  client.models.Resource.delete({ id });
