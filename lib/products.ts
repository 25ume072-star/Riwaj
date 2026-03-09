export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  rating: number
  reviews: number
  description?: string
  sizes?: string[]
  colors?: { name: string; hex: string }[]
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Maroon Banarasi Silk Saree',
    price: 15999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    ],
    category: 'Sarees',
    rating: 4.8,
    reviews: 124,
    description: 'Exquisite Banarasi silk saree with intricate gold zari work. Perfect for weddings and special occasions.',
    sizes: ['Free Size'],
    colors: [
      { name: 'Maroon', hex: '#800000' },
      { name: 'Navy', hex: '#000080' },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Embroidered Bridal Lehenga Set',
    price: 45999,
    originalPrice: 55999,
    image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop',
    category: 'Lehengas',
    rating: 4.9,
    reviews: 89,
    description: 'Stunning bridal lehenga with heavy embroidery and stone work. Includes lehenga, choli, and dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Red', hex: '#B22222' },
      { name: 'Pink', hex: '#FF69B4' },
    ],
    inStock: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Traditional Sherwani with Embroidery',
    price: 28999,
    originalPrice: 35999,
    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=600&h=800&fit=crop',
    category: 'Sherwanis',
    rating: 4.7,
    reviews: 67,
    description: 'Classic sherwani with intricate thread work and button details. Perfect for grooms and special occasions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Gold', hex: '#D4AF37' },
    ],
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Designer Silk Kurta Set',
    price: 8999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    category: 'Kurtas',
    rating: 4.6,
    reviews: 156,
    description: 'Elegant silk kurta with matching pajama. Features subtle embroidery and premium fabric.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Cream', hex: '#FFFDD0' },
    ],
    inStock: true,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Chanderi Cotton Saree',
    price: 7999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop',
    category: 'Sarees',
    rating: 4.5,
    reviews: 203,
    description: 'Lightweight Chanderi cotton saree with golden border. Ideal for daily and festive wear.',
    sizes: ['Free Size'],
    colors: [
      { name: 'Peach', hex: '#FFDAB9' },
      { name: 'Mint', hex: '#98FF98' },
    ],
    inStock: true
  },
  {
    id: '6',
    name: 'Velvet Embroidered Lehenga',
    price: 38999,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
    category: 'Lehengas',
    rating: 4.8,
    reviews: 45,
    description: 'Luxurious velvet lehenga with mirror work and sequin embellishments.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald', hex: '#50C878' },
      { name: 'Royal Blue', hex: '#4169E1' },
    ],
    inStock: true
  },
  {
    id: '7',
    name: 'Jodhpuri Bandhgala Suit',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    category: 'Sherwanis',
    rating: 4.7,
    reviews: 78,
    description: 'Classic Jodhpuri bandhgala with contemporary design. Includes jacket and trousers.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
    ],
    inStock: true,
    isFeatured: true
  },
  {
    id: '8',
    name: 'Printed Cotton Kurta',
    price: 3999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600&h=800&fit=crop',
    category: 'Kurtas',
    rating: 4.4,
    reviews: 312,
    description: 'Comfortable cotton kurta with traditional block print. Perfect for casual occasions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blue', hex: '#4682B4' },
      { name: 'Brown', hex: '#8B4513' },
    ],
    inStock: true,
    isNew: true
  },
  {
    id: '9',
    name: 'Organza Saree with Sequin Work',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1622228731854-eeffe4c2e82c?w=600&h=800&fit=crop',
    category: 'Sarees',
    rating: 4.6,
    reviews: 98,
    description: 'Lightweight organza saree with beautiful sequin detailing. Elegant and modern.',
    sizes: ['Free Size'],
    colors: [
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Coral', hex: '#FF7F50' },
    ],
    inStock: true
  },
  {
    id: '10',
    name: 'Anarkali Suit with Dupatta',
    price: 18999,
    originalPrice: 22999,
    image: 'https://images.unsplash.com/photo-1583391733981-8b530c8a41b9?w=600&h=800&fit=crop',
    category: 'Lehengas',
    rating: 4.7,
    reviews: 134,
    description: 'Graceful Anarkali suit with flowing silhouette and intricate embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Teal', hex: '#008080' },
      { name: 'Wine', hex: '#722F37' },
    ],
    inStock: true,
    isFeatured: true
  },
  {
    id: '11',
    name: 'Nehru Jacket with Kurta',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop',
    category: 'Kurtas',
    rating: 4.5,
    reviews: 87,
    description: 'Stylish Nehru jacket paired with a cotton kurta. Perfect for festive occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Grey', hex: '#808080' },
    ],
    inStock: true
  },
  {
    id: '12',
    name: 'Zardozi Work Sherwani',
    price: 52999,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=800&fit=crop',
    category: 'Sherwanis',
    rating: 4.9,
    reviews: 34,
    description: 'Premium sherwani with exquisite zardozi embroidery. Handcrafted by master artisans.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true
  }
]

export const categories = [
  { id: 'sarees', name: 'Sarees', count: 42, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop' },
  { id: 'lehengas', name: 'Lehengas', count: 38, image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop' },
  { id: 'sherwanis', name: 'Sherwanis', count: 25, image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=400&h=500&fit=crop' },
  { id: 'kurtas', name: 'Kurtas', count: 56, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop' },
]

export const reviews = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Absolutely stunning saree! The quality exceeded my expectations. The zari work is exquisite.',
    date: '2 weeks ago'
  },
  {
    id: '2',
    name: 'Rahul Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'The sherwani was perfect for my wedding. Everyone complimented the craftsmanship.',
    date: '1 month ago'
  },
  {
    id: '3',
    name: 'Anjali Patel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Beautiful lehenga with great attention to detail. Delivery was prompt and packaging was premium.',
    date: '3 weeks ago'
  },
]
