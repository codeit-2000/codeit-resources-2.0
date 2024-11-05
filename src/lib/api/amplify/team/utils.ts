import { deleteTeamData } from ".";
import { client } from "../helper";
import { updateUserData } from "../user";

/**
 * @description 팀 삭제하면서, 해당 팀에 소속된 유저의 teams 배열 업데이트
 *
 * @param teamId 삭제할 팀id
 */
export const deleteTeamAndUpdateUsers = async (teamId: string) => {
  // 1. User 모델에서 teams 배열에 teamId가 포함된 모든 사용자 가져오기
  const usersWithTeam = await client.models.User.list({
    filter: { teams: { contains: teamId } },
  });

  // 2. 각 사용자의 teams 배열에서 teamIdToDelete를 제거하고 업데이트
  const updatePromises = usersWithTeam.data.map(async (user) => {
    const updatedTeams = user.teams
      ? user.teams.filter((id): id is string => id !== teamId && id !== null)
      : [];

    if (updatedTeams.length !== user.teams?.length) {
      return updateUserData({
        id: user.id,
        teams: updatedTeams,
      });
    }
    return Promise.resolve();
  });

  // 모든 업데이트 작업이 완료될 때까지 대기
  await Promise.all(updatePromises);

  // 3. 팀 삭제 수행
  const result = await deleteTeamData(teamId);
  return result;
};
