import { formatDistanceToNow, format } from "date-fns";
import { motion } from "framer-motion";

interface TimelineItemProps {
  item: {
    id: string;
    name?: string;
    body: string;
    updatedAt?: Date | string;
  };
  index: number;
  showDate?: boolean;
}

export const TimelineItem = ({ item, index, showDate = true }: TimelineItemProps) => {
  const date = item.updatedAt ? new Date(item.updatedAt) : null;
  const relativeDate = date ? formatDistanceToNow(date, { addSuffix: true }) : null;
  const fallbackDate = date ? format(date, "MMM yyyy") : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex gap-6 md:gap-8 py-6 border-b border-slate-100 last:border-b-0"
    >
      {/* Timeline rail + dot */}
      <div className="relative flex flex-col items-center shrink-0">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 w-px bg-slate-200 group-first:top-3 group-last:bottom-3"
        />
        <span
          aria-hidden="true"
          className="relative z-10 w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white group-hover:border-amber-700 group-hover:bg-amber-700 transition-colors duration-200 mt-3"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          {item.name && (
            <span className="font-serif text-base md:text-lg font-medium text-slate-900 shrink-0">
              {item.name}:
            </span>
          )}
          <div
            className="prose prose-sm md:prose-base max-w-none text-slate-700
                       prose-p:my-0 prose-p:leading-relaxed inline
                       prose-strong:text-slate-900
                       prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        </div>
        {showDate && relativeDate && (
          <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-400">
            Added {relativeDate} · {fallbackDate}
          </p>
        )}
      </div>
    </motion.div>
  );
};
