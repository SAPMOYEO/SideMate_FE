import * as z from 'zod'

export const signUpSchema = z
  .object({
    name: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(2, { message: '이름은 공백 제외 2자 이상 입력해 주세요.' })
      ),
    phone: z
      .string()
      .min(1, { message: '휴대폰 번호를 입력해 주세요.' })
      .regex(/^010-\d{3,4}-\d{4}$/, {
        message: '올바른 휴대폰 번호 형식이 아닙니다.',
      }),
    email: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z.string().min(1, { message: '이메일을 입력해 주세요.' }).email({
          message: '올바른 이메일 형식이 아닙니다. (example@email.com)',
        })
      ),
    password: z
      .string()
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(/[a-z]/, { message: '소문자를 포함해야 합니다.' })
      .regex(/[A-Z]/, { message: '대문자를 포함해야 합니다.' })
      .regex(/[0-9]/, { message: '숫자를 포함해야 합니다.' })
      .regex(/[^a-zA-Z0-9]/, { message: '특수문자를 포함해야 합니다.' })
      .refine((val) => !val.includes(' '), {
        message: '공백은 포함할 수 없습니다.',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해 주세요.' }),
    techStacks: z
      .array(z.string())
      .min(1, { message: '최소 1개 이상의 기술 스택을 선택해 주세요.' }),
    terms: z.object({
      service: z.boolean().refine((val) => val === true, {
        message: '서비스 이용약관 동의는 필수입니다.',
      }),
      privacy: z.boolean().refine((val) => val === true, {
        message: '개인정보 처리방침 동의는 필수입니다.',
      }),
      marketing: z.boolean(),
    }),
    gitUrl: z
      .string()
      .max(39, '최대 39자까지 입력 가능합니다.')
      .regex(
        /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
        'GitHub 아이디 형식이 올바르지 않습니다.'
      )
      .optional()
      .or(z.literal('')),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>
