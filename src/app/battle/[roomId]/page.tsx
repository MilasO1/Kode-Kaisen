
import BattleArena from '@/components/BattleArena';

interface BattlePageProps {
  params: {
    roomId: string;
  };
  searchParams: {
    name: string;
  };
}

export default function BattlePage({ params, searchParams }: BattlePageProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <BattleArena 
        roomId={params.roomId} 
        playerName={searchParams.name || 'Anonymous'} 
      />
    </div>
  );
}