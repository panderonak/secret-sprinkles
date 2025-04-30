import { MarqueeSection } from "@/components/custom/MarqueeSection";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex-grow flex flex-col items-center justify-center py-16">
        <section className="text-center max-h-screen py-10 mb-16 rounded-3xl bg-accent-foreground">
          <h1 className="text-4xl md:text-6xl text-[#101010] font-extrabold leading-snug">
            Discover What Others Think —{" "}
            <span className="text-[#8c8c8c] font-medium">Anonymously.</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-[#081108]">
            Ever wondered what people really think? Invite friends, colleagues,
            or followers to send you anonymous messages—honestly, thoughtfully,
            or just for fun.
          </p>

          <div className="mt-5 mx-auto w-full max-w-lg">
            <Image
              src="/communication.svg"
              alt="Person reading anonymous notes illustration"
              width={600}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        <section id="how-it-works" className="w-full mt-20 py-12 text-gray-100">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            See What People Are Saying — Anonymously!
          </h2>
          <p className="max-w-2xl mx-auto text-center text-gray-400 mb-8">
            Curious what people would say if they could speak freely? Here’s a
            sneak peek at the kinds of anonymous messages people are sending and
            receiving every day.
          </p>

          <div className="mx-auto w-full">
            <MarqueeSection />
          </div>
        </section>
      </main>
      <footer className="text-white text-center px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-sm md:text-base">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold">Secret Sprinkles</span>. All rights
            reserved.
          </p>
          <p className="text-sm md:text-base flex justify-center items-center gap-1">
            Made with
            <Heart className="fill-red-500 h-5 w-5" aria-label="love" />
            by the <span className="font-semibold">True Feedback</span> team.
          </p>
        </div>
      </footer>
    </div>
  );
}
