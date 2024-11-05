import { Resource } from "../helper";

export function getGroupedResourceListBySubtype(
  data: Resource[],
): Record<string, Resource[]> {
  if (data.length === 0) return {};

  return data.reduce(
    (acc, resource) => {
      const subtype = resource.resourceSubtype || "기타";
      if (!acc[subtype]) {
        acc[subtype] = [];
      }
      acc[subtype].push(resource);
      return acc;
    },
    {} as Record<string, Resource[]>,
  );
}
