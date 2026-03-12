import { Activity } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useSearchParams } from 'react-router-dom'
import CreatedView from './components/view/CreatedView'
import AppliedView from './components/view/AppliedView'

type TabsType = 'supplied' | 'create'

const MyProjectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabs = (searchParams.get('tab') ?? 'supplied') as 'supplied' | 'create'

  const handleTabsChange = (v: TabsType) => {
    setSearchParams({ tab: v })
  }

  return (
    <div className="flex h-[calc(100dvh-84px)] bg-[#F6F6F8]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-auto px-6 py-12">
        <div className="mb-8 flex flex-col">
          {/* Tab */}
          <Tabs
            defaultValue={tabs}
            onValueChange={(v) => handleTabsChange(v as TabsType)}
          >
            <TabsList variant="line">
              <TabsTrigger
                value="supplied"
                className="data-[state=active]:text-primary after:bg-primary py-6"
              >
                지원한 프로젝트
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="data-[state=active]:text-primary after:bg-primary py-6"
              >
                내가 만든 프로젝트
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="bg-border mt-2.5 h-0.5 w-full"></div>
        </div>
        <div className="flex rounded-3xl">
          <Activity mode={tabs === 'supplied' ? 'visible' : 'hidden'}>
            <AppliedView />
          </Activity>
          <Activity mode={tabs !== 'supplied' ? 'visible' : 'hidden'}>
            <CreatedView />
          </Activity>
        </div>
      </div>
    </div>
  )
}

export default MyProjectPage
