import Badge from "@/components/commons/Badge";
import Button from "@/components/commons/Button";
import ProfileImage from "@/components/commons/ProfileImage";
import useIsMobile from "@/hooks/useIsMobile";
import useToast from "@/hooks/useToast";
import { User, client } from "@/lib/api/amplify/helper";
import { getTeamListData } from "@/lib/api/amplify/team";
import { updateUserData } from "@/lib/api/amplify/user";
import { uploadImage } from "@/lib/api/storage";
import { userAtom } from "@/store/authUserAtom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import MobileProfileSectionSkeleton from "./MobileProfileSectionSkeleton";
import ProfileSectionSkeleton from "./ProfileSectionSkeleton";

export default function ProfileSection() {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const isMobile = useIsMobile();

  const fetchUser = async () => {
    if (!user?.id) return null;
    const userResponse = await client.models.User.get({ id: user.id });
    return userResponse?.data || null;
  };

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: fetchUser,
    enabled: Boolean(user),
  });

  const { data: teamData, isLoading: isTeamLoading } = useQuery({
    queryKey: ["teamList"],
    queryFn: () => getTeamListData(),
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  if (isUserLoading && isTeamLoading) {
    if (isMobile) {
      return <MobileProfileSectionSkeleton />;
    }
    return <ProfileSectionSkeleton />;
  }

  const teamBadges = userData?.teams
    ?.map((teamId) => {
      const team = teamData?.find((teamItem) => teamItem.id === teamId);
      return team ? (
        <Badge key={teamId} variant="secondarySmall">
          {team.name}
        </Badge>
      ) : null;
    })
    .filter(Boolean);

  return (
    <section>
      <h2 className="text-24-700 text-gray-100">
        {isMobile ? "설정" : "내 프로필"}
      </h2>
      <hr className="mt-10 hidden md:block" />
      <div className="mt-20 flex flex-col gap-10">
        {isMobile ? (
          <>
            <div className="flex items-center gap-10">
              {userData && (
                <ProfileImage
                  size="lg"
                  imagePath={user?.profileImage ?? undefined}
                />
              )}
              <ProfileImageUploader />
            </div>
            <div className="flex flex-col gap-5 rounded-8 border bg-gray-10 px-16 py-12">
              <div className="flex items-center">
                <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
                  이름
                </span>
                <span className="ml-30 mr-5 inline-block text-16-400 text-gray-100">
                  {userData?.username || ""}
                </span>
                {userData?.role === "ADMIN" ? (
                  <Badge variant="primary">{userData?.role}</Badge>
                ) : null}
              </div>
              <div className="flex items-center">
                <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
                  이메일
                </span>
                <span className="ml-30 inline-block text-16-400 text-gray-100">
                  {userData?.email || ""}
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
                  팀
                </span>
                <span className="ml-30 inline-block text-16-400 text-gray-100">
                  <div className="flex gap-3">{teamBadges}</div>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <span className="inline-block w-50 text-17-700 text-gray-100">
                이름
              </span>
              <span className="ml-30 mr-5 inline-block text-16-400 text-gray-100">
                {userData?.username || ""}
              </span>
              {userData?.role === "ADMIN" ? (
                <Badge variant="primary">{userData?.role}</Badge>
              ) : null}
            </div>
            <div className="flex items-center">
              <span className="inline-block w-50 text-17-700 text-gray-100">
                이메일
              </span>
              <span className="ml-30 inline-block text-16-400 text-gray-100">
                {userData?.email || ""}
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-50 text-17-700 text-gray-100">
                팀
              </span>
              <span className="ml-30 inline-block text-16-400 text-gray-100">
                <div className="flex gap-3">{teamBadges}</div>
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-50 text-17-700 text-gray-100">
                사진
              </span>
              <div className="ml-30 flex items-center gap-10">
                {userData && (
                  <ProfileImage
                    size="lg"
                    imagePath={user?.profileImage ?? undefined}
                  />
                )}
                <ProfileImageUploader />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProfileImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useAtom(userAtom);
  const { success, error } = useToast();

  const [errorMessage, setErrorMessage] = useState("");

  const uploadImageMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      if (!user) return null;

      const imagePath = await uploadImage({
        id: user.id,
        image: selectedFile,
      });

      return imagePath;
    },
    onSuccess: async (imagePath) => {
      if (!imagePath) return;
      setUser((prev) => ({ ...prev, profileImage: imagePath }) as User);
      await updateUserData({ id: user?.id as string, profileImage: imagePath });
      success("사진이 수정되었습니다");
    },
    onError: () => {
      error("사진 수정이 실패하였습니다");
    },
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
      inputRef.current!.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("이미지는 10MB 이하여야 합니다.");
      inputRef.current!.value = "";
      return;
    }

    setErrorMessage("");
    uploadImageMutation.mutate(selectedFile);
  };

  return (
    <div className="flex items-center gap-16">
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="h-34 w-76">
        <Button variant="secondary" size="small" onClick={handleClick}>
          사진 변경
        </Button>
      </div>
      {errorMessage && (
        <p className="text-13-500 text-status-negative">※{errorMessage}</p>
      )}
    </div>
  );
}
