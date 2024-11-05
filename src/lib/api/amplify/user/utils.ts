import { User, client } from "../helper";

type OrderType = "latest" | "oldest" | "alphabetical";

export const sortUserList = (userList: User[], order: OrderType) => {
  switch (order) {
    case "latest":
      return userList.sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
          (a.createdAt ? new Date(a.createdAt).getTime() : 0),
      );
    case "oldest":
      return userList.sort(
        (a, b) =>
          (a.createdAt ? new Date(a.createdAt).getTime() : 0) -
          (b.createdAt ? new Date(b.createdAt).getTime() : 0),
      );
    case "alphabetical":
      return userList.sort((a, b) => a.username.localeCompare(b.username));
    default:
      return userList;
  }
};

export const fetchUsersByRole = async (
  role: "ADMIN" | "MEMBER",
  order: OrderType,
) => {
  switch (order) {
    case "latest":
      return (
        await client.models.User.listUsersByRoleDate(
          { role },
          { sortDirection: "DESC" },
        )
      ).data;
    case "oldest":
      return (
        await client.models.User.listUsersByRoleDate(
          { role },
          { sortDirection: "ASC" },
        )
      ).data;
    case "alphabetical":
      return (
        await client.models.User.listUsersByRoleName(
          { role },
          { sortDirection: "ASC" },
        )
      ).data;
    default:
      return (await client.models.User.listUsersByRoleDate({ role })).data;
  }
};
