import { authMiddleware } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

export default authMiddleware({
  publicRoutes: ["/api/uploadthing", "/"],
  // ignoredRoutes: ["/((?!api|trpc))(_next.*|.+.[w]+$)", "/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
