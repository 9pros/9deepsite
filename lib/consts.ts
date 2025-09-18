export const defaultHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>AI Website Builder - Ready to Create</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  </head>
  <body class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
    <!-- Hero Section -->
    <div class="flex justify-center items-center min-h-screen px-6">
      <div class="text-center max-w-4xl">
        <!-- Animated Badge -->
        <div class="inline-flex items-center bg-purple-500/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-purple-500/20" data-aos="fade-down">
          <span class="relative flex h-2 w-2 mr-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span class="text-purple-300 text-sm font-medium">AI-Powered Website Generation</span>
        </div>
        
        <!-- Main Heading with Gradient -->
        <h1 class="text-5xl lg:text-7xl font-bold mb-6" data-aos="fade-up">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Ready to Build
          </span>
          <br>
          <span class="text-white text-3xl lg:text-5xl">Your Dream Website</span>
        </h1>
        
        <!-- Description -->
        <p class="text-gray-400 text-lg lg:text-xl mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Describe your business or paste a URL to redesign. I'll create a stunning, modern website with advanced features like multi-step forms, animations, and more.
        </p>
        
        <!-- Feature Pills -->
        <div class="flex flex-wrap gap-3 justify-center mb-12" data-aos="fade-up" data-aos-delay="200">
          <span class="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">✨ Typing Animations</span>
          <span class="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">📝 Multi-Step Forms</span>
          <span class="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm">🎨 Modern Layouts</span>
          <span class="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm">🖼️ Smart Images</span>
        </div>
        
        <!-- CTA -->
        <div class="flex items-center justify-center gap-4" data-aos="zoom-in" data-aos-delay="300">
          <svg class="w-6 h-6 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          <span class="text-gray-500">Start by entering a prompt below</span>
          <svg class="w-6 h-6 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="fixed top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="fixed top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="fixed bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
    
    <style>
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    </style>
    
    <script>
      AOS.init({
        duration: 1000,
        once: true
      });
    </script>
  </body>
</html>
`;
