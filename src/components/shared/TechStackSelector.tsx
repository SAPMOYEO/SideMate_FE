import React, { useState } from 'react'
import { X, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FRAMEWORKS } from '@/constants/stack'

const StackSearchList: React.FC<{
  items: string[]
  selectedItems: string[]
  onSelect: (item: string) => void
}> = ({ items, selectedItems, onSelect }) => (
  <CommandList className="custom-scrollbar h-[200px] overflow-x-hidden overflow-y-auto">
    <CommandEmpty className="py-6 text-center text-sm text-slate-500">
      결과가 없습니다.
    </CommandEmpty>
    <CommandGroup>
      {items
        .filter((item) => !selectedItems.includes(item))
        .map((item) => (
          <CommandItem
            key={item}
            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            onSelect={() => onSelect(item)}
          >
            {item}
          </CommandItem>
        ))}
    </CommandGroup>
  </CommandList>
)

interface TechStackSelectorProps {
  selectedStacks: string[]
  onAdd: (stack: string) => void
  onRemove: (stack: string) => void
  maxCount?: number
  error?: string
}

export const TechStackSelector: React.FC<TechStackSelectorProps> = ({
  selectedStacks,
  onAdd,
  onRemove,
  maxCount = 8,
  error,
}) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  const shouldShowError = !!error || (isTouched && selectedStacks.length === 0)

  const handleSelect = (stack: string) => {
    if (!isTouched) setIsTouched(true)
    onAdd(stack)
    if (selectedStacks.length + 1 >= maxCount) setOpen(false)
    setSearchQuery('')
  }

  const handleRemove = (tech: string) => {
    if (!isTouched) setIsTouched(true)
    onRemove(tech)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            기술 스택 <span className="ml-0.5 text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {selectedStacks.length} / {maxCount}
            </span>

            <div className="flex h-4 items-center">
              {selectedStacks.length >= maxCount && (
                <span className="animate-in fade-in slide-in-from-left-1 text-[11px] leading-none font-bold text-red-500">
                  최대 {maxCount}개까지 가능합니다
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative flex min-h-[56px] w-full flex-wrap items-center gap-2 rounded-lg border p-3 pr-20 transition-all ${
          shouldShowError
            ? 'border-red-500'
            : 'border-slate-200 dark:border-slate-700 dark:bg-slate-800/50'
        }`}
      >
        {selectedStacks.length === 0 && (
          <span className="text-xs text-slate-400">
            {error || '전문 분야를 선택해주세요.'}
          </span>
        )}

        {selectedStacks.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-white"
          >
            {tech}
            <X
              size={12}
              className="cursor-pointer transition-colors hover:text-red-400"
              onClick={() => handleRemove(tech)}
            />
          </span>
        ))}

        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={selectedStacks.length >= maxCount}
                className="h-8 text-xs font-bold"
              >
                <PlusCircle size={14} className="mr-1" /> 추가
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[200px] p-0"
              align="end"
              side="top"
              onWheel={(e) => e.stopPropagation()}
            >
              <Command>
                <CommandInput
                  placeholder="기술 검색..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <StackSearchList
                  items={FRAMEWORKS}
                  selectedItems={selectedStacks}
                  onSelect={handleSelect}
                />
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {error && (
        <p className="animate-in fade-in slide-in-from-top-1 font-lg ml-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
