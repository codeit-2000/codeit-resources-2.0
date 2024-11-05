import Dashboard from "@public/icons/icon-dashboard.svg";
import Meeting from "@public/icons/icon-meeting.svg";
import Person from "@public/icons/icon-person.svg";
import Seats from "@public/icons/icon-seats.svg";
import Settings from "@public/icons/icon-settings.svg";
import Teams from "@public/icons/icon-team.svg";

export interface NavOptionProps {
  id: string;
  imgSrc: ({ color }: { color: string }) => JSX.Element;
  text: string;
  path: string;
  requiresAdmin: boolean;
  onlyMobile?: boolean;
}

const NAV_OPTION_LIST: NavOptionProps[] = [
  {
    id: "dashboard",
    imgSrc: ({ color }) => <Dashboard color={color} />,
    text: "대시보드",
    path: "/",
    requiresAdmin: false,
  },
  {
    id: "meeting-rooms",
    imgSrc: ({ color }) => <Meeting color={color} />,
    text: "회의실",
    path: "/meeting-rooms",
    requiresAdmin: false,
  },
  {
    id: "seats",
    imgSrc: ({ color }) => <Seats color={color} />,
    text: "좌석",
    path: "/seats",
    requiresAdmin: false,
  },
  {
    id: "settings",
    imgSrc: ({ color }) => <Settings color={color} />,
    text: "설정",
    path: "/mypage",
    requiresAdmin: false,
    onlyMobile: true,
  },
  {
    id: "admin-members",
    imgSrc: ({ color }) => <Person color={color} />,
    text: "멤버 관리",
    path: "/admin/members",
    requiresAdmin: true,
  },
  {
    id: "admin-teams",
    imgSrc: ({ color }) => <Teams color={color} />,
    text: "팀 관리",
    path: "/admin/teams",
    requiresAdmin: true,
  },
  {
    id: "admin-meeting-rooms",
    imgSrc: ({ color }) => <Meeting color={color} />,
    text: "회의실 설정",
    path: "/admin/meeting-rooms",
    requiresAdmin: true,
  },
  {
    id: "admin-seats",
    imgSrc: ({ color }) => <Seats color={color} />,
    text: "좌석 설정",
    path: "/admin/seats",
    requiresAdmin: true,
  },
];

export default NAV_OPTION_LIST;
