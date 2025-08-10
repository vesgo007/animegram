'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  mediaUrl: string;
  createdAt: string;
}

// Dados de exemplo para demonstração
const dummyStories: Story[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Naruto',
      image: 'https://via.placeholder.com/150/FF9800/FFFFFF?text=N',
    },
    mediaUrl: 'https://via.placeholder.com/500/FF9800/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Sasuke',
      image: 'https://via.placeholder.com/150/3F51B5/FFFFFF?text=S',
    },
    mediaUrl: 'https://via.placeholder.com/500/3F51B5/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Sakura',
      image: 'https://via.placeholder.com/150/E91E63/FFFFFF?text=S',
    },
    mediaUrl: 'https://via.placeholder.com/500/E91E63/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Kakashi',
      image: 'https://via.placeholder.com/150/9E9E9E/FFFFFF?text=K',
    },
    mediaUrl: 'https://via.placeholder.com/500/9E9E9E/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Hinata',
      image: 'https://via.placeholder.com/150/673AB7/FFFFFF?text=H',
    },
    mediaUrl: 'https://via.placeholder.com/500/673AB7/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    user: {
      id: '6',
      name: 'Shikamaru',
      image: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=S',
    },
    mediaUrl: 'https://via.placeholder.com/500/4CAF50/FFFFFF?text=Story',
    createdAt: new Date().toISOString(),
  },
];

export default function StoriesBar() {
  const { data: session } = useSession();
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide">
        {/* Criar Story */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center bg-gray-800 flex-shrink-0">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Seu perfil"
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-600 flex items-center justify-center text-white text-xl">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <span className="text-xs text-gray-300 mt-1 truncate w-16 text-center">Seu story</span>
        </div>

        {/* Stories dos usuários */}
        {dummyStories.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center focus:outline-none"
            onClick={() => handleStoryClick(story)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-purple-500 p-0.5 flex-shrink-0">
              <Image
                src={story.user.image}
                alt={story.user.name}
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-300 mt-1 truncate w-16 text-center">{story.user.name}</span>
          </button>
        ))}
      </div>

      {/* Modal de visualização de Story */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-lg w-full">
            <div className="flex items-center space-x-2 absolute top-4 left-4 z-10">
              <Image
                src={activeStory.user.image}
                alt={activeStory.user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-medium">{activeStory.user.name}</span>
            </div>
            <Image
              src={activeStory.mediaUrl}
              alt="Story"
              width={500}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}