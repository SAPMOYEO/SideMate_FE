import React from 'react'
import { Github, UserCircle, Info, Lock, CircleAlert, User } from 'lucide-react'
import { useAppSelector } from '@/hooks'
import ProfileEditModal from './ProfileEditModal'

const ProfileSection: React.FC = () => {
  const { user } = useAppSelector((state) => state.user)
  const privacy = user?.privacySettings

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-4 dark:border-white">
        <div className="flex items-center gap-2">
          <User size={22} className="text-indigo-600" strokeWidth={2.5} />
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            내 프로필
          </h2>
        </div>
        <ProfileEditModal />
      </div>
      <div className="flex items-center gap-2 px-1">
        <Info size={14} className="shrink-0 text-indigo-500" />
        <p className="text-[11px] font-bold tracking-tight text-zinc-500 dark:text-slate-400">
          프로젝트 지원 시, 프로젝트 리더가 보게 되는 내 프로필입니다.{' '}
          <span className="font-extrabold text-indigo-500/80">프로필 수정</span>
          에서 공개 여부를 설정할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-all md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="shrink-0">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-xl md:h-46 md:w-46 dark:border-slate-800">
            {privacy?.isImagePublic && user?.profile?.profileImage ? (
              <img
                src={user.profile.profileImage}
                alt="프로필"
                className="animate-in fade-in h-full w-full object-cover duration-500"
              />
            ) : (
              <UserCircle
                className="relative top-1 h-[85%] w-[85%] text-zinc-300 dark:text-slate-700"
                strokeWidth={1}
              />
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="mb-3 flex flex-col gap-2">
            <h3 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {user?.name || '사용자'}
            </h3>

            {privacy?.isGithubPublic ? (
              user?.profile?.gitUrl ? (
                <a
                  href={`https://github.com/${user.profile.gitUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-500 md:justify-start"
                >
                  <Github size={16} />
                  github.com/{user.profile.gitUrl}
                </a>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <CircleAlert size={14} className="shrink-0 text-indigo-400" />
                  등록된 GitHub 주소가 없습니다.
                </p>
              )
            ) : (
              <p className="flex items-center justify-center gap-1.5 text-sm text-zinc-400 md:justify-start">
                <Lock size={14} className="shrink-0 text-indigo-400" />
                GitHub 주소는 비공개 상태입니다.
              </p>
            )}
          </div>

          <div className="mb-6">
            {privacy?.isBioPublic ? (
              user?.profile?.bio ? (
                <p className="leading-relaxed break-keep text-zinc-600 dark:text-zinc-400">
                  {user.profile.bio}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <CircleAlert size={14} className="shrink-0 text-indigo-400" />
                  <span>등록된 한 줄 소개가 없습니다.</span>
                </div>
              )
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-lg py-2 text-sm text-zinc-400 dark:bg-slate-800/50">
                <Lock size={14} className="shrink-0 text-indigo-400" />
                <span>한 줄 소개는 비공개 상태입니다.</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-3 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              기술 스택
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {user?.profile?.techStack && user.profile.techStack.length > 0 ? (
                user.profile.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-indigo-400 bg-zinc-50/50 px-3 py-1 text-xs font-bold text-indigo-600 transition-colors dark:border-indigo-900/30 dark:bg-indigo-950/30 dark:text-indigo-400"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-xs text-zinc-300">
                  등록된 기술 스택이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
