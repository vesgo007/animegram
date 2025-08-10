import StoriesBar from '@/components/stories/StoriesBar';
import Feed from '@/components/feed/Feed';
import CreatePostButton from '@/components/feed/CreatePostButton';

export const metadata = {
  title: 'Feed | Animegram',
  description: 'Veja as últimas postagens dos seus amigos e comunidades de anime favoritas',
};

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <StoriesBar />
      <div className="mt-6">
        <Feed />
      </div>
      <CreatePostButton />
    </div>
  );
}