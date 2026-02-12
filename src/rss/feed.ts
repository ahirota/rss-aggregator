import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    // Fetch Raw XML
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator"
        }
    });
    if (!response.ok) {
        throw new Error(`An error occurred while fetching the RSS feed from: ${feedURL}`);
    }
    const text = await response.text();
    
    // Parse XML into RSS Feed Object
    const parser = new XMLParser();
    const parsedXML = parser.parse(text);

    if (!parsedXML.rss) {
        throw new Error(`Invalid RSS Feed`);
    }

    const rssFeed: RSSFeed = parsedXML.rss;

    // Validate RSS Feed
    if (!rssFeed.channel) {
        throw new Error(`Invalid RSS Feed: parsed XML does not contain "channel" property`);
    }
    if (!rssFeed.channel.title || typeof rssFeed.channel.title !== "string") {
        throw new Error(`Invalid RSS Feed: Missing property "title"`);
    }
    if (!rssFeed.channel.link || typeof rssFeed.channel.link !== "string") {
        throw new Error(`Invalid RSS Feed: Missing property "link"`);
    }
    if (!rssFeed.channel.description || typeof rssFeed.channel.description !== "string") {
        throw new Error(`Invalid RSS Feed: Missing property "description"`);
    }
    const metadata = {
        title: rssFeed.channel.title, 
        link: rssFeed.channel.link, 
        description: rssFeed.channel.description
    };

    // Get Feed Items
    const items = Array.isArray(rssFeed.channel.item) ? rssFeed.channel.item : [];
    const extractedItems = [];

    for (const item of items) {
        if (!item.title || typeof item.title !== "string") {
            continue;
        }
        if (!item.link || typeof item.link !== "string") {
            continue;
        }
        if (!item.description || typeof item.description !== "string") {
            continue;
        }
        if (!item.pubDate || typeof item.pubDate !== "string") {
            continue;
        }
        const itemData = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        }
        extractedItems.push(itemData);
    }

    return {
        metadata: metadata,
        items: extractedItems
    };
}