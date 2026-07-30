# Image Directory Structure

This directory holds static image assets for the LMS application. All assets here are accessible publicly from `/images/...`.

## Directory Overview

- **`logos/`**: Brand logos, header/footer logos, partner/institution logos.
- **`banners/`**: Hero section banners, promotional carousels, announcement sliders.
- **`courses/`**: Course thumbnails, module covers, subject illustrations.
- **`teachers/`**: Instructor profile images and bio photos.
- **`avatars/`**: Default user, student, and admin avatars.
- **`gallery/`**: Event photos, lab activity pictures, achievement showcases.
- **`icons/`**: Custom UI icons, badges, certification icons (PNG/SVG).
- **`placeholders/`**: Default image placeholders when images fail to load or are dynamic draft content.
- **`bg/`**: Background patterns, subtle textures, hero overlays.

## Recommended Guidelines & Naming Conventions

1. **File Names**: Use lowercase kebab-case for filenames (e.g., `hero-banner-science.webp`, `default-avatar.png`).
2. **Formats**:
   - Use WebP (`.webp`) or AVIF (`.avif`) for photos and banners (optimized for performance).
   - Use SVG (`.svg`) for vector graphics and logos.
   - Use PNG (`.png`) for transparent graphics.
3. **Usage in Next.js**:
   ```tsx
   import Image from 'next/image';

   <Image 
     src="/images/courses/physics-101.webp" 
     alt="Physics Course" 
     width={400} 
     height={250} 
   />
   ```
