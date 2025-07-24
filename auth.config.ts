import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ auth, request }: any) {
      //Array of regex patterns of path we want to protect

      const protectedPath = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //get the pathname from the request url object
      const { pathname } = request.nextUrl;

      //Check if user not authenticated
      if (!auth && protectedPath.some((p) => p.test(pathname))) return false;

      if (!request.cookies.get("sessionCartId")) {
        //Check for session cart cookie

        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        // Clone the req headers

        const newRequestHeaders = new Headers(request.headers);

        //Create new response

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //Set newly generated sessionCartId in the response cookies

        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
