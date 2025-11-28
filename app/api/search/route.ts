import { NextResponse } from "next/server";
import gplay from "google-play-scraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("term");
  const platform = searchParams.get("platform") || "all"; // 'all', 'ios', 'android'
  const limit = parseInt(searchParams.get("limit") || "5"); // Default limit 5

  if (!query) {
    return NextResponse.json({ error: "Query term is required" }, { status: 400 });
  }

  try {
    const promises = [];

    // Apple Search
    if (platform === "all" || platform === "ios") {
      promises.push(
        fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=${limit}`)
          .then((res) => res.json())
          .then((data) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.results.map((app: any) => ({
              id: app.trackId,
              name: app.trackName,
              icon: app.artworkUrl100,
              platform: "ios",
              developer: app.artistName,
              description: app.description,
              screenshots: app.screenshotUrls,
              url: app.trackViewUrl,
            }))
          )
          .catch((e) => {
            console.error("Apple Search Error", e);
            return [];
          })
      );
    }

    // Google Play Search
    if (platform === "all" || platform === "android") {
      promises.push(
        // @ts-expect-error - types missing
        gplay
          .search({ term: query, num: limit })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((results: any[]) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            results.map((app: any) => ({
              id: app.appId,
              name: app.title,
              icon: app.icon,
              platform: "android",
              developer: app.developer,
              description: app.summary, 
              screenshots: [], // Search results often lack screenshots
              url: app.url || `https://play.google.com/store/apps/details?id=${app.appId}`
            }))
          )
          .catch((e: any) => {
            console.error("Google Play Search Error", e);
            return [];
          })
      );
    }

    const results = await Promise.all(promises);
    const flatResults = results.flat();

    return NextResponse.json(flatResults);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

