import ProfileImage from "@/components/commons/ProfileImage";
import { adminAtom, userAtom } from "@/store/authUserAtom";
import CodeitTextLogo from "@public/images/codeit-resources.svg";
import CodeitLogo from "@public/images/codeit.svg";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";

import NAV_OPTION_LIST, { NavOptionProps } from "./NavOptionList";

interface NavBarOptionProps {
  navOption: NavOptionProps;
  mobileOnly?: boolean;
}

function NavBarOption({ navOption, mobileOnly = false }: NavBarOptionProps) {
  const router = useRouter();
  const isActive = router.pathname === navOption.path;

  return (
    <Link
      key={navOption.id}
      href={navOption.path}
      className={`flex w-full flex-col items-center py-8 hover:rounded-10 hover:bg-gray-00-opacity-5 md:w-auto md:flex-row md:gap-10 md:py-10 md:pl-16 ${
        mobileOnly ? "md:hidden" : ""
      }`}
    >
      <>
        {navOption.imgSrc({ color: isActive ? "#FFFFFF" : "#888893" })}
        <span
          className={`text-12-400 md:text-16-400 ${
            isActive ? "text-white" : "text-gray-00-opacity-60"
          }`}
        >
          {navOption.text}
        </span>
      </>
    </Link>
  );
}

function NavigationBar() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const isAdmin = useAtomValue(adminAtom);

  return (
    <nav className="fixed bottom-0 z-20 w-full min-w-[360px] max-w-[767px] bg-gray-100 p-16 md:bottom-auto md:h-screen md:w-[200px] md:min-w-0 md:max-w-none">
      <Link href="/" className="hidden items-center gap-8 pb-12 md:flex">
        <CodeitLogo width={26} height={26} />
        <CodeitTextLogo color="#fff" width={125} />
      </Link>
      <ul className="flex justify-evenly md:flex-col md:gap-10 md:border-t md:border-white md:border-opacity-10 md:pt-12">
        {NAV_OPTION_LIST.filter((navOption) => !navOption.requiresAdmin).map(
          (navOption) => (
            <NavBarOption
              key={navOption.id}
              navOption={navOption}
              mobileOnly={navOption.onlyMobile}
            />
          ),
        )}

        {/* 관리자 옵션 구분선 및 관리자 옵션 */}
        {isAdmin && (
          <section className="hidden md:block">
            <hr className="my-4 mb-12 border-t border-white border-opacity-10" />
            <span className="text-13-700 text-gray-00-opacity-30">
              어드민 기능
            </span>
            <ul className="flex flex-col justify-evenly gap-10 pt-12">
              {NAV_OPTION_LIST.filter(
                (navOption) => navOption.requiresAdmin,
              ).map((navOption) => (
                <NavBarOption key={navOption.id} navOption={navOption} />
              ))}
            </ul>
          </section>
        )}
      </ul>
      <Link
        href="/mypage"
        className={`absolute bottom-16 hidden w-142 items-center gap-10 rounded-10 p-8 hover:bg-gray-00-opacity-5 md:flex ${
          router.pathname === "/mypage"
            ? "text-white"
            : "text-gray-00-opacity-60"
        }`}
      >
        <ProfileImage size="sm" imagePath={user?.profileImage ?? undefined} />
        <span className="text-16-500">{user?.username}</span>
      </Link>
    </nav>
  );
}

export default NavigationBar;
