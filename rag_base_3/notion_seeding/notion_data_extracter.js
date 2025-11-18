import { NotionAPILoader } from "@langchain/community/document_loaders/web/notionapi";
import "dotenv/config";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VERSION = "2022-06-28";

// Searching all the pages in the given notion workspace based on provided notion integration token
async function searchAllPages({ pageSize = 100 } = {}) {
  const url = "https://api.notion.com/v1/search";
  const headers = {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

    let start_cursor;
  const allPages = [];

  do {
    const body = {
      filter: { value: "page", property: "object" }, // only pages
      page_size: pageSize, // max 100
      ...(start_cursor ? { start_cursor } : {}),
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion search failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    // data.results includes only items shared with this integration
    allPages.push(...data.results.map((p) => p.id));
    start_cursor = data.has_more ? data.next_cursor : undefined;
  } while (start_cursor);

  // Optional: map to a lean structure (id + plain title)
  // const pagesLean = allPages.map((p) => ({
  //   id: p.id,
  //   // For database pages, title is in properties; for standalone pages, use "title" property if present.
  //   title:
  //     p.properties?.title?.title?.map((t) => t.plain_text).join("") ??
  //     p.properties?.Name?.title?.map((t) => t.plain_text).join("") ??
  //     p?.icon?.emoji ??
  //     "",
  //   url: p.url,
  // }));

  // return pagesLean;
  return allPages;
}
//  test code for searchAllPages function
// (async () => {
//   try {
//     const pages = await searchAllPages();
//     console.log("Total pages:", pages.length);
//     console.log(pages.slice(0, 5));
//   } catch (e) {
//     console.error(e);
//   }
// })();


import pLimit from "p-limit";
import { setTimeout as delay } from "timers/promises";
// import { NotionAPILoader } from "@langchain/community/document_loaders/web/notionapi";

const pages = await searchAllPages();
const pageIds = pages;

const limit = pLimit(8); // try 5–10; tune based on errors/latency

async function loadOnePage(id, attempt = 1) {
  const loader = new NotionAPILoader({
    clientOptions: { auth: NOTION_TOKEN },
    id,
    type: "page",
  });
  try {
    const docs = await loader.load();
    // console.log('Page docs for', id, docs);
    // console.log(docs);
    return docs ?? null;
  } catch (err) {
    // Handle 429 and transient 5xx with backoff
    const isRetryable = err.status === 429 || (err.status >= 500 && err.status < 600);
    if (isRetryable && attempt <= 5) {
      const backoffMs = Math.min(30000, 500 * 2 ** (attempt - 1));
      await delay(backoffMs);
      return loadOnePage(id, attempt + 1);
    }
    console.error("Failed id", id, "attempt", attempt, err);
    return null;
  }
}

export async function loadAllPages() {
  const tasks = pageIds.map((id) => limit(() => loadOnePage(id)));
  const results = [];
  let completed = 0;

  for (const task of tasks) {
    const doc = await task;
    if (doc && doc.length > 0){
       results.push(doc)
      };
    completed++;
    if (completed % 100 === 0) {
      console.log(`Loaded ${completed}/${ids.length}`);
      // Persist partial results here if needed
    }
  }
  return results.flat();
}

// loadAllPages(pageIds).then((docs) => {
//   console.log("Loaded docs:", docs.length);
//   for (const doc of docs){
//     // console.log(`==================================Document ${i}===========================================`);
//     console.log(doc.metadata);
//   }
//   // console.log(docs.flat())
// });










// const PAGE_ID = process.env.PAGE_ID
// Loading a page (including child pages all as separate documents)
// console.log(process.env.NOTION_TOKEN);
// export async function pageLoader() {
//   const pageLoader = new NotionAPILoader({
//     clientOptions: {
//       auth: NOTION_TOKEN,
//     },
//     id: "2a53ac746cc9808c9d54d53df7227a81", // Replace with your Notion page ID
//     type: "page",
//   });
//   const pageDocs = await pageLoader.load();
//   return pageDocs;
// }

// const x = await pageLoader();
// console.log(x);

// const splitter = new RecursiveCharacterTextSplitter();

// Load the documents
// console.log(pageDocs)
// console.log("---------------------------------------------------------------------------------------------")
// console.log(pageDocs[1].metadata.parent)
// console.log("---------------------------------------------------------------------------------------------")
// console.log(pageDocs[1].id)
// Split the documents using the text splitter
// const splitDocs = await splitter.splitDocuments(pageDocs);

// // console.log({ splitDocs });
// const single_chunk = splitDocs[1];
// console.log(single_chunk); // Check entire object

// if(single_chunk) {
//   console.log(single_chunk.document);
//   console.log(single_chunk.metadata.loc);
// }

// Loading a database (each row is a separate document with all properties as metadata)
// const dbLoader = new NotionAPILoader({
//   clientOptions: {
//     auth: "<NOTION_INTEGRATION_TOKEN>",
//   },
//   id: "<DATABASE_ID>",
//   type: "database",
//   onDocumentLoaded: (current, total, currentTitle) => {
//     console.log(`Loaded Page: ${currentTitle} (${current}/${total})`);
//   },
//   callerOptions: {
//     maxConcurrency: 64, // Default value
//   },
//   propertiesAsHeader: true, // Prepends a front matter header of the page properties to the page contents
// });

// // A database row contents is likely to be less than 1000 characters so it's not split into multiple documents
// const dbDocs = await dbLoader.load();

// console.log({ dbDocs });
