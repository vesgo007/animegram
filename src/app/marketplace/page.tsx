'use client';

import { useState, useEffect } from 'react';
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

export default function MarketplacePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'figures',
    condition: 'new' as const,
    location: '',
  });
  const [creatingProduct, setCreatingProduct] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'figures', name: 'Figures' },
    { id: 'manga', name: 'Mangás' },
    { id: 'clothing', name: 'Roupas' },
    { id: 'accessories', name: 'Acessórios' },
    { id: 'posters', name: 'Pôsteres' },
    { id: 'collectibles', name: 'Colecionáveis' },
  ];

  useEffect(() => {
    // Simulação de carregamento de produtos
    const fetchProducts = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockProducts: Product[] = [
          {
            id: 'product-1',
            title: 'Figure Naruto Uzumaki Modo Sábio',
            description: 'Figure original do Naruto em modo sábio, em perfeito estado. Altura: 25cm.',
            price: 299.99,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Naruto+Figure',
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Naruto+Figure+2',
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
            saved: false,
          },
          {
            id: 'product-2',
            title: 'Coleção completa de One Piece (Volumes 1-100)',
            description: 'Coleção completa de mangás de One Piece, volumes 1 ao 100. Todos em excelente estado, alguns ainda lacrados.',
            price: 1500.00,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=One+Piece+Manga',
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=One+Piece+Collection',
            ],
            condition: 'good',
            category: 'manga',
            location: 'Rio de Janeiro, RJ',
            createdAt: '2023-05-10T09:15:00Z',
            seller: {
              id: 'user-2',
              name: 'Monkey D. Luffy',
              username: 'future_pirate_king',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=L',
            },
            saved: true,
          },
          {
            id: 'product-3',
            title: 'Camiseta Attack on Titan - Levi Ackerman',
            description: 'Camiseta oficial do Attack on Titan com estampa do Levi. Tamanho M, usada apenas uma vez.',
            price: 79.90,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=AoT+Shirt',
            ],
            condition: 'like-new',
            category: 'clothing',
            location: 'Belo Horizonte, MG',
            createdAt: '2023-05-18T16:45:00Z',
            seller: {
              id: 'user-3',
              name: 'Eren Yeager',
              username: 'eren_yeager',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=E',
            },
            saved: false,
          },
          {
            id: 'product-4',
            title: 'Colar Emblema Fairy Tail',
            description: 'Colar com o emblema da guilda Fairy Tail, banhado a prata. Novo, nunca usado.',
            price: 49.99,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Fairy+Tail+Necklace',
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Fairy+Tail+Emblem',
            ],
            condition: 'new',
            category: 'accessories',
            location: 'Curitiba, PR',
            createdAt: '2023-05-20T11:20:00Z',
            seller: {
              id: 'user-4',
              name: 'Lucy Heartfilia',
              username: 'celestial_wizard',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=L',
            },
            saved: false,
          },
          {
            id: 'product-5',
            title: 'Pôster Demon Slayer - Tanjiro e Nezuko',
            description: 'Pôster oficial de Demon Slayer com Tanjiro e Nezuko. Tamanho A1, ainda na embalagem original.',
            price: 39.90,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Demon+Slayer+Poster',
            ],
            condition: 'new',
            category: 'posters',
            location: 'Brasília, DF',
            createdAt: '2023-05-19T13:10:00Z',
            seller: {
              id: 'user-5',
              name: 'Tanjiro Kamado',
              username: 'tanjiro_kamado',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
            },
            saved: true,
          },
          {
            id: 'product-6',
            title: 'Espada Nichirin do Tomioka (Réplica)',
            description: 'Réplica da espada Nichirin de Giyu Tomioka de Demon Slayer. Tamanho real, feita de madeira e metal.',
            price: 349.90,
            images: [
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Nichirin+Sword',
              'https://via.placeholder.com/600/3B0764/FFFFFF?text=Tomioka+Sword',
            ],
            condition: 'new',
            category: 'collectibles',
            location: 'Porto Alegre, RS',
            createdAt: '2023-05-17T10:05:00Z',
            seller: {
              id: 'user-6',
              name: 'Giyu Tomioka',
              username: 'water_hashira',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=G',
            },
            saved: false,
          },
        ];

        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSaveProduct = (productId: string) => {
    // Aqui seria feita a chamada para a API para salvar/remover o produto
    // Por enquanto, vamos simular a atualização
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, saved: !product.saved } : product
      )
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.description.trim() || !newProduct.price || !session?.user) return;

    setCreatingProduct(true);

    // Aqui seria feita a chamada para a API para criar o produto
    // Por enquanto, vamos simular a criação
    setTimeout(() => {
      const createdProduct: Product = {
        id: `product-${Date.now()}`,
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        images: ['https://via.placeholder.com/600/3B0764/FFFFFF?text=New+Product'],
        condition: newProduct.condition,
        category: newProduct.category,
        location: newProduct.location || 'Localização não especificada',
        createdAt: new Date().toISOString(),
        seller: {
          id: session.user.id as string,
          name: session.user.name,
          username: session.user.name?.toLowerCase().replace(/\s+/g, '_'),
          image: session.user.image,
        },
        saved: false,
      };

      setProducts(prevProducts => [createdProduct, ...prevProducts]);

      // Resetar o formulário
      setNewProduct({
        title: '',
        description: '',
        price: '',
        category: 'figures',
        condition: 'new',
        location: '',
      });
      setCreatingProduct(false);
      setShowCreateModal(false);
    }, 1000);
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

  const filteredProducts = products.filter(product => {
    // Filtrar por categoria
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.seller.name?.toLowerCase().includes(query) ||
        product.seller.username?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-gray-400">Compre e venda itens de anime com outros fãs</p>
        </div>
        
        {session && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Vender Item
          </button>
        )}
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produtos..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === category.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-white">Nenhum produto encontrado</h2>
          <p className="mt-2 text-gray-400">
            {searchQuery 
              ? 'Tente usar termos de pesquisa diferentes ou remover os filtros.' 
              : 'Não há produtos disponíveis nesta categoria no momento.'}
          </p>
          {session && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Seja o primeiro a vender
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Link href={`/marketplace/${product.id}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
                  />
                </Link>
                <button
                  onClick={() => handleSaveProduct(product.id)}
                  className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 p-1.5 rounded-full hover:bg-opacity-100 transition-opacity duration-150"
                >
                  {product.saved ? (
                    <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="p-4">
                <Link href={`/marketplace/${product.id}`} className="text-lg font-semibold text-white hover:text-purple-400 transition-colors duration-150 line-clamp-1">
                  {product.title}
                </Link>
                
                <p className="text-purple-500 text-xl font-bold mt-1">
                  {formatPrice(product.price)}
                </p>
                
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <Link href={`/profile/${product.seller.id}`} className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        {product.seller.image ? (
                          <Image
                            src={product.seller.image}
                            alt={product.seller.name || 'Vendedor'}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                            {product.seller.name?.charAt(0) || 'V'}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="ml-2">
                      <Link href={`/profile/${product.seller.id}`} className="text-xs font-medium text-white hover:underline">
                        {product.seller.username || product.seller.name}
                      </Link>
                      <p className="text-xs text-gray-500">{product.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                      {getConditionLabel(product.condition)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação de produto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Vender um item</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct}>
              <div className="mb-4">
                <label htmlFor="productTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Título do produto*
                </label>
                <input
                  type="text"
                  id="productTitle"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  placeholder="Ex: Figure Naruto Uzumaki"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição*
                </label>
                <textarea
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Descreva seu produto em detalhes"
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300 mb-1">
                    Preço (R$)*
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="Ex: 99.90"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-300 mb-1">
                    Categoria*
                  </label>
                  <select
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="figures">Figures</option>
                    <option value="manga">Mangás</option>
                    <option value="clothing">Roupas</option>
                    <option value="accessories">Acessórios</option>
                    <option value="posters">Pôsteres</option>
                    <option value="collectibles">Colecionáveis</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="productCondition" className="block text-sm font-medium text-gray-300 mb-1">
                    Condição*
                  </label>
                  <select
                    id="productCondition"
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({...newProduct, condition: e.target.value as any})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="new">Novo</option>
                    <option value="like-new">Como novo</option>
                    <option value="good">Bom</option>
                    <option value="fair">Regular</option>
                    <option value="poor">Ruim</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="productLocation" className="block text-sm font-medium text-gray-300 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    id="productLocation"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Imagens
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center">
                  <svg className="h-10 w-10 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">Arraste e solte imagens aqui ou clique para selecionar</p>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG ou WEBP (máx. 5MB cada)</p>
                  <input type="file" className="hidden" accept="image/*" multiple />
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600"
                  >
                    Selecionar arquivos
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">* Imagens serão adicionadas na versão completa do app</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newProduct.title.trim() || !newProduct.description.trim() || !newProduct.price || creatingProduct}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creatingProduct ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publicando...
                    </>
                  ) : (
                    'Publicar Anúncio'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}