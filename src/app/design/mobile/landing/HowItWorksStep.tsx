import { Libre_Baskerville } from 'next/font/google'

const lb = Libre_Baskerville({ subsets: ['latin'] })

interface HowItWorksStepProps {
  heading: string
  description: string
}

export default function HowItWorksStep({ heading, description }: HowItWorksStepProps) {
  return (
    <div className="text-center">
      <h3 className={`${lb.className} text-3xl font-bold text-rose-700`}>{heading}</h3>
      <p className="mt-4 text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}
