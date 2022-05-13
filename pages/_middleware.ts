import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// Mapping for the paths to redirections
let m = new Map();
m.set('/', { needsToken: false, redirectIfHasToken: false });
m.set('/signup', { needsToken: false, redirectIfHasToken: true });
m.set('/login', { needsToken: false, redirectIfHasToken: true });
m.set('/quiz', { needsToken: true, redirectIfHasToken: false });
m.set('/account', { needsToken: true, redirectIfHasToken: false });

// Middleware
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const token = req.cookies.token;
    const url = req.nextUrl.clone();

    if (m.has(url.pathname)) {
        const needsToken = m.get(url.pathname).needsToken;
        const redirectIfHasToken = m.get(url.pathname).redirectIfHasToken;

        if (needsToken && !token) {
            url.pathname = '/signup';
            return NextResponse.redirect(url);
        }

        if (redirectIfHasToken && token) {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.next();
}