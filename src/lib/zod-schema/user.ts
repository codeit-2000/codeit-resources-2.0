/* eslint-disable no-useless-escape */
import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "이메일은 필수 입력입니다.")
  .email("이메일 형식으로 작성해 주세요.");
// .refine((email) => email.endsWith("@codeit.kr"), {
//   message: "이메일 도메인은 @codeit.kr 이어야 합니다.",
// }),

const passwordSchema = z
  .string()
  .min(1, "비밀번호는 필수 입력입니다.")
  .min(8, "비밀번호는 최소 8자 이상입니다.")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~^$*\s]/,
    "비밀번호는 최소 1개 이상의 특수문자를 포함해야 합니다.",
  )
  .regex(/[a-z]/, "비밀번호는 최소 1개 이상의 소문자를 포함해야 합니다.")
  .regex(/\d/, "비밀번호는 최소 1개 이상의 숫자를 포함해야 합니다.");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호는 필수 입력입니다."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "비밀번호 확인은 필수 입력입니다."),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "새 비밀번호는 현재 비밀번호와 같을 수 없습니다.",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호 확인이 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
  });

const memberSchema = z.object({
  role: z.enum(["MEMBER", "ADMIN"]),
  username: z
    .string()
    .min(1, "멤버 이름은 필수 입력입니다.")
    .max(10, "멤버 이름은 최대 10자 이하입니다."),
  email: emailSchema,
});

const findPasswordSchema = z
  .object({
    code: z.string(),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
  });

export type TeamInput = {
  username: string;
  email: string;
  teams: string[];
  role: "MEMBER" | "ADMIN";
  image: File | string | null;
};

export {
  emailSchema,
  passwordSchema,
  loginSchema,
  passwordChangeSchema,
  memberSchema,
  findPasswordSchema,
};
