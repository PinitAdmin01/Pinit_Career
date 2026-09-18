import QuestWorkspaceClient from '@/components/quests/QuestWorkspaceClient';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';

interface QuestPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function QuestWorkspacePage({ params }: QuestPageProps) {
  return <QuestWorkspaceClient questId={params.id} />;
}
