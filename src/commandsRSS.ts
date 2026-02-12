import { fetchFeed } from "./rss/feed";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feedUrl = "https://www.wagslane.dev/index.xml";

    const rssFeed = await fetchFeed(feedUrl);

    console.log(rssFeed);
}