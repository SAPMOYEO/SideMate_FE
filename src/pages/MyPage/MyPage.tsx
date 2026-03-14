import React from 'react'
import ProfileSection from './components/ProfileSection'
import PreviewAppliedProjectSection from './components/PreviewAppliedProject'
import PreviewCreatedProjectSection from './components/PreviewCreatedProjectSection'

const MyPage: React.FC = () => {
  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-20 px-6 py-12">
        {/* 프로필 */}
        <ProfileSection />
        {/* 내가 지원한 프로젝트 */}
        <PreviewAppliedProjectSection />
        {/* 내가 만든 프로젝트 */}
        <PreviewCreatedProjectSection />
      </div>
    </div>
  )
}

export default MyPage
