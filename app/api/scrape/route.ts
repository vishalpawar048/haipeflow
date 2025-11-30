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
            const distance = 300;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight || totalHeight > 10000) {
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

    // 3. Generic Web Scraping (Fallback)
    console.log("Attempting generic scrape for:", url);
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
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      );

      // Add extra headers to look like a real browser
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Upgrade-Insecure-Requests": "1",
      });

      // Bypass webdriver check to avoid detection
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
        });
      });

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Get cleaned HTML content to reduce token usage and noise
      const cleanedHtml = await page.evaluate(() => {
        // Remove scripts, styles, and other non-content elements
        const elementsToRemove = [
          "script",
          "style",
          "noscript",
          "iframe",
          "svg",
          "path",
          "footer",
          "nav",
        ];
        elementsToRemove.forEach((tag) => {
          document.querySelectorAll(tag).forEach((el) => el.remove());
        });

        // Get text content with some structure
        return document.body.innerText.substring(0, 50000);
      });

      const data = await page.evaluate(() => {
        // ... (keep existing extraction logic for logo and images)
        const getMeta = (name: string) =>
          document
            .querySelector(`meta[name="${name}"]`)
            ?.getAttribute("content") ||
          document
            .querySelector(`meta[property="${name}"]`)
            ?.getAttribute("content");

        const title =
          document.title ||
          getMeta("og:title") ||
          document.querySelector("h1")?.innerText ||
          "";

        const description =
          getMeta("description") || getMeta("og:description") || "";

        let logo = "";

        // 1. Try JSON-LD (High Fidelity)
        const jsonLdScripts2 = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        );
        for (const script of jsonLdScripts2) {
          try {
            const json = JSON.parse(script.textContent || "{}");
            const check = (obj: any) => {
              if (
                obj &&
                (obj["@type"] === "Organization" || obj["@type"] === "Brand")
              ) {
                if (typeof obj.logo === "string") logo = obj.logo;
                else if (obj.logo && obj.logo.url) logo = obj.logo.url;
              }
            };
            if (Array.isArray(json)) json.forEach(check);
            else check(json);
            if (logo) break;
          } catch (e) {}
        }

        // 2. Try explicit logo selectors (Medium Fidelity)
        if (!logo) {
          const logoImg = document.querySelector(
            "img[id*='logo' i], img[class*='logo' i], img[alt*='logo' i], header img[src*='logo' i]"
          );
          if (logoImg) {
            logo =
              (logoImg as HTMLImageElement).src ||
              (logoImg as HTMLImageElement).getAttribute("src") ||
              "";
          }
        }

        // 3. Try Home Link Image (Heuristic)
        if (!logo) {
          const homeLink = document.querySelector("a[href='/'] img");
          if (homeLink) {
            logo =
              (homeLink as HTMLImageElement).src ||
              (homeLink as HTMLImageElement).getAttribute("src") ||
              "";
          }
        }

        // 4. Fallback to high-res icons
        if (!logo) {
          logo =
            document
              .querySelector("link[rel='apple-touch-icon']")
              ?.getAttribute("href") ||
            document.querySelector("link[rel*='icon']")?.getAttribute("href") ||
            "";
        }

        // 5. Avoid og:image for logo as it's usually a banner.
        if (!logo) {
          logo = getMeta("og:logo") || "";
        }

        // Extract images
        const images: string[] = [];
        const imgElements = Array.from(document.querySelectorAll("img"));

        // Helper to add valid images
        const addImage = (url: string | null | undefined) => {
          if (
            url &&
            !url.startsWith("data:") &&
            !images.includes(url) &&
            !url.endsWith(".svg")
          ) {
            images.push(url);
          }
        };

        // 1. Extract from picture tags (often used for high-res/responsive images)
        const sources = Array.from(document.querySelectorAll("picture source"));
        sources.forEach((source) => {
          const srcset = source.getAttribute("srcset");
          if (srcset) {
            // Get the largest image from srcset (usually the last one or best quality)
            const candidates = srcset
              .split(",")
              .map((s) => s.trim().split(" "));
            // Simple heuristic: take the first URL from the last candidate (often highest res)
            const bestCandidate = candidates[candidates.length - 1];
            if (bestCandidate && bestCandidate[0]) {
              addImage(bestCandidate[0]);
            }
          }
        });

        // 2. Extract from structured data (JSON-LD)
        const jsonLdScripts = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        );
        jsonLdScripts.forEach((script) => {
          try {
            const json = JSON.parse(script.textContent || "{}");
            // Look for Product image
            if (json["@type"] === "Product" && json.image) {
              if (Array.isArray(json.image)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                json.image.forEach((img: any) =>
                  addImage(typeof img === "string" ? img : img.url)
                );
              } else if (typeof json.image === "string") {
                addImage(json.image);
              } else if (json.image.url) {
                addImage(json.image.url);
              }
            }
            // Look for ImageObject
            if (json["@type"] === "ImageObject" && json.url) {
              addImage(json.url);
            }
          } catch (e) {
            console.warn("Failed to parse JSON-LD", e);
          }
        });

        // 3. Standard img tags (fallback/complementary)
        imgElements.forEach((img) => {
          // Try multiple sources for the image URL
          const src =
            img.currentSrc ||
            img.src ||
            img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src") ||
            img.getAttribute("srcset")?.split(" ")[0];
          const width = img.naturalWidth || img.width || 0;
          const height = img.naturalHeight || img.height || 0;

          // More permissive filter: check keywords if dimensions are missing/small
          const isProductImage = (src || "")
            .toLowerCase()
            .match(/product|assets|img|photo|gallery/);

          // Only add if we haven't found enough high-quality images from picture/JSON-LD
          // Or if it's clearly a product image
          if (
            (width > 150 && height > 150) ||
            (isProductImage && width === 0)
          ) {
            addImage(src);
          }
        });

        // 4. Background images
        const divs = Array.from(document.querySelectorAll("div"));
        divs.forEach((div) => {
          const style = window.getComputedStyle(div);
          const bgImage = style.backgroundImage;
          if (bgImage && bgImage !== "none" && bgImage.startsWith("url(")) {
            const url = bgImage.slice(4, -1).replace(/["']/g, "");
            addImage(url);
          }
        });

        // Ensure logo/og:image is included in the images list
        if (logo) {
          addImage(logo);
        }

        return { title, description, logo, images };
      });

      // Take a screenshot for Vision AI fallback
      const screenshotBase64 = await page.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 70,
      });

      await browser.close();

      // Use Gemini to extract structured data from text content
      const { GoogleGenAI } = await import("@google/genai");
      const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const model = "gemini-2.0-flash";
      const textPrompt = `
        Analyze the following website text content.
        Extract the following information in JSON format:
        - title: The specific name of the product or service (prioritize this over the website title).
        - description: A compelling marketing description or selling point (max 2 sentences).
        - type: The specific category or type of product/service (e.g. "SaaS", "Sneakers", "Consulting").

        Website Content:
        ${cleanedHtml}
      `;

      const generateContent = async (prompt: string, imageBase64?: string) => {
        const parts: any[] = [{ text: prompt }];
        if (imageBase64) {
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          });
        }

        const result = await genai.models.generateContent({
          model: model,
          contents: {
            role: "user",
            parts: parts,
          },
          config: {
            responseMimeType: "application/json",
          },
        });

        return result;
      };

      const result = await generateContent(textPrompt);

      // Handle different response structures from Gemini SDK
      const extractText = (res: any) => {
        let text = "";
        // Option 1: result is the response object and has text() method
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res && typeof res.text === "function") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          text = res.text();
        }
        // Option 2: result.response exists and has text() method
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        else if (res.response && typeof res.response.text === "function") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          text = res.response.text();
        }
        // Option 3: Candidates array in result
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        else if (res.candidates && res.candidates.length > 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const parts = res.candidates[0].content?.parts;
          if (parts && parts.length > 0) {
            text = parts[0].text || "";
          }
        }
        // Option 4: Candidates array in result.response
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        else if (
          res.response?.candidates &&
          res.response.candidates.length > 0
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const parts = res.response.candidates[0].content?.parts;
          if (parts && parts.length > 0) {
            text = parts[0].text || "";
          }
        }
        return text;
      };

      const text = extractText(result);
      let aiData: any = {};

      try {
        if (text) {
          aiData = JSON.parse(text);
        }
      } catch (e) {
        console.error("Failed to parse AI response", e);
      }

      // VISION FALLBACK: If title or description are missing or generic, use the screenshot
      if (
        !aiData.title ||
        !aiData.description ||
        aiData.title === "Access Denied" ||
        aiData.title === "Just a moment..."
      ) {
        console.log(
          "Text scraping failed or weak. Attempting Vision AI fallback..."
        );

        const visionPrompt = `
            Look at this screenshot of a product page.
            Extract the following information in JSON format:
            - title: The specific name of the product shown.
            - description: A compelling marketing description based on the visual details (max 2 sentences).
            - type: The specific category of the product (e.g. "Handbag", "Software", "Coffee").
         `;

        // Reuse the screenshotCaptured earlier
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const visionResult = await generateContent(
          visionPrompt,
          screenshotBase64
        );
        const visionText = extractText(visionResult);

        try {
          if (visionText) {
            const visionData = JSON.parse(visionText);
            // Merge vision data, prioritizing it over weak text data
            aiData = { ...aiData, ...visionData };
          }
        } catch (e) {
          console.error("Failed to parse Vision AI response", e);
        }
      }

      // Fix relative URLs for logo
      let logoUrl = data.logo;
      if (logoUrl && !logoUrl.startsWith("http")) {
        try {
          logoUrl = new URL(logoUrl, url).href;
        } catch (e) {
          console.warn("Failed to resolve logo URL", e);
        }
      }

      // Fix relative URLs for images
      const processedImages = data.images.map((img) => {
        if (img && !img.startsWith("http") && !img.startsWith("data:")) {
          try {
            return new URL(img, url).href;
          } catch (e) {
            console.warn("Failed to resolve image URL", e);
            return img;
          }
        }
        return img;
      });

      return NextResponse.json({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        title: aiData.title || data.title || "",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        description: aiData.description || data.description || "",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type: aiData.type || "",
        logo: logoUrl,
        screenshots: processedImages.slice(0, 10),
        images: processedImages.slice(0, 10),
      });
    } catch (error) {
      console.error("Generic Scraper Error:", error);
      if (browser) await browser.close();
      return NextResponse.json(
        { error: "Failed to scrape website" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
