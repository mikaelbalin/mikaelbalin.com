import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise });

  const { docs: redirects } = await payload.find({
    collection: "redirects",
    depth,
    limit: 0,
    pagination: false,
  });

  return redirects;
}

export const getCachedRedirects = cache(getRedirects);
