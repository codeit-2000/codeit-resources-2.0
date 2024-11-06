import Button from "@/components/commons/Button";
import Drawer from "@/components/commons/Drawer";
import Radio from "@/components/commons/Radio";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { useDrawerContext } from "../context/drawer";
import useSeatsAction from "../hooks/useSeatsAction";
import { FormValue } from "../types";
import UserSelect from "./UserSelect";

export default function EditDrawer() {
  const { isOpen, setIsOpen, seatInfo, setSeatInfo } = useDrawerContext();

  const { editMutation } = useSeatsAction();

  const methods = useForm<FormValue>({
    defaultValues: {
      seatStatus: seatInfo?.status ?? "enable",
    },
  });

  const selectedSeatStatus = useWatch({
    control: methods.control,
    name: "seatStatus",
  });

  const onSubmit = (data: FormValue) => {
    editMutation.mutate(data);
  };

  useEffect(() => {
    if (!seatInfo?.status) return;

    if (seatInfo.status === "fixed") {
      methods.reset({
        seatStatus: "fixed",
        participant: seatInfo.participant,
      });
    } else {
      methods.reset({
        seatStatus: seatInfo.status,
      });
    }
  }, [seatInfo, methods]);

  useEffect(() => {
    if (selectedSeatStatus === "fixed") {
      methods.setValue("participant", undefined);
    } else {
      methods.unregister("participant");
    }
  }, [selectedSeatStatus, methods]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Drawer
        onClose={() => {
          setIsOpen(false);
          setSeatInfo(null);
        }}
      >
        <div className="mt-32 w-full">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Radio className="flex justify-between">
                <Radio.Label className="mb-24 text-28-700">
                  좌석 편집
                </Radio.Label>

                <Radio.Item
                  value="enable"
                  name="seatStatus"
                  className="select-none"
                >
                  예약 가능
                </Radio.Item>
                <Radio.Item
                  value="fixed"
                  name="seatStatus"
                  className="select-none"
                >
                  고정 좌석
                </Radio.Item>
                <Radio.Item
                  value="disabled"
                  name="seatStatus"
                  className="select-none"
                >
                  사용 불가
                </Radio.Item>
              </Radio>

              {selectedSeatStatus === "fixed" && (
                <Suspense fallback={<UserSelect.Skeleton />}>
                  <UserSelect />
                </Suspense>
              )}

              <div className="fixed bottom-40 w-[90%]">
                <Button type="submit">
                  {editMutation.isPending ? (
                    <LoadingSpinner height={27} width="100%" />
                  ) : (
                    "저장하기"
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Drawer>
    </AnimatePresence>
  );
}
