import { NextResponse } from "next/server";
import gplay from "google-play-scraper";
import puppeteer from "puppeteer";

// Helper to extract App Store ID
const getAppStoreId = (url: string) => {
  const match = url.match(/\/id(\d+)/);
  return match ? match[1] : null;
};

// Helper to extract ID from Google Play URL
const getGooglePlayId = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("id");
  } catch {
    // Fallback regex if URL parsing fails
    const match = url.match(/id=([a-zA-Z0-9\._]+)/);
    return match ? match[1] : null;
  }
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Handle Apple App Store (Puppeteer Scraping)
    if (url.includes("apps.apple.com")) {
      const appId = getAppStoreId(url);

      // STRATEGY 1: Try Official iTunes API (Fastest & Most Reliable)
      if (appId) {
        try {
          const response = await fetch(
            `https://itunes.apple.com/lookup?id=${appId}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const app: any = data.results[0];

            // Only return if we actually have screenshots
            if (app.screenshotUrls && app.screenshotUrls.length > 0) {
              return NextResponse.json({
                title: app.trackName,
                description: app.description,
                logo: app.artworkUrl512 || app.artworkUrl100,
                screenshots: app.screenshotUrls,
                markdown: app.description,
                images: app.screenshotUrls,
              });
            }
            // If API has no screenshots, fall through to Puppeteer
            console.log(
              "iTunes API missing screenshots, falling back to scraper..."
            );
          }
        } catch (e) {
          console.warn("iTunes API lookup failed, falling back to scraper", e);
        }
      }

      // STRATEGY 2: Puppeteer Fallback (Slower, for when API fails)
      let browser = null;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--window-size=1920,1080",
          ],
          defaultViewport: { width: 1920, height: 1080 },
        });
        const page = await browser.newPage();

        await page.setUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        // Aggressive Auto-scroll to ensure lazy-loaded images appear
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 200; // Increased distance
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight || totalHeight > 5000) {
                // Increased limit
                clearInterval(timer);
                resolve(true);
              }
            }, 100);
          });
        });

        const data = await page.evaluate(() => {
          const getMeta = (name: string) =>
            document
              .querySelector(`meta[name="${name}"]`)
              ?.getAttribute("content") ||
            document
              .querySelector(`meta[property="${name}"]`)
              ?.getAttribute("content");

          const title =
            document.querySelector("h1")?.innerText.split("\n")[0].trim() ||
            document.title;

          let description =
            (document.querySelector(".app-header__subtitle") as HTMLElement)
              ?.innerText ||
            getMeta("description") ||
            "";

          if (!description) {
            const descElem = document.querySelector(
              ".section__description .we-clamp"
            );
            if (descElem) description = (descElem as HTMLElement).innerText;
          }

          let logo = "";
          const iconImg =
            document.querySelector(".app-header__icon img") ||
            document.querySelector("picture.we-artwork--round source");

          if (iconImg) {
            if (iconImg.tagName === "SOURCE") {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              logo = (iconImg as any).srcset?.split(",")[0]?.split(" ")[0];
            } else {
              logo = (iconImg as HTMLImageElement).src;
            }
          }
          if (!logo) logo = getMeta("og:image") || "";

          // Extract Screenshots - Robust Strategy
          const images: string[] = [];

          // 1. Try known containers
          let pictureElements = Array.from(
            document.querySelectorAll(
              "ul[class*='shelf-grid__list'] picture, .we-screenshot-viewer__screenshots picture, .artwork-container picture"
            )
          );

          // 2. If none found, try a broader search for large images in the main content
          if (pictureElements.length === 0) {
            pictureElements = Array.from(
              document.querySelectorAll("main picture")
            );
          }

          pictureElements.forEach((picture) => {
            const sources = picture.querySelectorAll("source");
            let bestUrl = "";
            let maxWidth = 0;

            sources.forEach((source) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const srcset = (source as any).srcset;
              if (srcset) {
                const candidates = srcset.split(",").map((s: string) => {
                  const parts = s.trim().split(" ");
                  return { url: parts[0], width: parseInt(parts[1] || "0") };
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                candidates.sort((a: any, b: any) => b.width - a.width);
                if (candidates[0] && candidates[0].width > maxWidth) {
                  maxWidth = candidates[0].width;
                  bestUrl = candidates[0].url;
                }
              }
            });

            if (!bestUrl) {
              const img = picture.querySelector("img");
              if (img) {
                bestUrl = img.currentSrc || img.src;
                if (!maxWidth) {
                  maxWidth =
                    img.naturalWidth ||
                    parseInt(img.getAttribute("width") || "0") ||
                    0;
                }
              }
            }

            // Filter:
            // - Must exist
            // - Not a 1x1 spacer
            // - Not the logo (if we found one)
            // - Not already added
            // - Must be reasonably large (e.g. width > 200) to filter icons
            if (
              bestUrl &&
              !bestUrl.includes("1x1.gif") &&
              bestUrl !== logo &&
              !images.includes(bestUrl) &&
              maxWidth > 200
            ) {
              images.push(bestUrl);
            }
          });

          return { title, description, logo, images };
        });

        await browser.close();

        return NextResponse.json({
          title: data.title,
          description: data.description,
          logo: data.logo,
          screenshots: data.images,
          markdown: data.description,
          images: data.images,
        });
      } catch (error) {
        console.error("Puppeteer Error:", error);
        if (browser) await browser.close();
        return NextResponse.json(
          { error: "Failed to scrape App Store" },
          { status: 500 }
        );
      }
    }

    // 2. Handle Google Play Store
    if (url.includes("play.google.com")) {
      const appId = getGooglePlayId(url);
      if (!appId) {
        return NextResponse.json(
          { error: "Invalid Google Play URL" },
          { status: 400 }
        );
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const app: any = await gplay.app({ appId: appId });

        return NextResponse.json({
          title: app.title,
          description: app.description,
          logo: app.icon,
          screenshots: app.screenshots,
          markdown: app.descriptionHTML || app.description,
          images: app.screenshots || [],
        });
      } catch (error) {
        console.error("Google Play Scraper Error:", error);
        return NextResponse.json(
          { error: "Failed to fetch from Google Play" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Unsupported URL. Please use Apple App Store or Google Play Store.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
