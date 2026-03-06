import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type SignUpFormValues } from './signUp.schema'

const FRAMEWORKS = [
  'React',
  'Next.js',
  'TypeScript',
  'Vue',
  'Svelte',
  'Node.js',
  'Spring',
  'Java',
  'Python',
  'Django',
  'Go',
  'NestJS',
  'Express',
  'Flutter',
  'React Native',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Kubernetes',
  'Firebase',
  'Figma',
  'Git',
  'Tailwind',
]

export const TechStackField: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignUpFormValues>()
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const currentStacks = watch('techStacks')

  const handleAddStack = (framework: string) => {
    if (currentStacks.length >= 8) return

    if (!currentStacks.includes(framework)) {
      const nextStacks = [...currentStacks, framework]
      setValue('techStacks', nextStacks, { shouldValidate: true })
      if (nextStacks.length === 8) {
        setOpen(false)
      }
    }
    setSearchQuery('')
  }

  return (
    <div className="grid gap-1.5 text-left">
      <div className="space-between mb-1.5 flex items-center gap-2 px-1">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
          기술 스택
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            ({currentStacks.length} / 8)
          </span>
          {currentStacks.length >= 8 && (
            <span className="animate-in fade-in slide-in-from-right-1 text-[11px] leading-none font-bold text-red-500 duration-300">
              최대 8개까지 선택 가능합니다
            </span>
          )}
        </div>
      </div>
      <div
        className={`relative flex min-h-[56px] flex-wrap items-center gap-2 rounded-lg border p-3 pr-20 transition-all ${
          errors.techStacks
            ? 'border-red-500'
            : 'border-slate-200 dark:border-slate-700 dark:bg-slate-800/50'
        }`}
      >
        {currentStacks.length === 0 && (
          <span
            className={`ml-1 text-xs ${errors.techStacks ? 'text-red-500' : 'text-slate-400'}`}
          >
            {errors.techStacks
              ? errors.techStacks.message
              : '당신의 전문 분야를 선택해주세요.'}
          </span>
        )}

        {currentStacks.map((tech) => (
          <span
            key={tech}
            className="animate-in zoom-in inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-white duration-300"
          >
            {tech}
            <X
              size={12}
              className="cursor-pointer hover:text-red-400"
              onClick={() => {
                const next = currentStacks.filter((t) => t !== tech)
                setValue('techStacks', next, { shouldValidate: true })
              }}
            />
          </span>
        ))}

        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentStacks.length >= 8}
                className="h-8 text-xs font-bold text-slate-500 disabled:opacity-30"
              >
                <PlusCircle size={14} className="mr-1" />
                추가
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[200px] p-0"
              align="end"
              side="top"
              sideOffset={10}
            >
              <Command>
                <CommandInput
                  placeholder="기술 검색..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="h-[200px] overflow-y-auto">
                  <CommandEmpty>결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {FRAMEWORKS.filter((f) => !currentStacks.includes(f)).map(
                      (framework) => (
                        <CommandItem
                          key={framework}
                          onSelect={() => handleAddStack(framework)}
                        >
                          {framework}
                        </CommandItem>
                      )
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
