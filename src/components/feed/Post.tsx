'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { likePost, unlikePost, incrementCommentCount } from '@/lib/redux/slices/feedSlice';

interface PostProps {
  post: {
    id: string;
    caption?: string;
    mediaUrls: string[];
    createdAt: string;
    userId: string;
    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      image?: string | null;
    };
    likes: number;
    comments: number;
    isLiked: boolean;
  };
}

export default function Post({ post }: PostProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLike = () => {
    if (post.isLiked) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Aqui seria feita a chamada para a API para salvar o comentário
      dispatch(incrementCommentCount(post.id));
      setComment('');
    }
  };

  const nextImage = () => {
    if (currentImageIndex < post.mediaUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 shadow-lg">
      {/* Cabeçalho do post */}
      <div className="flex items-center p-4">
        <Link href={`/profile/${post.user.id}`} className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            {post.user.image ? (
              <Image
                src={post.user.image}
                alt={post.user.name || 'Usuário'}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                {post.user.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">
              {post.user.username || post.user.name || 'Usuário'}
            </h3>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </Link>
        <button className="ml-auto text-gray-400 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Conteúdo do post (imagem/vídeo) */}
      <div className="relative">
        {post.mediaUrls.length > 0 && (
          <div className="relative aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
            <Image
              src={post.mediaUrls[currentImageIndex]}
              alt="Post"
              width={800}
              height={600}
              className="max-h-[500px] w-auto mx-auto object-contain"
            />
            
            {/* Navegação de imagens */}
            {post.mediaUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-opacity-70'}`}
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === post.mediaUrls.length - 1}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 ${currentImageIndex === post.mediaUrls.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-opacity-70'}`}
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Indicadores de imagem */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {post.mediaUrls.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-500'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Ações do post (curtir, comentar, compartilhar) */}
      <div className="p-4">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              className={`h-6 w-6 ${post.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={post.isLiked ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="ml-1">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="ml-1">{post.comments}</span>
          </button>
          <button className="flex items-center text-gray-400 hover:text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>

        {/* Legenda do post */}
        {post.caption && (
          <div className="mt-3">
            <p className="text-white">
              <span className="font-medium">{post.user.username || post.user.name}: </span>
              {post.caption}
            </p>
          </div>
        )}

        {/* Seção de comentários */}
        {showComments && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Comentários</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <p className="text-gray-400 text-sm">Nenhum comentário ainda.</p>
            </div>
            {session?.user && (
              <form onSubmit={handleComment} className="mt-3 flex">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 bg-gray-700 text-white rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-r-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}