import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        // "/calculator/:path*",
        "/dashboard",
        "/dashboard/:path*",
        "/reports/:path*",
    ],
};
