import QuestWorkspaceClient from '@/components/quests/QuestWorkspaceClient';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';

interface QuestPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  const ids = new Set<string>();
  for (const q of QUESTS_REGISTRY) {
    if (q?.id) ids.add(q.id);
  }
  for (const course of COURSES_REGISTRY) {
    for (const q of course.quests || []) {
      if (q?.id) ids.add(q.id);
    }
  }
  return Array.from(ids).map(id => ({ id }));
}

export default function QuestWorkspacePage({ params }: QuestPageProps) {
  return <QuestWorkspaceClient questId={params.id} />;
}
