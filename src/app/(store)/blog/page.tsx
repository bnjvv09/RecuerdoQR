import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/blog';
import { ChevronRight, Calendar, Tag } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Ideas de Regalos Románticos',
  description: 'Descubre las mejores ideas de regalos, consejos para tu relación y cómo sorprender a tu pareja en aniversarios y fechas especiales.',
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Inspiración <span className="text-[#a21232] italic">Romántica</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ideas de regalos, consejos para relaciones a distancia y las mejores formas de sorprender a esa persona especial.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100/50 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-[#a21232] bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.tags[0]}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-[#a21232] transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-[#a21232] font-semibold text-sm mt-auto">
                  Leer artículo
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
