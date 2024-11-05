import clsx from "clsx";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RadioGroupProps {
  /** 그룹 전체에 추가적인 CSS 클래스를 적용합니다. */
  className?: string;
  /** 그룹에 포함될 라디오 항목들을 나타냅니다. */
  children: ReactNode;
}

/**
 * RadioGroup 컴포넌트
 * 여러 라디오 버튼으로 구성된 그룹을 나타내며, 하나의 옵션만 선택할 수 있도록 합니다.
 */
function RadioGroup({ className, children }: RadioGroupProps) {
  return <fieldset className={className}>{children}</fieldset>;
}

interface RadioGroupLabelProps {
  /** 그룹 전체에 추가적인 CSS 클래스를 적용합니다. */
  className?: string;
  /** 라디오 그룹에 대한 라벨로 사용될 내용을 지정합니다. */
  children: ReactNode;
}

/**
 * RadioGroupLabel 컴포넌트
 * 여러 라디오 버튼으로 구성된 그룹의 label을 legend 태그를 이용해 지정합니다.
 */
function RadioGroupLabel({ className, children }: RadioGroupLabelProps) {
  return (
    <legend className={clsx("mb-2 font-semibold text-gray-800", className)}>
      {children}
    </legend>
  );
}

interface RadioIndicatorProps {
  /** 라디오 버튼이 선택되었는지 여부를 나타냅니다. */
  isSelected: boolean;
}

/**
 * RadioIndicator 컴포넌트
 * 선택된 또는 선택되지 않은 라디오 버튼의 시각적 표시를 나타내는 요소입니다.
 */
function RadioIndicator({ isSelected }: RadioIndicatorProps) {
  return (
    <div
      className={clsx(
        "inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full",
        isSelected
          ? "border-none bg-purple-60 group-hover:bg-purple-70"
          : "ring-1 ring-inset ring-gray-100-opacity-20 group-hover:bg-gray-100-opacity-5",
      )}
    >
      {/* 내부 원 */}
      <div
        className={clsx(
          "h-8 w-8 rounded-full bg-gray-00-opacity-90",
          isSelected ? "block" : "hidden",
        )}
      />
    </div>
  );
}

interface RadioItemProps {
  /** 라디오 항목의 추가적인 CSS 클래스명을 지정합니다. */
  className?: string;
  /** - 라디오 항목의 내용을 나타냅니다. */
  children: ReactNode;
  /** 라디오 버튼의 값입니다. */
  value: string;
  /** 라디오 input의 name 속성으로, 라디오 버튼을 그룹화하는 데 사용됩니다. */
  name: string;
  /** 라디오 버튼이 비활성화되어 있는지 여부를 지정합니다. */
  disabled?: boolean;
}

/**
 * RadioItem 컴포넌트
 * 라디오 그룹 내의 개별 라디오 버튼을 나타냅니다. (React Hook Form과 통합)
 */
function RadioItem({
  className,
  children,
  value,
  name,
  disabled,
}: RadioItemProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label
          className={clsx(
            "flex items-center gap-8",
            disabled ? "cursor-not-allowed opacity-50" : "group cursor-pointer",
            className,
          )}
        >
          <input
            type="radio"
            disabled={disabled}
            className="hidden"
            checked={field.value === value}
            {...field}
            onChange={() => field.onChange(value)}
          />
          {/* 라디오 버튼 */}
          <RadioIndicator isSelected={field.value === value} />
          {/* label */}
          <span className="mt-2 text-16-500 text-gray-100-opacity-80 group-hover:text-16-700">
            {children}
          </span>
        </label>
      )}
    />
  );
}

const Radio = Object.assign(RadioGroup, {
  Label: RadioGroupLabel,
  Indicator: RadioIndicator,
  Item: RadioItem,
});

export default Radio;
