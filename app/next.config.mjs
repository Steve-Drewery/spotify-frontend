/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify plugin will handle the build output
};

export default nextConfig;

// const api = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:8000/:path*", // Proxy to Backend
//       },
//     ];
//   },
// };

// export default api;
