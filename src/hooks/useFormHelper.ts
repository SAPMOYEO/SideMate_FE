import {
  useFormContext,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form'

export const useFormHelper = <T extends FieldValues>() => {
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<T>()

  const handleInputChange = (
    fieldName: Path<T>,
    value: PathValue<T, Path<T>>
  ) => {
    setValue(fieldName, value, { shouldValidate: false })

    if (errors[fieldName]) {
      clearErrors(fieldName)
    }
  }

  return { handleInputChange }
}
