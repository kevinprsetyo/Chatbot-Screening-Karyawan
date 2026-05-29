import type { Metadata } from 'next'
import ChatInterface from '@/components/interview/ChatInterface'
import CandidateContextPanel from '@/components/interview/CandidateContextPanel'
import AssessmentProgress from '@/components/interview/AssessmentProgress'
import InterviewTipsPanel from '@/components/interview/InterviewTipsPanel'
import InterviewLayout from '@/components/interview/InterviewLayout'

export const metadata: Metadata = {
  title: 'Wawancara — TalentMatch AI',
  description: 'Wawancara adaptif berbasis AI sedang berlangsung.',
}

interface Props {
  params: Promise<{ candidateId: string }>
}

export default async function InterviewPage({ params }: Props) {
  const { candidateId } = await params

  const sidebar = (
    <>
      <CandidateContextPanel />
      <AssessmentProgress />
      <InterviewTipsPanel />
    </>
  )

  const chat = <ChatInterface candidateId={candidateId} />

  return (
    <InterviewLayout 
      candidateId={candidateId} 
      sidebar={sidebar}
      chat={chat}
    />
  )
}
