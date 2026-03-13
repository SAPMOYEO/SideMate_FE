import ApplicantItem from '../../ApplicantItem'
import type { ApplicantDetail } from '@/types/applicant'

interface Props {
  show: boolean
  applicants: ApplicantDetail[]
  onDetail: (applicant: ApplicantDetail) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const ApplicantSection = ({
  show,
  applicants,
  onDetail,
  onApprove,
  onReject,
}: Props) => {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className="border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50/50 px-6 py-4 dark:bg-slate-800/30">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              지원 현황{' '}
              <span className="text-primary ml-1">{applicants.length}명</span>
            </h4>
          </div>

          {applicants.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">
              아직 지원자가 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {applicants.map((applicant) => (
                <ApplicantItem
                  key={applicant._id}
                  applicant={applicant}
                  onDetail={() => onDetail(applicant)}
                  onApprove={() => onApprove(applicant._id)}
                  onReject={() => onReject(applicant._id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantSection
