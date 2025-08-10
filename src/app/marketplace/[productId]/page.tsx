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

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  category: string;
  location: string;
  createdAt: string;
  seller: User;
  saved?: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!productId) return;

    // Simulação de carregamento do produto
    const fetchProduct = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockProduct: Product = {
          id: productId,
          title: 'Figure Naruto Uzumaki Modo Sábio',
          description: 'Figure original do Naruto em modo sábio, em perfeito estado. Altura: 25cm. Fabricante: Bandai. Edição limitada comemorativa do 20º aniversário da série. Inclui base de exibição e acessórios intercambiáveis (mãos e expressões faciais). Produto importado do Japão, com caixa original e certificado de autenticidade.',
          price: 299.99,
          images: [
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Figure+1',
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Figure+2',
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Figure+3',
            'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Figure+4',
          ],
          condition: 'like-new',
          category: 'figures',
          location: 'São Paulo, SP',
          createdAt: '2023-05-15T14:30:00Z',
          seller: {
            id: 'user-1',
            name: 'Kakashi Sensei',
            username: 'kakashi_sensei',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
          },
          saved: Math.random() > 0.5, // Aleatório para simular
        };

        setProduct(mockProduct);
        setLoading(false);

        // Carregar produtos similares
        fetchSimilarProducts(mockProduct.category);
      } catch (err) {
        setError('Não foi possível carregar o produto. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const fetchSimilarProducts = async (category: string) => {
    try {
      // Aqui seria feita a chamada para a API
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));

      // Dados de exemplo
      const mockSimilarProducts: Product[] = [
        {
          id: 'similar-1',
          title: 'Figure Sasuke Uchiha - Susanoo',
          description: 'Figure do Sasuke com Susanoo completo. Altura: 30cm.',
          price: 349.99,
          images: ['https://via.placeholder.com/600/3B0764/FFFFFF?text=Sasuke+Figure'],
          condition: 'new',
          category: 'figures',
          location: 'São Paulo, SP',
          createdAt: '2023-05-10T10:15:00Z',
          seller: {
            id: 'user-2',
            name: 'Itachi Uchiha',
            username: 'itachi_uchiha',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=I',
          },
        },
        {
          id: 'similar-2',
          title: 'Figure Kakashi Hatake - Anbu',
          description: 'Figure do Kakashi na época Anbu. Altura: 22cm.',
          price: 259.99,
          images: ['https://via.placeholder.com/600/3B0764/FFFFFF?text=Kakashi+Figure'],
          condition: 'like-new',
          category: 'figures',
          location: 'Rio de Janeiro, RJ',
          createdAt: '2023-05-12T16:20:00Z',
          seller: {
            id: 'user-3',
            name: 'Obito Uchiha',
            username: 'obito_uchiha',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=O',
          },
        },
        {
          id: 'similar-3',
          title: 'Figure Minato Namikaze - Hokage',
          description: 'Figure do Quarto Hokage em pose de batalha. Altura: 25cm.',
          price: 289.99,
          images: ['https://via.placeholder.com/600/3B0764/FFFFFF?text=Minato+Figure'],
          condition: 'good',
          category: 'figures',
          location: 'Curitiba, PR',
          createdAt: '2023-05-14T09:45:00Z',
          seller: {
            id: 'user-4',
            name: 'Kushina Uzumaki',
            username: 'kushina_uzumaki',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
          },
        },
      ];

      setSimilarProducts(mockSimilarProducts);
    } catch (err) {
      console.error('Erro ao carregar produtos similares:', err);
    }
  };

  const handleSaveProduct = () => {
    if (!product || !session) return;

    // Aqui seria feita a chamada para a API para salvar/remover o produto
    // Por enquanto, vamos simular a atualização
    setProduct({
      ...product,
      saved: !product.saved,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !product || !session?.user) return;

    setSendingMessage(true);

    // Aqui seria feita a chamada para a API para enviar a mensagem
    // Por enquanto, vamos simular o envio
    setTimeout(() => {
      // Simulando sucesso
      setMessage('');
      setSendingMessage(false);
      setShowContactModal(false);

      // Mostrar alguma notificação de sucesso
      alert('Mensagem enviada com sucesso!');
    }, 1000);
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      'new': 'Novo',
      'like-new': 'Como novo',
      'good': 'Bom',
      'fair': 'Regular',
      'poor': 'Ruim',
    };
    return labels[condition] || condition;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'figures': 'Figures',
      'manga': 'Mangás',
      'clothing': 'Roupas',
      'accessories': 'Acessórios',
      'posters': 'Pôsteres',
      'collectibles': 'Colecionáveis',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/marketplace')}
            className="text-purple-500 hover:text-purple-400 transition-colors duration-150"
          >
            Voltar para o Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Produto não encontrado.</p>
        <button
          onClick={() => router.push('/marketplace')}
          className="mt-4 text-purple-500 hover:text-purple-400 transition-colors duration-150"
        >
          Voltar para o Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Navegação */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Marketplace
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href={`/marketplace?category=${product.category}`} className="ml-1 text-sm font-medium text-gray-400 hover:text-white md:ml-2">
                  {getCategoryLabel(product.category)}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                  {product.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="md:flex">
          {/* Galeria de imagens */}
          <div className="md:w-1/2">
            <div className="relative aspect-square">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.title}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
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
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="p-2 flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Imagem ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do produto */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-white">{product.title}</h1>
              <button
                onClick={handleSaveProduct}
                className={`p-1.5 rounded-full hover:bg-gray-700 transition-colors duration-150 ${product.saved ? 'text-purple-500' : 'text-gray-400'}`}
              >
                {product.saved ? (
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

            <div className="mt-4">
              <p className="text-3xl font-bold text-purple-500">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Condição:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  {getConditionLabel(product.condition)}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Localização:</span>
                <span className="text-white">{product.location}</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Publicado em:</span>
                <span className="text-white">{formatDate(product.createdAt)}</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Categoria:</span>
                <Link href={`/marketplace?category=${product.category}`} className="text-purple-500 hover:text-purple-400">
                  {getCategoryLabel(product.category)}
                </Link>
              </div>

              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Vendedor:</span>
                <Link href={`/profile/${product.seller.id}`} className="flex items-center text-white hover:text-purple-400">
                  <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                    {product.seller.image ? (
                      <Image
                        src={product.seller.image}
                        alt={product.seller.name || 'Vendedor'}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                        {product.seller.name?.charAt(0) || 'V'}
                      </div>
                    )}
                  </div>
                  {product.seller.username || product.seller.name}
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white mb-2">Descrição</h2>
              <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setShowContactModal(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md font-medium flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contatar Vendedor
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-md font-medium flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Denunciar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos similares */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Produtos similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((similarProduct) => (
              <div key={similarProduct.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <Link href={`/marketplace/${similarProduct.id}`}>
                    <Image
                      src={similarProduct.images[0]}
                      alt={similarProduct.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
                    />
                  </Link>
                </div>
                
                <div className="p-4">
                  <Link href={`/marketplace/${similarProduct.id}`} className="text-lg font-semibold text-white hover:text-purple-400 transition-colors duration-150 line-clamp-1">
                    {similarProduct.title}
                  </Link>
                  
                  <p className="text-purple-500 text-xl font-bold mt-1">
                    {formatPrice(similarProduct.price)}
                  </p>
                  
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{similarProduct.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Link href={`/profile/${similarProduct.seller.id}`} className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          {similarProduct.seller.image ? (
                            <Image
                              src={similarProduct.seller.image}
                              alt={similarProduct.seller.name || 'Vendedor'}
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                              {similarProduct.seller.name?.charAt(0) || 'V'}
                            </div>
                          )}
                        </div>
                      </Link>
                      <span className="ml-2 text-xs text-gray-500">{similarProduct.location}</span>
                    </div>
                    
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                      {getConditionLabel(similarProduct.condition)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de contato */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Contatar Vendedor</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                {product.seller.image ? (
                  <Image
                    src={product.seller.image}
                    alt={product.seller.name || 'Vendedor'}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                    {product.seller.name?.charAt(0) || 'V'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{product.seller.username || product.seller.name}</p>
                <p className="text-gray-400 text-sm">Vendedor</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Produto: <span className="text-white">{product.title}</span></p>
              <p className="text-gray-300 text-sm">Preço: <span className="text-purple-500 font-medium">{formatPrice(product.price)}</span></p>
            </div>
            
            {session ? (
              <form onSubmit={handleSendMessage}>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Sua mensagem
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Olá! Estou interessado neste produto. Ainda está disponível?"
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || sendingMessage}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {sendingMessage ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Mensagem'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-300 mb-4">Faça login para contatar o vendedor</p>
                <Link href="/auth/login" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Fazer Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}