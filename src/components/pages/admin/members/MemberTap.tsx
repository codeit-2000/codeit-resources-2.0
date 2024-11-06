import Dropdown from "@/components/commons/Dropdown";
import Tab from "@/components/commons/Tab";
import { ORDER_OPTIONS } from "@/constants/dropdownConstants";
import { Team } from "@/lib/api/amplify/helper";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useMemo } from "react";

const BASE_TAB_DATA = [
  { id: "0", name: "전체" },
  { id: "1", name: "멤버" },
  { id: "2", name: "어드민" },
];

interface MemberTapProps {
  tapData: Team[];
  isLoading: boolean;
}

function MemberTap({ tapData, isLoading }: MemberTapProps) {
  const router = useRouter();
  const { query } = router;

  // URL 파라미터에서 카테고리 id와 order 값을 가져오기
  const categoryId = query.category || "0";
  const orderBy = query.order || "latest";

  // 탭 데이터
  const TAB_DATA = useMemo(
    () => (isLoading ? BASE_TAB_DATA : [...BASE_TAB_DATA, ...tapData]),
    [tapData, isLoading],
  );

  // 탭 클릭 시 URL 파라미터 업데이트
  const handleTabClick = (newId: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, category: newId },
    });
  };

  // 드롭다운 선택 시 order 파라미터 업데이트
  const handleOrderChange = (newOrder: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, order: newOrder },
    });
  };

  return (
    <div className="flex justify-between">
      <div className="w-[calc(100%-85px)] border-b border-gray-40">
        <Tab defaultIndex={categoryId as string}>
          {({ handleClick }) =>
            TAB_DATA.map(({ id, name }) => (
              <button
                type="button"
                role="tab"
                key={id}
                onClick={() => {
                  const handleCombinedClick = () => {
                    handleClick(id);
                    handleTabClick(id);
                  };
                  handleCombinedClick();
                }}
                className={clsx("rounded-t-6 px-16 pt-6 text-16-700", {
                  "border-b-2 border-gray-100-opacity-80 bg-gray-20 pb-6 text-gray-100-opacity-80":
                    id === categoryId,
                  "pb-8 text-gray-100-opacity-50 hover:bg-gray-100-opacity-5":
                    id !== categoryId,
                })}
              >
                {name}
              </button>
            ))
          }
        </Tab>
      </div>
      <div className="flex items-center">
        <Dropdown
          variant="order"
          value={orderBy as string}
          onChange={(newValue) => {
            handleOrderChange(newValue);
          }}
        >
          <Dropdown.Toggle />
          <Dropdown.Wrapper>
            {Object.entries(ORDER_OPTIONS).map(
              ([itemValue, label]): JSX.Element => (
                <Dropdown.Item
                  key={`dropdown_item_${itemValue}`}
                  itemValue={itemValue}
                  label={label}
                />
              ),
            )}
          </Dropdown.Wrapper>
        </Dropdown>
      </div>
    </div>
  );
}

export default MemberTap;
