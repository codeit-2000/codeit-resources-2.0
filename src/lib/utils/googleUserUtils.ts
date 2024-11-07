import {
  CreateGoogleUserParams,
  createGoogleUser,
  getUserListByEmail,
} from "../api/amplify/user";

// session.user 타입과 일치하도록 수정
type SessionUser = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

const googleUserUtils = async (sessionUser: SessionUser) => {
  try {
    // 필수 필드 체크
    if (!sessionUser.name || !sessionUser.email) {
      console.log("Invalid user data:", sessionUser);
      return null;
    }

    const resultList = await getUserListByEmail(sessionUser.email);
    console.log("resultList", resultList);

    // DynamoDB에 유저가 있음
    if (resultList.data && resultList.data.length) {
      return resultList.data[0];
    }

    // CreateGoogleUserParams에 맞게 파라미터 구성
    const param: CreateGoogleUserParams = {
      username: sessionUser.name,
      email: sessionUser.email,
      profileImage: sessionUser.image || undefined, // null 대신 undefined 사용
      role: "MEMBER",
      teams: ["2f1de757-a23b-4808-9550-8f605bbf8fcd"],
    };

    const newUser = await createGoogleUser(param);
    console.log("newUser", newUser);
    return newUser.data;
  } catch (error) {
    console.error("Error in googleUserUtils:", error);
    return null;
  }
};

export default googleUserUtils;
