/**
 * @fileoverview Admin dashboard for viewing and managing feedback
 * Protected route that displays submitted feedback with sorting capabilities
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Types
interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * AdminPage component
 * Features:
 * - Fetches and displays feedback entries
 * - Sortable by date
 * - Animated feedback cards
 * - Error handling with toast notifications
 */
export default function AdminPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Animation variants for feedback cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback?auth=1234");
        if (!response.ok) throw new Error("Failed to fetch feedback");
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive",
        });
      }
    };

    fetchFeedback();
  }, [toast]);

  // Sort feedback entries by date
  const sortedFeedback = [...feedback].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Feedback Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2"
            aria-label={`Sort by date ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by Date
          </Button>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {sortedFeedback.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-lg bg-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex" aria-label={`Rating: ${item.rating} stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < item.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.comment}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}