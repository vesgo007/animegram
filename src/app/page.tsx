'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/feed');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Animegram
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Conecte-se com outros fãs de anime, compartilhe suas paixões e descubra novos conteúdos.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-full p-2 mr-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-300">Compartilhe suas coleções e momentos favoritos</p>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-full p-2 mr-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-300">Conecte-se com outros fãs de anime</p>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-full p-2 mr-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-300">Descubra novos animes e mangás</p>
            </div>
          </div>
          <div className="mt-10">
            <Link 
              href="/auth/login" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg mr-4 transition duration-300"
            >
              Entrar
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-transparent hover:bg-purple-600 text-purple-600 hover:text-white font-bold py-3 px-6 rounded-lg border border-purple-600 transition duration-300"
            >
              Registrar
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 right-4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <div className="bg-gray-800 border-4 border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">A</div>
                    <div>
                      <p className="font-medium">Animegram</p>
                      <p className="text-xs text-gray-400">Compartilhando momentos anime</p>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden mb-4 bg-gray-900">
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <div className="w-full h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">Animegram</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex space-x-4 mb-2">
                        <button className="text-pink-500">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="text-gray-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                        <button className="text-gray-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">otaku_lover</span> Acabei de assistir o novo episódio de Demon Slayer! A animação está incrível! 🔥🗡️
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
