import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="font-playfair text-6xl md:text-7xl text-foreground mb-2">
          404
        </h1>
        <p className="font-jetbrains text-sm text-foreground/50 mb-8">
          Essa carta se perdeu pelo caminho.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy/90 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
