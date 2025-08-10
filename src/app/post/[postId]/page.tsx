'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  likes: number;
  liked?: boolean;
}

interface Post {
  id: string;
  caption?: string | null;
  images: string[];
  createdAt: string;
  user: User;
  likes: number;
  comments: Comment[];
  liked?: boolean;
  saved?: boolean;
}

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!postId) return;

    // Aqui seria feita a chamada para a API para buscar o post
    // Por enquanto, vamos simular com dados de exemplo
    setTimeout(() => {
      try {
        const mockPost: Post = {
          id: postId,
          caption: 'Treinando meu novo jutsu! #naruto #rasengan',
          images: [
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Training',
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Rasengan',
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Team+7',
          ],
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          user: {
            id: '1',
            name: 'Naruto Uzumaki',
            username: 'naruto_uzumaki',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
          },
          likes: 120,
          liked: Math.random() > 0.5, // Aleatório para simular
          saved: Math.random() > 0.5, // Aleatório para simular
          comments: [
            {
              id: '1',
              content: 'Incrível! Você está ficando muito forte!',
              createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
              user: {
                id: '2',
                name: 'Sakura Haruno',
                username: 'sakura_haruno',
                image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
              },
              likes: 5,
              liked: false,
            },
            {
              id: '2',
              content: 'Hmph, ainda não é páreo para meu Chidori.',
              createdAt: new Date(Date.now() - 1500000).toISOString(), // 25 minutos atrás
              user: {
                id: '3',
                name: 'Sasuke Uchiha',
                username: 'sasuke_uchiha',
                image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
              },
              likes: 8,
              liked: true,
            },
            {
              id: '3',
              content: 'Vocês dois estão progredindo muito bem!',
              createdAt: new Date(Date.now() - 1200000).toISOString(), // 20 minutos atrás
              user: {
                id: '4',
                name: 'Kakashi Hatake',
                username: 'kakashi_sensei',
                image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
              },
              likes: 12,
              liked: false,
            },
          ],
        };

        setPost(mockPost);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar o post. Tente novamente mais tarde.');
        setLoading(false);
      }
    }, 1000);
  }, [postId]);

  const handleLikePost = () => {
    if (!post || !session) return;

    // Aqui seria feita a chamada para a API para curtir/descurtir o post
    // Por enquanto, vamos simular a atualização
    setPost({
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleSavePost = () => {
    if (!post || !session) return;

    // Aqui seria feita a chamada para a API para salvar/remover o post
    // Por enquanto, vamos simular a atualização
    setPost({
      ...post,
      saved: !post.saved,
    });
  };

  const handleLikeComment = (commentId: string) => {
    if (!post || !session) return;

    // Aqui seria feita a chamada para a API para curtir/descurtir o comentário
    // Por enquanto, vamos simular a atualização
    setPost({
      ...post,
      comments: post.comments.map(comment => 
        comment.id === commentId ? {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
        } : comment
      ),
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post || !session?.user) return;

    setSubmittingComment(true);

    // Aqui seria feita a chamada para a API para adicionar o comentário
    // Por enquanto, vamos simular a adição
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: session.user.id as string,
          name: session.user.name,
          username: session.user.name?.toLowerCase().replace(/\s+/g, '_'),
          image: session.user.image,
        },
        likes: 0,
        liked: false,
      };

      setPost({
        ...post,
        comments: [newCommentObj, ...post.comments],
      });

      setNewComment('');
      setSubmittingComment(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora mesmo';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const nextImage = () => {
    if (!post) return;
    setCurrentImageIndex((currentImageIndex + 1) % post.images.length);
  };

  const prevImage = () => {
    if (!post) return;
    setCurrentImageIndex((currentImageIndex - 1 + post.images.length) % post.images.length);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/feed')}
            className="text-purple-500 hover:text-purple-400 transition-colors duration-150"
          >
            Voltar para o feed
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Post não encontrado.</p>
        <button
          onClick={() => router.push('/feed')}
          className="mt-4 text-purple-500 hover:text-purple-400 transition-colors duration-150"
        >
          Voltar para o feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="md:flex">
          {/* Imagem do post */}
          <div className="md:w-2/3 relative">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <Image
                src={post.images[currentImageIndex]}
                alt={post.caption || 'Post'}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>

            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-opacity duration-150"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-opacity duration-150"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Detalhes do post e comentários */}
          <div className="md:w-1/3 flex flex-col">
            {/* Cabeçalho do post */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Link href={`/profile/${post.user.id}`} className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
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
                </Link>
                <div className="ml-3">
                  <Link href={`/profile/${post.user.id}`} className="text-sm font-medium text-white hover:underline">
                    {post.user.username || post.user.name}
                  </Link>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Comentários */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Legenda do post */}
              {post.caption && (
                <div className="flex">
                  <Link href={`/profile/${post.user.id}`} className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      {post.user.image ? (
                        <Image
                          src={post.user.image}
                          alt={post.user.name || 'Usuário'}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-sm">
                          {post.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="ml-3">
                    <div>
                      <Link href={`/profile/${post.user.id}`} className="text-sm font-medium text-white hover:underline">
                        {post.user.username || post.user.name}
                      </Link>{' '}
                      <span className="text-sm text-gray-300">{post.caption}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              )}

              {/* Lista de comentários */}
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex">
                  <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      {comment.user.image ? (
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name || 'Usuário'}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-sm">
                          {comment.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="ml-3 flex-1">
                    <div>
                      <Link href={`/profile/${comment.user.id}`} className="text-sm font-medium text-white hover:underline">
                        {comment.user.username || comment.user.name}
                      </Link>{' '}
                      <span className="text-sm text-gray-300">{comment.content}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{formatDate(comment.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center ${comment.liked ? 'text-red-500' : 'hover:text-gray-400'}`}
                      >
                        {formatNumber(comment.likes)} curtidas
                      </button>
                      <span className="mx-1">•</span>
                      <button className="hover:text-gray-400">Responder</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ações do post */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                  <button 
                    onClick={handleLikePost}
                    className={`${post.liked ? 'text-red-500' : 'text-gray-300 hover:text-gray-100'}`}
                  >
                    {post.liked ? (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                  <button className="text-gray-300 hover:text-gray-100">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button className="text-gray-300 hover:text-gray-100">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={handleSavePost}
                  className={`${post.saved ? 'text-purple-500' : 'text-gray-300 hover:text-gray-100'}`}
                >
                  {post.saved ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-white font-medium">{formatNumber(post.likes)} curtidas</p>
                <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
              </div>

              {/* Formulário de comentário */}
              {status === 'authenticated' ? (
                <form onSubmit={handleSubmitComment} className="flex items-center">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Publicar'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-2">
                  <Link href="/auth/login" className="text-purple-500 hover:text-purple-400 transition-colors duration-150">
                    Faça login para comentar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}