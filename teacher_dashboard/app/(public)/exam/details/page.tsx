
import ExamDetailsClient from '@/app/_components/modules/exam/ExamDetailClient'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
       <ExamDetailsClient></ExamDetailsClient>
      </Suspense>
    </div>
  )
}
