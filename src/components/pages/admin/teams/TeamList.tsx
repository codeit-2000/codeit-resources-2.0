import ListItem from "@/components/commons/ListItem";
import Popover from "@/components/commons/Popover";
import Skeleton from "@/components/commons/Skeleton";
import useModal from "@/hooks/useModal";
import { getTeamListData } from "@/lib/api/amplify/team";
import KebabIcon from "@public/icons/icon-kebab.svg";
import IconAlert from "@public/icons/icon-modal-alert.svg";
import { useQuery } from "@tanstack/react-query";

function TeamList() {
  const { openModal } = useModal();

  const { data, error, isLoading } = useQuery({
    queryKey: ["teamList"],
    queryFn: () => getTeamListData(),
    staleTime: 1 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="mt-40 flex flex-col gap-16 pb-80">
        {[1, 2, 3, 4, 5].map((item) => (
          <ListItem key={item}>
            <ListItem.Title>
              <Skeleton className="h-20 w-100 rounded" />
            </ListItem.Title>
          </ListItem>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-40 flex flex-col gap-16 pb-80">
        <div className="flex h-172 flex-col items-center justify-center gap-8 rounded-12 border bg-gray-15 text-18-400">
          <IconAlert />
          <span>데이터를 불러오지 못했습니다.</span>
          <span>다시 시도하거나 관리자에게 문의하세요.</span>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="mt-40 flex flex-col gap-16 pb-150 md:pb-80">
        {data.length ? (
          <>
            {data.map((item) => (
              <ListItem key={item.id} gap="gap-18 md:gap-32">
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Right>
                  <div className="flex cursor-pointer gap-8">
                    <Popover>
                      <Popover.Toggle
                        icon={
                          <KebabIcon className="h-40 w-40 rounded-full p-8 hover:bg-gray-100-opacity-5" />
                        }
                      />
                      <Popover.Wrapper>
                        <Popover.Item
                          label="이름 편집"
                          onClick={() => {
                            openModal("updateTeamModal", {
                              teamId: item.id,
                              teamName: item.name,
                            });
                          }}
                        />
                        <Popover.Item
                          label="팀 삭제"
                          onClick={() => {
                            openModal("deleteTeamModal", {
                              teamId: item.id,
                              teamName: item.name,
                            });
                          }}
                        />
                      </Popover.Wrapper>
                    </Popover>
                  </div>
                </ListItem.Right>
              </ListItem>
            ))}
          </>
        ) : (
          <div className="flex h-172 flex-col items-center justify-center gap-8 rounded-12 border bg-gray-15 text-16-400 text-gray-100">
            <span>생성된 팀이 없습니다.</span>
            <span>
              상단에 있는 &quot;팀 추가&quot; 버튼을 눌러 팀을 생성해주세요!
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default TeamList;
