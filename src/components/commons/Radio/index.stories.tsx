import { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";

import Radio from ".";

const meta = {
  title: "Web Components/Radio",
  component: Radio,
  subcomponents: {
    Label: Radio.Label,
    Indicator: Radio.Indicator,
    Item: Radio.Item,
  },
  tags: ["autodocs"],
} as Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    function RadioExampleForm() {
      const methods = useForm({
        defaultValues: {
          seatStatus: "AVAILABLE",
        },
      });

      const onSubmit = (data: unknown) => {
        // eslint-disable-next-line no-console
        console.log("Form Data:", data);
      };

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Radio className="flex gap-32">
              <Radio.Label className="mb-24">좌석 편집</Radio.Label>

              <Radio.Item value="AVAILABLE" name="seatStatus">
                예약 가능
              </Radio.Item>
              <Radio.Item value="RESERVED" name="seatStatus">
                고정 좌석
              </Radio.Item>
              <Radio.Item value="UNAVAILABLE" name="seatStatus">
                사용 불가
              </Radio.Item>
              <Radio.Item value="DISABLED" name="seatStatus" disabled>
                비활성화
              </Radio.Item>
            </Radio>

            <button type="submit" className="mt-24">
              선택된 데이터 콘솔에 출력하기
            </button>
          </form>
        </FormProvider>
      );
    }
    return <RadioExampleForm />;
  },
};
