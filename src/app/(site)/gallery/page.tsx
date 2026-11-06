import type { Metadata } from "next";
import { EmptyState, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments of Paskorisyuhan" intro="Official photos from the Fun Run, the parade, the tournaments and every celebration in between." />
      <div className="container-page py-14">
        <EmptyState title="The gallery opens after our first event">Official photos will be uploaded by the Batch 2010 media team.</EmptyState>
      </div>
    </>
  );
}
