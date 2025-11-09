import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: [
      "m.media-amazon.com",   
      "images.unsplash.com",
      "your-project.supabase.co",
    ],
    remotePatterns: [
        { protocol: "https", hostname: "m.media-amazon.com" },
        { protocol: "https", hostname: "images.unsplash.com" },
        { protocol: "https", hostname: "**.supabase.co" },
        { protocol: "https", hostname: "lh3.googleusercontent.com" },
        { protocol: "https", hostname: "lh4.googleusercontent.com" },
        { protocol: "https", hostname: "lh5.googleusercontent.com" },
        { protocol: "https", hostname: "lh6.googleusercontent.com" },
        { protocol: "https", hostname: "res.cloudinary.com" },
        { protocol: "https", hostname: "**.supabase.co" },
        { protocol: "https", hostname: "motorprime.com.br", },
        { protocol: "https", hostname: "m.media-amazon.com", },
        { protocol: "https", hostname: "images.unsplash.com", },  
        { protocol: "https", hostname: "supabase.co", },
        { protocol: "https", hostname: "images.kabum.com.br", }, { protocol: "https", hostname: "motorprime.com.br",}
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
