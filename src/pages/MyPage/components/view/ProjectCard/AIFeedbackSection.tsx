interface Props {
  show: boolean
}

const AIFeedbackSection = ({ show }: Props) => {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            AI 피드백
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AI 피드백 내용이 여기에 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIFeedbackSection
