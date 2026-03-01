import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StatCardsSkeleton() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={fadeUp}>
          <Card className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-3 w-24 bg-muted/10" />
              <Skeleton className="h-7 w-7 rounded-md bg-muted/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-28 bg-muted/10" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="bg-card/5 border-border/10 lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-muted/10" />
          <Skeleton className="h-4 w-32 bg-muted/10" />
        </div>
        <Skeleton className="h-3 w-20 mt-1 bg-muted/10" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-lg bg-muted/10" />
          ))}
        </div>
        <div className="h-64 flex items-end gap-1 px-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t bg-primary/5"
              style={{ height: `${30 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PieSkeleton() {
  return (
    <Card className="bg-card/5 border-border/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-muted/10" />
          <Skeleton className="h-4 w-36 bg-muted/10" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-64">
        <Skeleton className="h-40 w-40 rounded-full bg-muted/10" />
      </CardContent>
    </Card>
  );
}

export function ListCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="bg-card/5 border-border/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-4 w-36 bg-muted/10" />
        <Skeleton className="h-6 w-16 bg-muted/10" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-14 rounded bg-muted/10" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32 bg-muted/10" />
                <Skeleton className="h-3 w-20 bg-muted/10" />
              </div>
            </div>
            <Skeleton className="h-4 w-16 bg-muted/10" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
