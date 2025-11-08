# Performance Optimization Guide

This guide documents performance optimizations for TerraTraks, with a focus on achieving Lighthouse scores > 90.

## Landing Page Optimizations

### 1. Server Components
- Landing page uses Next.js Server Components (no client-side JavaScript)
- Reduces bundle size and improves initial load time
- No hydration overhead

### 2. Minimal Dependencies
- No third-party scripts on landing page
- No analytics scripts (add only if needed)
- No external fonts beyond Inter (system font fallback)
- SVG icons instead of image files

### 3. Optimized Images
- Uses Next.js Image component when images are needed
- Placeholder images use CSS gradients (no image load)
- Lazy loading for below-the-fold content
- WebP format support via Next.js

### 4. CSS Optimizations
- Tailwind CSS with JIT compilation
- Purged unused styles in production
- Minimal custom CSS
- Inline critical CSS

### 5. Code Splitting
- Route-based code splitting (automatic with Next.js)
- Component lazy loading where appropriate
- Dynamic imports for heavy components

### 6. Caching Strategy
- Static page generation for landing page
- Browser caching headers
- CDN caching (Vercel Edge Network)

## Performance Targets

### Lighthouse Scores
- **Performance**: > 90 (Desktop), > 85 (Mobile)
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Optimization Checklist

### Landing Page
- [x] Server Components (no client JS)
- [x] No third-party scripts
- [x] SVG icons (no image files)
- [x] Minimal CSS
- [x] Static generation
- [x] Optimized fonts (Inter with system fallback)
- [x] No unnecessary components

### Images
- [ ] Use Next.js Image component
- [ ] Optimize image formats (WebP)
- [ ] Lazy load below-fold images
- [ ] Use appropriate image sizes
- [ ] Provide alt text for accessibility

### Fonts
- [x] Use system font stack as fallback
- [x] Preload critical fonts
- [x] Use font-display: swap
- [x] Limit font weights

### JavaScript
- [x] Minimize client-side JavaScript
- [x] Code splitting
- [x] Tree shaking
- [x] Minification in production

### CSS
- [x] Tailwind CSS (JIT)
- [x] Purge unused styles
- [x] Minimal custom CSS
- [x] Critical CSS inlined

## Testing Performance

### Local Testing
```bash
# Build for production
npm run build

# Start production server
npm start

# Test with Lighthouse CLI
npx lighthouse http://localhost:3000 --view
```

### Online Tools
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics for real-time performance monitoring
- Track Core Web Vitals
- Monitor page load times

### Lighthouse CI
- Set up Lighthouse CI for continuous monitoring
- Track performance regressions
- Automated performance testing

## Best Practices

### 1. Minimize HTTP Requests
- Combine CSS files
- Combine JavaScript files
- Use SVG sprites for icons
- Inline small images (data URIs)

### 2. Optimize Assets
- Compress images
- Minify CSS and JavaScript
- Use CDN for static assets
- Enable Gzip/Brotli compression

### 3. Reduce Render-Blocking Resources
- Defer non-critical CSS
- Async load JavaScript
- Inline critical CSS
- Preload critical resources

### 4. Optimize Fonts
- Use system fonts when possible
- Limit font weights
- Preload critical fonts
- Use font-display: swap

### 5. Leverage Browser Caching
- Set appropriate cache headers
- Use service workers
- Cache static assets
- Version assets for cache busting

## Future Optimizations

### Potential Improvements
1. **Service Worker**: Add service worker for offline support
2. **Image Optimization**: Add image optimization API
3. **Font Optimization**: Subset fonts to reduce size
4. **Critical CSS**: Extract and inline critical CSS
5. **Resource Hints**: Add preconnect, prefetch, preload
6. **HTTP/2**: Ensure HTTP/2 support
7. **Compression**: Enable Brotli compression
8. **CDN**: Use CDN for static assets

### Monitoring
- Set up performance budgets
- Track Core Web Vitals
- Monitor bundle sizes
- Alert on performance regressions

## Performance Budget

### Size Limits
- **JavaScript**: < 100KB (gzipped)
- **CSS**: < 50KB (gzipped)
- **Images**: < 500KB per image
- **Total Page Size**: < 1MB

### Load Time Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s

## Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)

