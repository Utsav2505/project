/**
 * @fileoverview Main feedback submission page component
 * Implements a user-friendly form for collecting feedback with animations
 */

"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

// Type for form data
type FeedbackFormData = z.infer<typeof formSchema>;

/**
 * Home component - Feedback submission form
 * Features:
 * - Interactive star rating
 * - Form validation
 * - Submission handling
 * - Loading states
 * - Success/error notifications
 */
export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  /**
   * Handles form submission
   * @param {FeedbackFormData} data - The form data to submit
   */
  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for the form container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Share Your Feedback
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <Input
              {...register("name")}
              placeholder="Your Name"
              className="bg-background/50"
              aria-label="Your name"
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setValue("rating", star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredStar || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-destructive text-sm text-center">
              Please select a rating
            </p>
          )}

          {/* Comment Textarea */}
          <div>
            <Textarea
              {...register("comment")}
              placeholder="Your feedback..."
              className="bg-background/50 min-h-[120px]"
              aria-label="Your feedback"
            />
            {errors.comment && (
              <p className="text-destructive text-sm mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Submitting feedback..." : "Submit feedback"}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
              />
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}