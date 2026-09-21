import { getBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, User, ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: 'No encontrado' };

  return {
    title: `${post.title} | Blog RecuerdoQR`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  };
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Simple markdown to HTML parser for our basic needs
function renderMarkdown(content: string) {
  // Convert ### Headings
  let html = content.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">$1</h3>');
  
  // Convert **Bold**
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Convert *Italic*
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Convert [text](link)
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-[#a21232] font-semibold hover:underline">$1</a>');
  
  // Convert paragraphs (split by double newlines)
  const paragraphs = html.split('\n\n').map(p => {
    if (p.trim() && !p.trim().startsWith('<h3')) {
      return `<p class="mb-5 text-gray-700 leading-relaxed">${p.trim()}</p>`;
    }
    return p;
  });

  return paragraphs.join('\n');
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-[#a21232] transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6 uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString('es-CL', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
        </header>

        {/* Cover Image */}
        <div className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden mb-12 shadow-xl border border-gray-100">
          <Image 
            src={post.coverImage} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div 
          className="prose prose-rose max-w-none mb-16 text-lg"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA (Llamado a la acción) */}
        <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-[2rem] p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-200/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#a21232]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Heart className="w-12 h-12 text-[#a21232] fill-rose-100 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-2xl md:text-3xl font-black text-gray-900 mb-3">
              ¿Listo para dar el mejor regalo?
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Crea una página web secreta con vuestras fotos, canción y una carta en menos de 5 minutos. Un recuerdo que durará toda la vida.
            </p>
            <Link 
              href="/personalizar"
              className="inline-flex items-center gap-2 bg-[#a21232] hover:bg-[#8a0f2a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-transform hover:-translate-y-1 shadow-lg shadow-rose-900/20"
            >
              <Sparkles className="w-4 h-4" />
              Crear mi experiencia ahora
            </Link>
          </div>
        </div>

      </article>
    </div>
  );
}
