import React from 'react'
import { useFormContext } from 'react-hook-form'
import { type SignUpFormValues } from './signUp.schema'
import { TechStackSelector } from '@/components/shared/TechStackSelector'

export const TechStackField: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignUpFormValues>()

  const currentStacks = watch('techStacks')

  return (
    <div className="grid gap-1.5 text-left">
      <TechStackSelector
        selectedStacks={currentStacks}
        onAdd={(stack) => {
          const next = [...currentStacks, stack]
          setValue('techStacks', next, { shouldValidate: true })
        }}
        onRemove={(tech) => {
          const next = currentStacks.filter((t) => t !== tech)
          setValue('techStacks', next, { shouldValidate: true })
        }}
        error={errors.techStacks?.message}
      />
    </div>
  )
}
