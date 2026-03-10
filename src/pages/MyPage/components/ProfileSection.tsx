import React from 'react'
import { Github, Mail } from 'lucide-react'
import { useAppSelector } from '@/hooks'

const ProfileSection: React.FC = () => {
  const { user } = useAppSelector((state) => state.user)

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-start dark:border-slate-800 dark:bg-slate-900">
      <div className="shrink-0">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg dark:border-slate-800">
          <img
            src={user?.profile?.profileImage || 'https://github.com/shadcn.png'}
            alt="프로필"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="mb-6 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {user?.name || '김개발'}
          </h3>
          <p className="flex items-center justify-center gap-2 text-sm text-slate-500 md:justify-start">
            <Mail size={16} />
            {user?.email || 'developer@example.com'}
          </p>

          {user?.profile?.gitUrl && (
            <a
              href={`https://github.com/${user.profile.gitUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center justify-center gap-2 text-sm text-slate-500 transition-colors md:justify-start"
            >
              <Github size={16} />
              github.com/{user.profile.gitUrl}
            </a>
          )}
        </div>

        <div className="mb-6">
          <p className="leading-relaxed break-keep text-slate-600 dark:text-slate-400">
            {user?.profile?.bio || '아직 등록된 소개글이 없습니다.'}
          </p>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
            기술 스택
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {user?.profile?.techStack && user.profile.techStack.length > 0 ? (
              user.profile.techStack.map((tech) => (
                <span
                  key={tech}
                  className="dark:bg-primary/10 text-primary dark:border-primary/20 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold"
                >
                  {tech}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                등록된 기술 스택이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
