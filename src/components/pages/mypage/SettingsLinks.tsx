import ChevronRight from "@public/icons/icon-chevron-right.svg";
import Link from "next/link";
import React from "react";

function SettingLinkItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={to}
      className="flex w-full items-center justify-between border-b px-8 py-16 text-16-500 text-gray-100"
      aria-label={`${children} 페이지로 이동`}
    >
      <span>{children}</span>
      <ChevronRight />
    </Link>
  );
}

export default function SettingsLinksSection() {
  return (
    <section className="flex flex-col md:hidden">
      <SettingLinkItem to="/admin/members">멤버 관리</SettingLinkItem>
      <SettingLinkItem to="/admin/teams">팀 관리</SettingLinkItem>
      <SettingLinkItem to="/admin/meeting-rooms">회의실 설정</SettingLinkItem>
      <SettingLinkItem to="/admin/seats">좌석 설정</SettingLinkItem>
    </section>
  );
}
