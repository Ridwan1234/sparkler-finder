import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const TestimonialCard = ({ tItem, i }: { tItem: Testimonial; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotateY: -5 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="bg-card border border-border rounded-xl p-8 relative group hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-default min-w-[320px] md:min-w-[380px] flex-shrink-0"
  >
    <div className="absolute top-4 right-4 opacity-[0.08]">
      <Quote size={48} className="text-primary" />
    </div>
    <div className="flex gap-1 mb-4">
      {Array.from({ length: tItem.rating }).map((_, j) => (
        <Star key={j} size={16} className="fill-gold text-gold" />
      ))}
    </div>
    <p className="text-muted-foreground mb-6 text-sm leading-relaxed relative z-10">"{tItem.text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-bold text-sm">{tItem.name[0]}</span>
      </div>
      <div>
        <p className="font-semibold text-sm">{tItem.name}</p>
        <p className="text-muted-foreground text-xs">{tItem.role}</p>
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  useEffect(() => {
    setShouldScroll(testimonials.length > 3);
  }, [testimonials]);

  // Duplicate items for seamless infinite scroll
  const displayItems = shouldScroll ? [...testimonials, ...testimonials] : testimonials;

  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("testimonials.label")}</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("testimonials.title")}</h2>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[220px] rounded-xl" />
            ))}
          </div>
        ) : !shouldScroll ? (
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <TestimonialCard key={tItem.id} tItem={tItem} i={i} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 animate-marquee-testimonials"
              style={{
                width: "max-content",
              }}
            >
              {displayItems.map((tItem, i) => (
                <TestimonialCard key={`${tItem.id}-${i}`} tItem={tItem} i={0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
