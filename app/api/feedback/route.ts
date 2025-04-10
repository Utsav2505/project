/**
 * @fileoverview API routes for handling feedback submission and retrieval
 * Implements REST endpoints for the feedback system with basic authentication
 */

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// Validation schema for feedback submission
const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
});

// Constants
const DATA_FILE_PATH = path.join(process.cwd(), "data", "feedback.json");
const AUTH_TOKEN = "1234"; // In production, use environment variables for sensitive data

/**
 * Ensures the data directory and file exist
 * Creates them if they don't exist
 */
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(path.dirname(DATA_FILE_PATH));
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE_PATH));
  }
  
  try {
    await fs.access(DATA_FILE_PATH);
  } catch {
    await fs.writeFile(DATA_FILE_PATH, "[]");
  }
}

/**
 * POST /api/feedback
 * Handles feedback submission
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with the saved feedback or error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);
    
    await ensureDataFileExists();
    
    const feedback = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
    };
    
    const existingData = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf-8"));
    existingData.push(feedback);
    
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Retrieves all feedback entries (protected by basic auth)
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with feedback data or error
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const authToken = url.searchParams.get("auth");
    
    if (authToken !== AUTH_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await ensureDataFileExists();
    const data = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf-8"));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading feedback:", error);
    return NextResponse.json(
      { error: "Failed to read feedback" },
      { status: 500 }
    );
  }
}