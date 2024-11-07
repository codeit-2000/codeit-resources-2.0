import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Team Table
  Team: a
    .model({
      name: a.string().required(),
    })
    .authorization((allow) => [allow.groups(["ADMIN", "MEMBER"])]),

  // User Table
  User: a
    .model({
      id: a.id().required(),
      username: a.string().required(),
      email: a.string().required(),
      role: a.enum(["ADMIN", "MEMBER"]),
      teams: a.string().array(), // 소속된 팀 id 목록
      profileImage: a.string(),
      createdAt: a.datetime(),
      // foo: a.string(),
    })
    .authorization((allow) => [
      allow.groups(["ADMIN", "MEMBER"]),
      allow.guest(),
    ])
    .secondaryIndexes((index) => [
      index("role").sortKeys(["username"]).queryField("listUsersByRoleName"),
      index("role").sortKeys(["createdAt"]).queryField("listUsersByRoleDate"),
      // index("foo").sortKeys(["username"]).queryField("UsersSortByName"),
      // index("foo").sortKeys(["createdAt"]).queryField("UsersSortByCreatedAt"),
    ]),

  ResourceType: a.enum(["ROOM", "SEAT", "EQUIPMENT"]),
  ResourceStatus: a.enum(["FIXED", "DISABLED"]),

  // Resource Table
  Resource: a
    .model({
      resourceType: a.ref("ResourceType"),
      resourceSubtype: a.string(),
      resourceStatus: a.ref("ResourceStatus"),
      name: a.string().required(),
      description: a.string(),
      image: a.string(),
      owner: a.string(),
      reservations: a.hasMany("Reservation", "resourceId"),
      googleResourceId: a.string(),
    })
    .secondaryIndexes((index) => [
      index("resourceType")
        .sortKeys(["name"])
        .queryField("listResourceByTypeAndName"),
      index("name").queryField("getResourceByName"),
      index("resourceStatus")
        .sortKeys(["name"])
        .queryField("listResourceByResourceStatus"),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("ADMIN"),
    ]),

  // Reservation Table
  ReservationStatus: a.enum([
    "CONFIRMED",
    "CANCELED",
    "PASSED",
    "FIXED",
    "DISABLED",
  ]),

  Reservation: a
    .model({
      title: a.string(),
      resourceId: a.id().required(), // 연결된 리소스 id
      resourceType: a.ref("ResourceType").required(),
      resourceSubtype: a.string(),
      resourceName: a.string().required(),
      resource: a.belongsTo("Resource", "resourceId"), // Resource 컬렉션(테이블)에서 [Reservation의 resourceId]를 사용해서 리소스를 연결
      date: a.date().required(), // DATE,SO 8601 확장 날짜 문자열 (형식: YYYY-MM-DD)
      startTime: a.time().required(), // TIME, ISO 8601 확장 시간 문자열 (형식: hh:mm:ss.sss)
      endTime: a.time().required(), // TIME, ISO 8601 확장 시간 문자열 (형식: hh:mm:ss.sss)
      status: a.ref("ReservationStatus").required(), // 예약 상태
      participants: a.string().array(), // 참여자 목록, 유저 id를 배열로 저장
      googleEventId: a.string(),
    })
    .secondaryIndexes((index) => [
      //  ** 리소스 id 별 예약 데이터 index **
      //  await client.models.Reservation.listByResource({
      //   resourceId: 'RESOURCE_ID',
      //   date: {
      //     eq: "2024-10-15",
      //   }

      index("resourceId")
        .sortKeys(["date"])
        .queryField("listByResourceIdAndSortByDate")
        .name("listByResourceIdAndSortByDate"),

      index("resourceType")
        .sortKeys(["resourceName"])
        .queryField("listByResourceTypeAndSortByResourceName")
        .name("listByResourceTypeAndSortByResourceName"),

      index("resourceType")
        .sortKeys(["resourceSubtype"])
        .queryField("listByResourceTypeAndSortByResourceSubtype")
        .name("listByResourceTypeAndSortByResourceSubtype"),

      index("status")
        .sortKeys(["date"])
        .queryField("listByStatusAndSortByDate")
        .name("listByStatusAndSortByDate"),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["ADMIN", "MEMBER"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
