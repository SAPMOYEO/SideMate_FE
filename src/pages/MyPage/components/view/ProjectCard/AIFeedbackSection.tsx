import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CircleCheck, Lightbulb, Sparkles } from 'lucide-react'
import { fetchProjectFeedbacks } from '@/utils/api/feedback'
interface Props {
  show: boolean
  projectId: string
}

const AIFeedbackSection = ({ show, projectId }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project-feedbacks', projectId],
    queryFn: () => fetchProjectFeedbacks(projectId),
    enabled: show && Boolean(projectId),
  })

  const feedbackList = data?.data ?? []

  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              AI 피드백
            </p>
          </div>

          {isLoading && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI 피드백을 불러오는 중입니다.
            </p>
          )}

          {isError && (
            <p className="text-sm text-rose-500">
              AI 피드백을 불러오지 못했습니다.
            </p>
          )}

          {!isLoading && !isError && feedbackList.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              연결된 AI 피드백이 없습니다.
            </p>
          )}

          {!isLoading && !isError && feedbackList.length > 0 && (
            <div className="space-y-4">
              {feedbackList.map((feedback, index) => (
                <section
                  key={feedback._id}
                  className="rounded-2xl border border-white bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      AI 피드백 #{feedbackList.length - index}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CircleCheck className="h-4 w-4" />
                        강점
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {feedback.strengths.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
                        <AlertTriangle className="h-4 w-4" />
                        보완점
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {feedback.weaknesses.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                        <Lightbulb className="h-4 w-4" />
                        개선 제안
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {feedback.suggestions.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-sm font-semibold text-slate-800">
                        종합 내용
                      </div>
                      <p className="text-sm leading-6 whitespace-pre-line text-slate-600">
                        {feedback.overallComment || '종합 내용이 없습니다.'}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIFeedbackSection
