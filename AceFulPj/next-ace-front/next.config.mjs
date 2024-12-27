/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/admin/:path*',
          missing: [
            {
              type: 'cookie',
              key: 'loggedin',
              value: 'true',
            },
          ],
          destination: '/',
          permanent: false,
        },
      ];
    },
  };
  
  export default nextConfig;
  