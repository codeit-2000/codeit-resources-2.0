/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */
import Badge from "@/components/commons/Badge";
import Drawer from "@/components/commons/Drawer";
import ProfileImage from "@/components/commons/ProfileImage";
import Skeleton from "@/components/commons/Skeleton";
import { OrderType } from "@/constants/dropdownConstants";
import { Team } from "@/lib/api/amplify/helper";
import { getUserListData } from "@/lib/api/amplify/user";
import ChevronRight from "@public/icons/icon-chevron-right.svg";
import IconAlert from "@public/icons/icon-modal-alert.svg";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo } from "react";

import MemberEditDrawer from "./MemberEditDrawer";

interface MemberListProps {
  openKey: string | null;
  setOpenKey: (value: string | null) => void;
  teamList: Team[];
}

function MemberList({ openKey, setOpenKey, teamList }: MemberListProps) {
  const router = useRouter();
  const { query } = router;

  // URL 파라미터에서 카테고리 id와 order 값을 가져오기
  const categoryId = (query.category as string) || "0";
  const orderBy = (query.order as OrderType) || "latest";

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberList", categoryId, orderBy],
    queryFn: () => getUserListData(categoryId, orderBy),
    staleTime: 3 * 60 * 1000,
  });

  const teamMap = useMemo(
    () =>
      teamList.reduce(
        (acc, team) => {
          acc[team.id] = team.name;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [teamList],
  );

  useEffect(() => {
    setOpenKey(null);
  }, [categoryId, orderBy]);

  // 카테고리 업데이트 시 쿼리 파라미터 변경
  const handleCategoryChange = (newCategoryId: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, category: newCategoryId },
    });
  };

  // 정렬 업데이트 시 쿼리 파라미터 변경
  const handleOrderChange = (newOrder: OrderType) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, order: newOrder },
    });
  };

  if (isLoading) {
    return (
      <div className="mt-24 flex flex-col gap-16">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="rounded-12 border bg-gray-0 px-24 py-16">
            <div className="flex items-center gap-16">
              <ProfileImage size="sm" />
              <Skeleton className="h-20 w-44 rounded-6" />
              <Skeleton className="h-20 w-150 rounded-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-40 flex flex-col gap-16">
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
      <div className="mt-24 flex flex-col gap-16">
        {data.length ? (
          <>
            {data.map((item) => (
              <Fragment key={item.id}>
                <div
                  role="button"
                  onClick={() => setOpenKey(item.id)}
                  className="flex cursor-pointer items-center justify-between rounded-12 border bg-gray-0 px-24 py-16 duration-300 hover:bg-gray-10"
                >
                  <div className="flex flex-col gap-12 lg:flex-row lg:gap-0">
                    <div className="flex items-center gap-12 lg:gap-16">
                      <ProfileImage
                        imagePath={item.profileImage ?? undefined}
                        size="sm"
                      />
                      <span className="min-w-50 text-16-400 text-gray-100">
                        {item.username}
                      </span>
                      <span className="overflow-hidden truncate text-13-400 text-gray-100-opacity-60 lg:text-14-400">
                        {item.email}
                      </span>
                    </div>
                    <div className="hidden flex-wrap items-center gap-4 md:flex lg:ml-12">
                      {item.teams?.map((teamId: string | null) =>
                        teamId ? (
                          <Badge key={teamId} variant="secondarySmall">
                            {teamMap[teamId] || "Unknown Team"}
                          </Badge>
                        ) : null,
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex">
                    <ChevronRight />
                  </div>
                </div>
                <AnimatePresence>
                  {openKey === item.id && (
                    <Drawer onClose={() => setOpenKey(null)}>
                      <MemberEditDrawer
                        userData={item}
                        setOpenKey={setOpenKey}
                        teamList={teamList}
                      />
                    </Drawer>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </>
        ) : (
          <div className="flex h-172 flex-col items-center justify-center gap-8 rounded-12 border bg-gray-15 text-16-400 text-gray-100">
            <span>해당 조건에 알맞은 멤버가 없습니다.</span>
            <span>
              상단에 있는 &quot;멤버 추가&quot; 버튼을 눌러 멤버를 생성해주세요!
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default MemberList;
