import ViewGuideline from '@/app/_components/modules/_Guideline/ViewGuideline'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>

        <ViewGuideline></ViewGuideline>
      </Suspense>
    </div>
  )
}
