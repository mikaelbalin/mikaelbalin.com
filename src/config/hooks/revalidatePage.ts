import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath } from "next/cache";
import { Page } from "@/types/payload";

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context, locale },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      const path =
        doc.slug === "home" ? `/${locale}` : `/${locale}/${doc.slug}`;

      payload.logger.info(`Revalidating page at path: ${path}`);

      revalidatePath(path);
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === "published" && doc._status !== "published") {
      const oldPath =
        previousDoc.slug === "home"
          ? `/${locale}`
          : `/${locale}/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old page at path: ${oldPath}`);

      revalidatePath(oldPath);
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context, locale },
}) => {
  if (!context.disableRevalidate) {
    const path =
      doc?.slug === "home" ? `/${locale}` : `/${locale}/${doc?.slug}`;
    revalidatePath(path);
  }

  return doc;
};
