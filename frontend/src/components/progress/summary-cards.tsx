"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface SummaryCardsProps {
  imported: number;
  skipped: number;
  processing: number;
  total: number;
}

export function SummaryCards({ imported, skipped, processing, total }: SummaryCardsProps) {
  const cards = [
    {
      label: "Imported",
      value: imported,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Skipped",
      value: skipped,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 4 15 12 5 20 5 4" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      ),
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Processing",
      value: processing,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0075de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ),
      bgColor: "bg-sky-tint",
      textColor: "text-notion-blue",
    },
    {
      label: "Total Rows",
      value: total,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      bgColor: "bg-gray-50",
      textColor: "text-charcoal",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="text-center">
            <div className={`w-10 h-10 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              {card.icon}
            </div>
            <p className="text-2xl font-semibold text-ink-black">{card.value.toLocaleString()}</p>
            <p className="text-xs text-stone mt-1">{card.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
