
import Link from "next/link";
import HeroCell from "@/components/bento/HeroCell";
import PhilosophyCell from "@/components/bento/PhilosophyCell";
import BlockchainCell from "@/components/bento/BlockchainCell";
import AIInsightsCell from "@/components/bento/AIInsightsCell";
import InvestingCell from "@/components/bento/InvestingCell";
import PortalCell from "@/components/bento/PortalCell";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;

export default async function HomePage() {

  const posts = await getPublishedPosts();

  return (
    <div className="space-y-8">
      <section className="border-b border-[var(--border-subtle)] pb-6">
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 font-sans text-text-secondary">
          Technology (left) · Humanity & capital (right). Click a cell to explore.
        </p>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <Link
          href="/sheshin-notes"
          className="group cursor-pointer block col-span-1 md:col-span-2"
        >
          <div className="h-full flex flex-col justify-between rounded border border-cyan-400/70 animate-hero-heartbeat">
            <HeroCell asChild />
          </div>
        </Link>
        <div className="col-span-1 h-full">
          <div className="h-full flex flex-col justify-between">
            <AIInsightsCell postCount={posts.length} />
          </div>
        </div>
        <div className="col-span-1 h-full">
          <div className="h-full flex flex-col justify-between">
            <PhilosophyCell />
          </div>
        </div>
        <div className="col-span-1 h-full">
          <div className="h-full flex flex-col justify-between">
            <BlockchainCell />
          </div>
        </div>
        <div className="col-span-1 h-full">
          <div className="h-full flex flex-col justify-between">
            <InvestingCell />
          </div>
        </div>

        {/* Portal - External Armory Link */}
        <div className="col-span-1 md:col-span-2">
          <PortalCell />
        </div>
      </div>
    </div>
  );
}
