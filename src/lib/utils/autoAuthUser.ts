/* eslint-disable no-console */
import {
  ADD_MEMBER_ERROR_MESSAGE,
  CONFIRM_ERROR_MESSAGE,
  EMAIL_EDIT_ERROR_MESSAGE,
  ROLE_ERROR_MESSAGE,
} from "@/constants/error-message/user";
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
  },
});

// 유저를 특정 그룹에 삭제
const removeUserFromGroup = async (email: string, groupName: string) => {
  const params = {
    GroupName: groupName,
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
  };

  try {
    const command = new AdminRemoveUserFromGroupCommand(params);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      console.error(error.name);
      throw new Error(ROLE_ERROR_MESSAGE[error.name]);
    }
    throw new Error("유저의 역할을 수정하지 못했습니다.");
  }
};

// 유저를 특정 그룹에 추가
const addUserToGroup = async (email: string, groupName: string) => {
  const params = {
    GroupName: groupName,
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
  };

  try {
    const command = new AdminAddUserToGroupCommand(params);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      console.error(error.name);
      throw new Error(ROLE_ERROR_MESSAGE[error.name]);
    }
    throw new Error("유저의 역할을 추가하지 못했습니다.");
  }
};

// 비밀번호 설정 함수
export const setUserPassword = async (email: string, password: string) => {
  const setUserPasswordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
    Password: password,
    Permanent: true,
  });

  try {
    await cognitoClient.send(setUserPasswordCommand);
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      console.error(error.name);
      throw new Error(ADD_MEMBER_ERROR_MESSAGE[error.name]);
    }
    throw new Error("유저의 비밀번호를 설정하지 못했습니다.");
  }
};

// 사용자 생성
const createUserInCognito = async (email: string) => {
  const createUserCommand = new AdminCreateUserCommand({
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
    TemporaryPassword: "Test12345!",
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  });

  try {
    const response = await cognitoClient.send(createUserCommand);
    const userId = response.User?.Username;

    if (!userId) {
      throw new Error("응답에서 사용자 ID를 찾을 수 없습니다.");
    }

    // 비밀번호를 영구적으로 설정
    await setUserPassword(email, "Test12345!");

    return userId;
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      console.error(error.name);
      throw new Error(ADD_MEMBER_ERROR_MESSAGE[error.name]);
    }
    throw new Error("해당 유저를 추가하지 못했습니다.");
  }
};

/**
 * @description 자동으로 유저를 그룹에 추가하고, 이메일 인증해줌
 *
 * @param groupName MEMBER | ADMIN
 * @param email 유저 이메일
 */
export const autoAuthUser = async (groupName: string, email: string) => {
  try {
    // 유저 추가
    const userId = await createUserInCognito(email);

    // 그룹에 유저 추가
    await addUserToGroup(email, groupName);

    return userId;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "사용자 인증 프로세스 중 오류 발생");
    }
    throw new Error("사용자 인증 프로세스 중 오류 발생");
  }
};

/**
 * @description 유저를 그룹에 삭제하고, 추가함 (그룹 수정)
 *
 * @param groupName MEMBER | ADMIN
 * @param email 유저 이메일
 */
export const editUserGroup = async (
  groupName: "MEMBER" | "ADMIN",
  email: string,
) => {
  const groupToRemove = groupName === "ADMIN" ? "MEMBER" : "ADMIN";
  try {
    await removeUserFromGroup(email, groupToRemove);
    await addUserToGroup(email, groupName);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "유저의 그룹을 수정하지 못했습니다.");
    }
    throw new Error("유저의 그룹을 수정하지 못했습니다.");
  }
};

/**
 * @description 유저의 이메일 수정
 *
 * @param email 기존 이메일
 * @param newEmail 변경할 이메일
 */
export const editUserEmail = async (email: string, newEmail: string) => {
  const updateParams = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: newEmail,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  try {
    const command = new AdminUpdateUserAttributesCommand(updateParams);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      throw new Error(EMAIL_EDIT_ERROR_MESSAGE[error.name]);
    }
    throw new Error("유저의 이메일을 수정하지 못했습니다.");
  }
};

/**
 * @description 유저 삭제
 *
 * @param email 유저 이메일
 */
export const removeUserFromCognito = async (email: string) => {
  const deleteParam = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    Username: email,
  };

  try {
    const command = new AdminDeleteUserCommand(deleteParam);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      throw new Error(CONFIRM_ERROR_MESSAGE[error.name]);
    }
    throw new Error("해당 유저를 삭제하기 못했습니다.");
  }
};
