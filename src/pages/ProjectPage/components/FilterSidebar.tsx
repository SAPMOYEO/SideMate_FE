import type { ProjectFilterState } from '@/types/project'
import ProjectTechStackCombobox from './ProjectTechStackCombobox'
interface Props {
  filter: ProjectFilterState
  onReset: () => void
  onTitleChange: (value: string) => void
  onToggleCategory: (value: string) => void
  onToggleTechStack: (value: string) => void
  onStatusChange: (value: string) => void
  onDateChange: (
    field: 'startDate' | 'endDate' | 'deadlineStartDate' | 'deadlineEndDate',
    value: string
  ) => void
}

const categoryOptions = ['웹개발', '모바일앱', 'AI & 머신러닝', '블록체인']
const statusOptions = [
  { label: '모집 중', value: 'RECRUITING' },
  { label: '모집 마감', value: 'CLOSED' },
  { label: '진행 완료', value: 'COMPLETED' },
]

const FilterSidebar = ({
  filter,
  onReset,
  onTitleChange,
  onToggleCategory,
  onToggleTechStack,
  onStatusChange,
  onDateChange,
}: Props) => {
  return (
    <aside className={`flex h-full w-[280px] flex-col border-r bg-white`}>
      <div className="flex items-center justify-between p-6">
        <h2 className="font-semibold text-gray-800">Filters</h2>

        <button
          type="button"
          onClick={onReset}
          className="hover:bg-primary-50 rounded px-2 py-1 text-sm text-indigo-500 transition"
        >
          초기화
        </button>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">
            PROJECT TITLE
          </p>
          <input
            type="text"
            value={filter.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="프로젝트 제목 검색"
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">CATEGORY</p>
          <div className="space-y-3 text-sm">
            {categoryOptions.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2 transition hover:text-indigo-600"
              >
                <input
                  type="checkbox"
                  checked={filter.category.includes(item)}
                  onChange={() => onToggleCategory(item)}
                  className="accent-indigo-500"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">TECH STACK</p>
          <ProjectTechStackCombobox
            selectedStacks={filter.requiredTechStack}
            onAdd={onToggleTechStack}
            onRemove={onToggleTechStack}
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">STATUS</p>
          <select
            value={filter.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">전체 상태</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">
            PROJECT DATE
          </p>
          <div className="space-y-3">
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => onDateChange('startDate', e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => onDateChange('endDate', e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400">
            DEADLINE DATE
          </p>
          <div className="space-y-3">
            <input
              type="date"
              value={filter.deadlineStartDate}
              onChange={(e) =>
                onDateChange('deadlineStartDate', e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={filter.deadlineEndDate}
              onChange={(e) => onDateChange('deadlineEndDate', e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
