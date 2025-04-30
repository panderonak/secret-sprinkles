import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import messages from "@/types/messages.json";

const firstRow = messages.slice(0, messages.length / 2);
const secondRow = messages.slice(messages.length / 2);

const ReviewCard = ({
  content,
  received,
}: {
  content: string;
  received: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <p className="text-xs font-medium dark:text-white/40">{content}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{received}</blockquote>
    </figure>
  );
};

export function MarqueeSection() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((message) => (
          <ReviewCard key={message.id} {...message} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((message) => (
          <ReviewCard key={message.id} {...message} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
