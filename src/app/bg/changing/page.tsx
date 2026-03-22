'use client'

import { ComponentGroup } from '@/app/components/page'

const backgrounds = [
  'bg-[#FFEEE3]',
  'bg-rose-100',
  'bg-rose-50',
  'bg-[#FFEBD9]',
  'bg-[#FFE4CB]',
]

export default function ChangingPage() {
  return (
    <>
      {/* Fixed component group */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <ComponentGroup />
        </div>
      </div>

      {/* Scrollable background sections */}
      {backgrounds.map((bg, i) => (
        <div key={i} className={`h-screen w-full ${bg}`} />
      ))}
    </>
  )
}
