import type { Meta, StoryObj } from "@storybook/react";
import { AnimatePresence, motion } from "framer-motion";
import { type ComponentType, useState } from "react";

import ListItem from ".";

const meta = {
  title: "Web Components/ListItem",
  component: ListItem,
  subcomponents: {
    Title: ListItem.Title as ComponentType,
    Right: ListItem.Right as ComponentType,
  },
  tags: ["autodocs"],
} as Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

// Team 목록
export const Primary: Story = {
  render: () => {
    function TitleEditMode() {
      const [isEditMode, setIsEditMode] = useState(false);
      const [title, setTitle] = useState("Design");

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          setIsEditMode(false);
        }
      };

      return (
        <div>
          <ListItem isEditMode={isEditMode}>
            <ListItem.Title
              isEditMode={isEditMode}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="팀 이름"
            >
              {title}
            </ListItem.Title>
            <ListItem.Right>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? "수정 중" : "⁝"}
              </button>
            </ListItem.Right>
          </ListItem>
        </div>
      );
    }
    return <TitleEditMode />;
  },
};

// 회의실 목록
export const Secondary: Story = {
  render: () => {
    function RoomListItem() {
      const [isExpanded, setIsExpanded] = useState(false);
      const [editId, setEditId] = useState<number | null>(null);
      const [title, setTitle] = useState("미팅룸");
      const [items, setItems] = useState([
        { title: "회의실1", id: 1 },
        { title: "회의실2", id: 2 },
      ]);

      // 회의실 추가
      const handleAddItem = () => {
        setItems((prevItems) => [
          ...prevItems,
          { title: `회의실${prevItems.length + 1}`, id: prevItems.length + 1 },
        ]);
      };

      const handleEdit = (id: number, newTitle: string) => {
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, title: newTitle } : item,
        );
        setItems(updatedItems);
      };

      const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: number,
        currentTitle: string,
      ) => {
        if (e.key === "Enter") {
          setEditId(null);
          handleEdit(id, currentTitle);
        }
      };

      const toggleEditMode = (id: number) => {
        setEditId(editId === id ? null : id);
      };

      return (
        <div>
          <ListItem isBackground isEditMode={editId === 0}>
            <ListItem.Title
              text="text-18-500"
              isEditMode={editId === 0}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 0, title)}
              placeholder="카테고리 명"
            >
              {title}
            </ListItem.Title>
            <ListItem.Right>
              <div className="flex gap-16">
                <button onClick={handleAddItem} type="button">
                  +
                </button>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => toggleEditMode(0)}
                >
                  {editId === 0 ? "수정 중" : "⁝"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  ▼
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
                {items.map((item) => (
                  <motion.li key={item.id} layout>
                    <ListItem isEditMode={editId === item.id} height="h-56">
                      <ListItem.Title
                        isEditMode={editId === item.id}
                        onChange={(e) => handleEdit(item.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, item.id, item.title)}
                        placeholder="회의실 명"
                      >
                        {item.title}
                      </ListItem.Title>
                      <ListItem.Right>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => toggleEditMode(item.id)}
                        >
                          {editId === item.id ? "수정 중" : "⁝"}
                        </button>
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
    return <RoomListItem />;
  },
};
