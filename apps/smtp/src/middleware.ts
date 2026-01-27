import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const pmtradersApiUrl = requestHeaders.get("pmtraders-api-url");
    const pmtradersDomain = requestHeaders.get("pmtraders-domain");
    const pmtradersEvent = requestHeaders.get("pmtraders-event");
    const pmtradersSignature = requestHeaders.get("pmtraders-signature");

    if (pmtradersApiUrl) {
        requestHeaders.set("saleor-api-url", pmtradersApiUrl);
    }

    if (pmtradersDomain) {
        requestHeaders.set("saleor-domain", pmtradersDomain);
    }

    if (pmtradersEvent) {
        requestHeaders.set("saleor-event", pmtradersEvent);
    }

    if (pmtradersSignature) {
        requestHeaders.set("saleor-signature", pmtradersSignature);
    }

    /*
     * If we modified headers, return a response with those headers
     * The downstream API routes will verify these headers.
     */
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: "/api/:path*",
};
