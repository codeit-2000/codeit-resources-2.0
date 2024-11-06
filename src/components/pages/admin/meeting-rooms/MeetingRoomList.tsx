import ListItem from "@/components/commons/ListItem";
import Popover from "@/components/commons/Popover";
import useToast from "@/hooks/useToast";
import {
  createResource,
  deleteResource,
  updateResourceName,
} from "@/lib/api/amplify/resource";
import ArrowDown from "@public/icons/icon-arrow-down.svg";
import IconKebab from "@public/icons/icon-kebab.svg";
import IconPlus from "@public/icons/icon-plus.svg";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Resource {
  id: string;
  name: string;
  resourceSubtype?: string | null;
}

export default function MeetingRoomList({
  title,
  items,
}: {
  title: string;
  items: Resource[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [listItems, setListItems] = useState(items); // 임시 항목 추가용 상태
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  useEffect(() => {
    setListItems(items);
    return () => {
      setListItems([]); // 상태 정리
      setEditId(null);
      setEditName("");
    };
  }, [items]);

  // 편집 모드로 진입 시 포커스 설정
  useEffect(() => {
    if (editId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  // 항목 추가 (임시 아이템 추가 후 편집 모드로 전환)
  const handleAddItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`, // 고유한 임시 ID 생성
      name: "",
      resourceSubtype: title,
    };
    setListItems((prevItems) => [...prevItems, newItem]);
    setEditId(newItem.id); // 추가한 아이템을 편집 모드로 설정
    setEditName(""); // 새로운 아이템을 위한 빈 문자열
    setIsExpanded(true); // 목록 확장
  };

  // 새로운 항목 저장 및 생성 API 호출
  const handleSaveNewItem = async (id: string, name: string) => {
    if (!name.trim()) {
      handleCancelEdit(id); // 이름이 비어있다면 취소
      return;
    }

    // 이미 존재하는 이름인지 확인
    const isDuplicate = listItems.some(
      (item) => item.name.trim() === name.trim(),
    );

    if (isDuplicate) {
      error("이미 존재하는 이름입니다. 다른 이름을 사용해 주세요.");
      handleCancelEdit(id); // 중복된 경우 생성 취소
      return;
    }

    try {
      const newResource = await createResource({
        resourceType: "ROOM",
        resourceSubtype: title,
        name,
      });

      const newResourceData = newResource.data;

      if (newResourceData) {
        setListItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.id === id
              ? { ...item, id: newResourceData.id, name: newResourceData.name }
              : item,
          );
          return updatedItems.sort((a, b) => a.name.localeCompare(b.name)); // 정렬
        });
        success(`회의실 ${newResourceData.name}이(가) 추가되었습니다.`);
        setEditId(null); // 편집 모드 종료
        queryClient.invalidateQueries({ queryKey: ["roomList"] }); // 쿼리 무효화
      }
    } catch (err) {
      error("새로운 회의실 추가에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 기존 항목 이름 업데이트 API 호출
  const handleUpdateName = async (id: string, name: string) => {
    const previousName = listItems.find((item) => item.id === id)?.name;

    // 이름이 비어있거나 이전 값과 같으면 아무 동작도 하지 않음
    if (!name.trim() || name === previousName) {
      setEditId(null);
      setEditName("");
      return;
    }

    // 다른 항목에서 이미 존재하는 이름인지 확인
    const isDuplicate = listItems.some(
      (item) => item.id !== id && item.name.trim() === name.trim(),
    );

    if (isDuplicate) {
      error("이미 존재하는 이름입니다. 다른 이름을 사용해 주세요.");
      setEditId(null);
      setEditName("");
      return;
    }

    try {
      await updateResourceName({ id, name });
      setListItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, name } : item)),
      );
      success("회의실 이름이 성공적으로 변경되었습니다.");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["roomList"] });
    } catch (err) {
      error("이름 변경에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 항목 삭제
  const handleDeleteItem = async (id: string, name: string) => {
    try {
      await deleteResource(id);
      setListItems((prevItems) => prevItems.filter((item) => item.id !== id));
      success(`회의실 ${name}이(가) 성공적으로 삭제되었습니다.`);
      queryClient.invalidateQueries({ queryKey: ["roomList"] });
    } catch (err) {
      error(`회의실 ${name} 삭제를 실패했습니다. 다시 시도해 주세요.`);
    }
  };

  // 키 이벤트 처리 (Enter 키와 ESC 키로 저장 또는 취소)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    currentTitle: string,
  ) => {
    if (e.key === "Enter") {
      if (id.startsWith("temp-")) {
        handleSaveNewItem(id, currentTitle);
      } else {
        handleUpdateName(id, currentTitle);
      }
    } else if (e.key === "Escape") {
      // ESC 키 눌렀을 때 임시 항목이면 삭제
      if (id.startsWith("temp-")) {
        handleCancelEdit(id);
      } else {
        setEditId(null);
        setEditName("");
      }
    }
  };

  // 편집 모드 전환 함수
  const toggleEditMode = (id: string, currentName: string) => {
    setEditId(id);
    setEditName(currentName);
  };

  const handleCancelEdit = (id: string) => {
    setListItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setEditId(null);
    setEditName("");
  };

  return (
    <div>
      <ListItem isBackground>
        <ListItem.Title text="text-18-500">{title}</ListItem.Title>
        <ListItem.Right>
          <div className="flex gap-16">
            <button onClick={handleAddItem} type="button">
              <IconPlus />
            </button>
            <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
              <ArrowDown />
            </button>
          </div>
        </ListItem.Right>
      </ListItem>

      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            className="ml-24 mt-8 flex flex-col gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {listItems.map((item) => (
              <motion.li key={item.id} layout>
                <ListItem isEditMode={editId === item.id} height="h-56">
                  {editId === item.id ? (
                    <input
                      type="text"
                      ref={inputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, editName)}
                      onBlur={() => {
                        const currentName = listItems.find(
                          (resourceItem) => resourceItem.id === editId,
                        )?.name;

                        // editName이 비어있거나 이전 값과 동일하다면 삭제
                        if (
                          !editName.trim() ||
                          editName.trim() === currentName
                        ) {
                          if (editId && editId.startsWith("temp-")) {
                            handleCancelEdit(editId); // 새로 추가된 항목 삭제
                          } else {
                            setEditId(null);
                            setEditName("");
                          }
                          return;
                        }

                        // 입력된 경우 API 호출 후 상태 초기화
                        if (editId && editId.startsWith("temp-")) {
                          handleSaveNewItem(editId, editName);
                        } else if (editId) {
                          handleUpdateName(editId, editName);
                        }

                        setEditId(null);
                        setEditName("");
                      }}
                      className="w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-70 focus:ring-opacity-50"
                    />
                  ) : (
                    <ListItem.Title>{item.name}</ListItem.Title>
                  )}
                  <ListItem.Right>
                    <Popover>
                      <Popover.Toggle icon={<IconKebab />} />
                      <Popover.Wrapper>
                        <Popover.Item
                          label="이름 편집"
                          onClick={() => toggleEditMode(item.id, item.name)}
                        />
                        <Popover.Item
                          label="항목 삭제"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                        />
                      </Popover.Wrapper>
                    </Popover>
                  </ListItem.Right>
                </ListItem>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
