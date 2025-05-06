import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest } from 'next/server';
import { createClient } from './utils/supabase/server';
import { getUser } from './utils/supabase/queries';
import { pathName } from './config/dashboard';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  response.headers.set('x-current-path', request.nextUrl.pathname);

  const supabase = await createClient();
  const user = await getUser(supabase);
  // Chỉ kiểm tra xác thực khi truy cập các trang yêu cầu đăng nhập
  if (request.nextUrl.pathname.startsWith(pathName.dashboard)) {
    if (!user) {
      return Response.redirect(new URL(pathName.auth, request.url));
    }
  }

  // Nếu người dùng đã đăng nhập và truy cập trang đăng nhập, chuyển hướng đến dashboard
  if (user && request.nextUrl.pathname === pathName.auth) {
    return Response.redirect(new URL(pathName.dashboard, request.url));
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/dashboard/:path*',
  ],
};
