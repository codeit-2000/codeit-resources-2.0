import { OrderType } from "@/constants/dropdownConstants";

import { Role, client } from "../helper";
import { fetchUsersByRole, sortUserList } from "./utils";

// TODO: 팀이 새롭게 생성되어서 멤버 목록 관련된 API는 추후에 해보겠습니다.

export type CreateUserParams = {
  id: string; // cognito에서 생성된 id값으로 진행합니다.
  username: string; // 유저 이름
  email: string; // 유저 이메일
  role: Role; // 유저 역할 ADMIN | MEMBER
  teams: string[]; // 소속 팀
  profileImage?: string; // 유저 프로필 이미지
};
/**
 * @description [유저 생성하기] - 관리자 페이지
 *
 * id, username, email, role, teams 모두 입력받아야 합니다.
 */
export const createUserData = async (param: CreateUserParams) =>
  client.models.User.create(param);

/**
 * @description [특정 유저 정보 가져오기]
 *
 * 해당 id값을 가진 유저 정보 가져오기
 * 내 정보, 다른 사람 정보 다 가져올 수 있음
 */
export const getUserData = async (id: string) => client.models.User.get({ id });

type SelectionSet = Array<
  "id" | "username" | "email" | "role" | "teams" | "profileImage"
>;

/**
 * @description [전체 유저 정보 가져오기]
 *
 * 유저 List 정보 가져오기
 * 인자에 값을 넣어주는 것으로 필요한 필드 값만 가져올 수 있음
 */
export const getUserList = async (selectionSet?: SelectionSet) => {
  if (!selectionSet) return client.models.User.list();

  return client.models.User.list({
    selectionSet: [...selectionSet],
  });
};

export type UpdateUserParams = {
  id: string; // 업데이트할 유저 ID
  role?: Role;
  username?: string;
  email?: string;
  profileImage?: string;
  teams?: string[];
};
/**
 * @description [유저 정보 수정하기]
 *
 * id는 필수
 * role, username, email, profileImage는 선택
 */
export const updateUserData = async (param: UpdateUserParams) =>
  client.models.User.update(param);

/**
 * @description [유저 삭제하기]
 */
export const deleteUserData = async (id: string) =>
  client.models.User.delete({ id });

/**
 * @description [유저 목록 가져오기]
 *
 * [category]
 * 0: 전체
 * 1: 멤버
 * 2: 어드민
 * 그 외: 소속 팀
 *
 * [order]
 * latest 최신순
 * oldest 오래된순
 * alphabetical 가나다순
 */
export const getUserListData = async (category: string, order: OrderType) => {
  switch (category) {
    case "0":
      // eslint-disable-next-line
      const userList = (await client.models.User.list()).data;
      return sortUserList(userList, order);
    case "1":
      return fetchUsersByRole("MEMBER", order);
    case "2":
      return fetchUsersByRole("ADMIN", order);
    default:
      // eslint-disable-next-line
      const userListByTeam = (
        await client.models.User.list({
          filter: { teams: { contains: category } },
        })
      ).data;
      return sortUserList(userListByTeam, order);
  }
};
