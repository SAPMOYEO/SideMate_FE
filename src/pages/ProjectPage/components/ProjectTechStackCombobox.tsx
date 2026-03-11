import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
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
import { FRAMEWORKS } from '@/constants/stack'

interface Props {
  selectedStacks: string[]
  onAdd: (stack: string) => void
  onRemove: (stack: string) => void
  maxCount?: number
}

const ProjectTechStackCombobox = ({
  selectedStacks,
  onAdd,
  onRemove,
  maxCount = 8,
}: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-sm font-normal"
          >
            기술스택 선택(8개 이하)
            <ChevronsUpDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[230px] p-0" align="start">
          <Command>
            <CommandInput placeholder="기술스택 검색..." />
            <CommandList className="max-h-[220px]">
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {FRAMEWORKS.map((stack) => {
                  const selected = selectedStacks.includes(stack)
                  const disabled =
                    !selected && selectedStacks.length >= maxCount

                  return (
                    <CommandItem
                      key={stack}
                      disabled={disabled}
                      onSelect={() => {
                        if (selected) {
                          onRemove(stack)
                        } else {
                          onAdd(stack)
                        }
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${selected ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {stack}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex min-h-9 flex-wrap gap-2 rounded-lg border border-dashed p-2">
        {selectedStacks.length === 0 && (
          <span className="text-xs text-gray-400">
            선택한 기술스택이 없습니다.
          </span>
        )}

        {selectedStacks.map((stack) => (
          <button
            key={stack}
            type="button"
            onClick={() => onRemove(stack)}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {stack}
            <X className="h-3 w-3" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProjectTechStackCombobox
