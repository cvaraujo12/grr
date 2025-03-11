import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constantes para mensagens de erro e redirecionamento
const AUTH_ERROR_MESSAGE = 'Por favor, faça login para continuar';
const AUTH_REDIRECT_MESSAGE = 'Você será redirecionado para a página inicial';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/forgot-password'
];

// Lista de recursos estáticos que não devem ser interceptados
const staticResources = [
  '/api',
  '/_next',
  '/favicon',
  '/images',
  '/sounds',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignora recursos estáticos
  if (staticResources.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verifica token do Firebase no cookie
  const session = request.cookies.get('__session');
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Redireciona para login se não estiver autenticado
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    // Adiciona URL de retorno e mensagem para melhor experiência do usuário
    loginUrl.searchParams.set('returnTo', pathname);
    loginUrl.searchParams.set('message', AUTH_ERROR_MESSAGE);
    
    const response = NextResponse.redirect(loginUrl);
    // Remove o cookie de sessão expirado
    response.cookies.delete('__session');
    return response;
  }

  // Redireciona para home se tentar acessar páginas de auth já logado
  if (session && isPublicRoute) {
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('message', AUTH_REDIRECT_MESSAGE);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercepta todas as rotas exceto recursos estáticos
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
