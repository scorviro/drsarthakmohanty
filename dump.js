const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../dr-sarthak-website2');

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

function cleanHtml(html) {
  // 1. Remove all Next.js specific script tags
  let cleaned = html.replace(/<script[^>]*src="\/_next\/[^"]+"[^>]*><\/script>/g, '');
  cleaned = cleaned.replace(/<script[^>]*id="__NEXT_DATA__"[^>]*>[\s\S]*?<\/script>/g, '');
  cleaned = cleaned.replace(/<script[^>]*src="\/_next\/static\/chunks\/[^"]+"[^>]*><\/script>/g, '');
  cleaned = cleaned.replace(/<script[^>]*>(\(self\.webpackChunk[\s\S]*?|\(self\.__next_f[\s\S]*?)<\/script>/g, '');
  cleaned = cleaned.replace(/<link[^>]*rel="preload"[^>]*href="\/_next\/[^"]+"[^>]*>/g, '');
  cleaned = cleaned.replace(/<link[^>]*rel="stylesheet"[^>]*href="\/_next\/[^"]+"[^>]*>/g, '');
  
  // Remove the Next.js dev client scripts
  cleaned = cleaned.replace(/<script[^>]*src="[^"]*webpack[^"]*"[^>]*><\/script>/g, '');
  cleaned = cleaned.replace(/<script[^>]*src="[^"]*fast-refresh[^"]*"[^>]*><\/script>/g, '');

  // 2. Replace stylesheets link with our unified tailwind.css
  const headEndIndex = cleaned.indexOf('</head>');
  if (headEndIndex !== -1) {
    const headInject = `
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  <!-- Google Identity Services -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <!-- GSAP & Lenis CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js"></script>

  <!-- CSS -->
  <link rel="stylesheet" href="assets/css/tailwind.css">
    `;
    cleaned = cleaned.slice(0, headEndIndex) + headInject + cleaned.slice(headEndIndex);
  }

  // 3. Inject our own static JS files before </body>
  const bodyEndIndex = cleaned.lastIndexOf('</body>');
  if (bodyEndIndex !== -1) {
    const bodyInject = `
  <!-- Scripts -->
  <script src="assets/js/reviews-auth.js" defer></script>
  <script src="assets/js/navbar.js" defer></script>
  <script src="assets/js/booking.js" defer></script>
  <script src="assets/js/faq.js" defer></script>
  <script src="assets/js/smooth-scroll.js" defer></script>
  <script src="assets/js/statistics.js" defer></script>
  <script src="assets/js/animations.js" defer></script>
    `;
    cleaned = cleaned.slice(0, bodyEndIndex) + bodyInject + cleaned.slice(bodyEndIndex);
  }

  return cleaned;
}

async function run() {
  console.log('Compiling Tailwind CSS using local tailwind CLI...');
  try {
    execSync('npx tailwindcss -i app/globals.css -o ../dr-sarthak-website2/assets/css/tailwind.css --minify', { stdio: 'inherit' });
    console.log('Tailwind compilation successful.');
  } catch (err) {
    console.error('Tailwind compilation failed:', err.message);
  }

  console.log('Fetching Home Page HTML from http://localhost:3000/...');
  const homeHtml = await fetchUrl('http://localhost:3000/');
  const cleanedHome = cleanHtml(homeHtml);
  fs.writeFileSync(path.join(targetDir, 'index.html'), cleanedHome);
  console.log('Saved index.html');

  console.log('Fetching Contact Page HTML from http://localhost:3000/contact...');
  let contactHtml = '';
  try {
    contactHtml = await fetchUrl('http://localhost:3000/contact');
    const cleanedContact = cleanHtml(contactHtml);
    // Replace assets paths in contact page since it might be relative
    // For contact.html, assets are in the same relative level.
    fs.writeFileSync(path.join(targetDir, 'contact.html'), cleanedContact);
    console.log('Saved contact.html');
  } catch (e) {
    console.error('Failed to fetch contact page:', e.message);
  }

  console.log('Done!');
}

run().catch(console.error);
