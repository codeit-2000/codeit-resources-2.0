/* eslint-disable no-console */
import Button from "@/components/commons/Button";
import Dropdown from "@/components/commons/Dropdown";
import MembersSelectDropdown from "@/components/commons/Dropdown/MultiSelectDropdown/MembersSelectDropdown";
import { Member } from "@/components/commons/Dropdown/dropdownType";
import Input from "@/components/commons/Input";
import TIME_SLOT from "@/constants/timeSlot";
import { Reservation } from "@/lib/api/amplify/helper";
import {
  generateTimeSlots,
  getAvailableTimeSlots,
  getCurrentTime,
} from "@/lib/utils/timeUtils";
import { userAtom } from "@/store/authUserAtom";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { todayDateAtom } from "@/store/todayDateAtom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import pickedDateAtom from "../context/pickedDate";
import pickedReservationAtom from "../context/pickedReservation";
import { useGetReservations } from "../hooks/useGetReservations";
import useReservationAction from "../hooks/useReservationAction";
import useReservationSchema from "../hooks/useReservationSchema";

const ALL_TIME_SLOT_ITEMS = generateTimeSlots();
const TIME_SLOT_ITEMS = getAvailableTimeSlots(TIME_SLOT, getCurrentTime());

interface CreateReservationData {
  title: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  participants: Member[];
}

type ReservationMember = Member & { email: string };

interface ReservationFormProps {
  actionType: "create" | "update";
  members: ReservationMember[];
  onSuccess?: () => void;
  initialValues?: {
    roomName: string | null;
    startTime: string;
    participants: string[];
  };
}

function ReservationForm({ members }: ReservationFormProps) {
  const currentUser = useAtomValue(userAtom);
  if (!currentUser) throw new Error("로그인 후 이용해주세요.");

  const isOpenDrawer = useAtomValue(isOpenDrawerAtom);
  const pickedDate = useAtomValue(pickedDateAtom);
  const today = useAtomValue(todayDateAtom);
  const timeSlotItems =
    today.format("YYYY-MM-DD") === pickedDate
      ? TIME_SLOT_ITEMS
      : ALL_TIME_SLOT_ITEMS;

  const { rooms } = useGetReservations();
  const roomList = rooms?.data || [];

  const [pickedReservation, setPickedReservation] = useAtom(
    pickedReservationAtom,
  );
  const { createRoomMutation, updateRoomMutation } = useReservationAction();
  const reservationSchema = useReservationSchema();

  const defaultReservation = useMemo(
    () => ({
      title: pickedReservation?.title || "",
      resourceId: pickedReservation?.resourceId || "",
      startTime: pickedReservation?.startTime || "",
      endTime: pickedReservation?.endTime || "",
      participants: pickedReservation?.participants?.length
        ? pickedReservation.participants
            .map((participantId) =>
              members.find((member) => member.id === participantId),
            )
            .filter(
              (member): member is ReservationMember => member !== undefined,
            )
        : members.filter((member) => member.id === currentUser.id),
    }),
    [pickedReservation, members, currentUser],
  );

  const methods = useForm<CreateReservationData>({
    defaultValues: defaultReservation,
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { handleSubmit, control, watch, reset, formState } = methods;

  const resourceId = watch("resourceId");
  const resource = roomList.find((room) => room.id === resourceId);
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const onSubmit = async (data: CreateReservationData) => {
    // pickedDate가 없을 경우 함수 실행 중단
    if (!pickedDate) {
      console.error("날짜를 선택해주세요.");
      return;
    }

    const formData = {
      ...data,
      participants: data.participants.map((participant) => participant.id),
      date: pickedDate, // pickedDate는 항상 string
      id: pickedReservation?.id,
    };

    try {
      if (pickedReservation?.id) {
        updateRoomMutation(formData as Reservation);
      } else {
        createRoomMutation(formData as Reservation);
      }
    } catch (error) {
      console.error("예약 처리 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (startTime && endTime && resourceId) {
      setPickedReservation((prev) => ({
        ...prev,
        startTime,
        endTime,
        resourceName: resource?.name || "",
        resourceSubtype: resource?.resourceSubtype || "",
        resourceId,
      }));
    }
  }, [startTime, endTime, resourceId, setPickedReservation]);

  useEffect(() => {
    if (!isOpenDrawer) {
      setPickedReservation(null);
    }
  }, [setPickedReservation, isOpenDrawer]);

  useEffect(() => {
    // 초기값 설정 또는 수정 모드로 진입할 때만 reset 실행
    // if (!methods.formState.isDirty) {
    // 폼이 수정되지 않은 상태일 때만
    reset(defaultReservation);
    // }
  }, [pickedReservation, members, currentUser?.id]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex h-full w-full flex-col gap-y-16 pb-32 pt-24 [&_input]:text-16-400"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="title"
          label="미팅 제목"
          register={methods.register("title", {
            required: "미팅 제목을 입력해주세요.",
          })}
        />

        <Controller
          name="resourceId"
          control={control}
          rules={{ required: "회의실을 선택해주세요." }}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <Dropdown
              variant="meetingRoom"
              value={pickedReservation?.resourceName || ""}
              onChange={(selectedId) => {
                onChange(selectedId);
              }}
            >
              <Dropdown.Toggle
                isError={!!error}
                errorMessage={error ? error.message : ""}
              />
              <Dropdown.Wrapper>
                {roomList?.map((room) => (
                  <Dropdown.Item
                    key={room.id}
                    itemValue={room.id}
                    label={room.name}
                  />
                ))}
              </Dropdown.Wrapper>
            </Dropdown>
          )}
        />

        <fieldset className="inline-flex gap-16 [&>div]:grow">
          <div className="w-1/2 [&_svg]:shrink-0">
            <Controller
              name="startTime"
              control={control}
              rules={{ required: "필수 입력" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Dropdown variant="startTime" value={value} onChange={onChange}>
                  <Dropdown.Toggle
                    isError={!!error}
                    errorMessage={error ? error.message : ""}
                  />
                  <Dropdown.Wrapper>
                    <Dropdown.ManualItem>직접 입력</Dropdown.ManualItem>
                    {timeSlotItems.map((item) => (
                      <Dropdown.Item key={item} itemValue={item} />
                    ))}
                  </Dropdown.Wrapper>
                </Dropdown>
              )}
            />
          </div>

          <div className="w-1/2 [&_svg]:shrink-0">
            <Controller
              name="endTime"
              control={control}
              rules={{ required: "필수 입력" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Dropdown variant="endTime" value={value} onChange={onChange}>
                  <Dropdown.Toggle
                    isError={!!error}
                    errorMessage={error ? error.message : ""}
                  />
                  <Dropdown.Wrapper>
                    <Dropdown.ManualItem>직접 입력</Dropdown.ManualItem>
                    {timeSlotItems.map((item) => (
                      <Dropdown.Item key={item} itemValue={item} />
                    ))}
                  </Dropdown.Wrapper>
                </Dropdown>
              )}
            />
          </div>
        </fieldset>

        <Controller
          name="participants"
          control={control}
          rules={{ required: "참여자를 선택해주세요." }}
          render={({ field: { value, onChange } }) => (
            <MembersSelectDropdown
              selectedMembers={value}
              onSelect={(member) => {
                onChange([...value, member]);
              }}
              onRemove={(member) => {
                onChange(value.filter((m) => m.id !== member.id));
              }}
              allMembers={members}
            />
          )}
        />

        <div className="mt-auto">
          <Button variant="primary" type="submit" disabled={!formState.isValid}>
            {pickedReservation?.id ? "예약 수정" : "예약하기"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default ReservationForm;
