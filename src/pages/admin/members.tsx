import Button from "@/components/commons/Button";
import Drawer from "@/components/commons/Drawer";
import MemberAddDrawer from "@/components/pages/admin/members/MemberAddDrawer";
import MemberList from "@/components/pages/admin/members/MemberList";
import MemberTap from "@/components/pages/admin/members/MemberTap";
import { Team } from "@/lib/api/amplify/helper";
import { getTeamListData } from "@/lib/api/amplify/team";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function AdminMemberPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery<Team[]>({
    queryKey: ["teamList"],
    queryFn: () => getTeamListData(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="h-full min-h-screen bg-gray-5 px-25 pb-150 pt-64 md:px-88 md:pb-100 md:pt-80 lg:px-118">
      <div className="flex items-center justify-between">
        <h1 className="text-24-700 text-gray-100 md:text-28-700">멤버 관리</h1>
        <Button
          onClick={() => {
            setOpenKey("addMember");
          }}
          variant="secondary"
          width="w-125"
          height="h-42"
        >
          + 멤버 추가
        </Button>
      </div>
      <div className="mt-34">
        <MemberTap tapData={data ?? []} isLoading={isLoading} />
        <MemberList
          openKey={openKey}
          setOpenKey={setOpenKey}
          teamList={data ?? []}
        />
      </div>
      <AnimatePresence>
        {openKey === "addMember" && (
          <Drawer onClose={() => setOpenKey(null)}>
            <MemberAddDrawer setOpenKey={setOpenKey} teamList={data ?? []} />
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminMemberPage;
