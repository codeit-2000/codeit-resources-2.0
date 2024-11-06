import Button from "@/components/commons/Button";
import TeamList from "@/components/pages/admin/teams/TeamList";
import useModal from "@/hooks/useModal";

function AdminTeamPage() {
  const { openModal } = useModal();

  return (
    <div className="h-full bg-gray-5 px-25 pt-64 md:px-88 md:pt-80 lg:px-118">
      <div className="flex items-center justify-between">
        <h1 className="text-24-700 text-gray-100 md:text-28-700">팀 관리</h1>
        <Button
          onClick={() => {
            openModal("addTeamModal");
          }}
          variant="secondary"
          width="w-110"
          height="h-42"
        >
          + 팀 추가
        </Button>
      </div>
      <TeamList />
    </div>
  );
}

export default AdminTeamPage;
