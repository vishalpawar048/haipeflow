import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let html = "";

    // Attempt to use Puppeteer for dynamic content (better for App Store, SPAs)
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set a realistic User-Agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        html = await page.content();
        await browser.close();
    } catch (puppeteerError) {
        console.warn("Puppeteer failed, falling back to fetch:", puppeteerError);
        // Fallback to simple fetch if Puppeteer fails
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });
        
        if (!response.ok) {
             return NextResponse.json(
                { error: "Failed to fetch URL" },
                { status: response.status }
            );
        }
        html = await response.text();
    }

    const $ = cheerio.load(html);

    // Remove scripts, styles, and other unnecessary elements
    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("footer").remove();
    $("iframe").remove();
    $("noscript").remove();

    // Initialize Turndown service
    const turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });

    const markdown = turndownService.turndown($("body").html() || "");
    
    // Extract images
    const images = new Set<string>(); // Use Set to avoid duplicates
    
    const addImage = (src: string | undefined) => {
       if (src && !src.startsWith("data:")) {
          try {
            const absoluteUrl = new URL(src, url).href;
            // Filter out small icons/pixels if possible (simple heuristic)
            if (!absoluteUrl.includes("pixel") && !absoluteUrl.includes("analytics")) {
               images.add(absoluteUrl);
            }
          } catch {
            // Ignore invalid URLs
          }
       }
    }

    // 1. Standard IMG tags (including lazy loading attributes)
    $("img").each((_, element) => {
      const img = $(element);
      addImage(img.attr("src"));
      addImage(img.attr("data-src"));
      addImage(img.attr("data-original")); // Common lazy load
      addImage(img.attr("data-lazy-src")); // Common lazy load
      
      // Handle srcset
      const srcset = img.attr("srcset") || img.attr("data-srcset");
      if (srcset) {
         const firstSrc = srcset.split(",")[0]?.trim().split(" ")[0];
         addImage(firstSrc);
      }
    });

    // 2. Open Graph & Twitter Images (High quality)
    $('meta[property="og:image"]').each((_, el) => addImage($(el).attr("content")));
    $('meta[property="twitter:image"]').each((_, el) => addImage($(el).attr("content")));
    $('meta[name="twitter:image"]').each((_, el) => addImage($(el).attr("content")));

    // 3. Link Icons (Favicons/Apple Touch Icons)
    $('link[rel="icon"]').each((_, el) => addImage($(el).attr("href")));
    $('link[rel="shortcut icon"]').each((_, el) => addImage($(el).attr("href")));
    $('link[rel="apple-touch-icon"]').each((_, el) => addImage($(el).attr("href")));

    // 4. Picture Source Tags
    $("picture source").each((_, el) => {
        const srcset = $(el).attr("srcset");
        if (srcset) {
            const firstSrc = srcset.split(",")[0]?.trim().split(" ")[0];
            addImage(firstSrc);
        }
    });

    // 5. Background images in style attributes
    $("*[style]").each((_, element) => {
        const style = $(element).attr("style");
        if (style && style.includes("background-image")) {
             const match = style.match(/url\(['"]?(.*?)['"]?\)/);
             if (match && match[1]) {
                 addImage(match[1]);
             }
        }
    });

    return NextResponse.json({
      markdown,
      images: Array.from(images),
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape URL" },
      { status: 500 }
    );
  }
}
