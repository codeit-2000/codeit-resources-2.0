import ProfileImage from "@/components/commons/ProfileImage";
import useClickOutside from "@/hooks/useClickOutside";
import { getUserListData } from "@/lib/api/amplify/user";
import ArrowDown from "@public/icons/icon-arrow-down.svg";
import SearchIcon from "@public/icons/icon-search.svg";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useDrawerContext } from "../context/drawer";

export default function UserSelect() {
  const { seatInfo } = useDrawerContext();
  const { setValue, register, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selecetRef = useRef<HTMLDivElement>(null);
  const selectedParticipant = watch("participant");

  useClickOutside({
    ref: selecetRef,
    handler: () => {
      setIsOpen(false);
    },
  });

  const { data: usersResponse } = useQuery({
    // 전체, 가나다순 정렬
    queryKey: ["memberList", 0, "alphabetical"],
    queryFn: () => getUserListData("0", "alphabetical"),
    staleTime: 10 * 60 * 1000, // 10분
  });

  const handleSelect = (id: string) => {
    setValue("participant", id, { shouldValidate: true });
    setIsOpen(false);
  };

  const filteredUsers = useMemo(() => {
    if (!usersResponse) return [];

    return usersResponse.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [usersResponse, searchQuery]);

  useEffect(() => {
    if (seatInfo?.participant) setValue("participant", seatInfo.participant);
  }, [seatInfo, setValue]);

  useEffect(() => {
    setSearchQuery("");
  }, [isOpen]);

  return (
    <div className="relative mt-32 w-full" ref={selecetRef}>
      <span className="absolute left-15 top-[-9px] bg-white px-4 text-13 text-gray-100-opacity-80 group-hover:text-purple-70">
        참여자
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group mb-10 flex h-56 w-full items-center justify-between rounded-8 border border-gray-100-opacity-20 px-20 py-14 text-left text-16 outline-none hover:border-purple-70"
      >
        <span
          className={clsx({ "text-gray-100-opacity-50": !selectedParticipant })}
        >
          {selectedParticipant
            ? usersResponse?.find((user) => user.id === selectedParticipant)
                ?.username || "참여자를 선택해주세요"
            : "참여자를 선택해주세요"}
        </span>
        <ArrowDown
          className={clsx(
            "ml-8 w-12 flex-shrink-0 transition-transform duration-300",
            {
              "rotate-180": isOpen,
            },
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-3 flex max-h-300 w-full flex-col gap-3 overflow-y-auto rounded-8 border border-gray-20 bg-gray-5 p-8 shadow-dropdown-wrapper">
          <div className="relative">
            <SearchIcon className="absolute left-10 top-12" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2 h-40 w-full rounded-8 border border-gray-30 bg-gray-10 pl-30 pr-2 text-16-400 outline-none"
              placeholder="이름으로 검색"
            />
          </div>

          {filteredUsers.map((user) => (
            <button
              type="button"
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className={clsx(
                "flex items-center gap-8 rounded-8 px-12 py-6 text-15-500",
                {
                  "bg-purple-opacity-10 text-purple-80":
                    user.id === selectedParticipant,
                  "text-gray-100-opacity-80 hover:bg-purple-opacity-5 hover:text-purple-80":
                    user.id !== selectedParticipant,
                },
              )}
            >
              <ProfileImage
                imagePath={user.profileImage ?? undefined}
                size="sm"
              />
              {user.username}
            </button>
          ))}
        </div>
      )}

      {/* Register participant field to hook-form */}
      <input
        type="hidden"
        {...register("participant", { required: "멤버를 선택해주세요" })}
      />
    </div>
  );
}

function UserSelectSkeleton() {
  return (
    <div className="relative mt-32 h-56 w-full overflow-hidden rounded-8 bg-gray-10">
      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-gray-20 to-transparent" />
    </div>
  );
}

UserSelect.Skeleton = UserSelectSkeleton;
