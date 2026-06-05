import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq, desc } from "drizzle-orm";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Define public types compatible with current code
export interface Review {
  reviewId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  title: string;
  treatmentType?: string;
  reviewText: string;
  status: "pending" | "approved" | "rejected";
  isPinned: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  messageText: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface Appointment {
  appointmentId: string;
  name: string;
  phone: string;
  date: string;
  timeSlot?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  isBookingEnabled: boolean;
  contactPhone: string;
  clinicTimings: string;
  showReviews: boolean;
}

export async function getDbReviews(): Promise<Review[]> {
  try {
    const raw = await db.select().from(schema.reviews);
    return raw.map((r) => ({
      ...r,
      treatmentType: r.treatmentType || "",
    })) as Review[];
  } catch (error) {
    console.error("Error reading database reviews:", error);
    return [];
  }
}

export async function upsertReview(
  reviewData: Omit<Review, "reviewId" | "createdAt" | "updatedAt" | "verified" | "isPinned">
): Promise<Review> {
  const now = new Date().toISOString();
  
  // Try to find if user has an existing review that is not anonymous
  let existingReview = null;
  if (reviewData.userId !== "anonymous") {
    const results = await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.userId, reviewData.userId));
    if (results.length > 0) {
      existingReview = results[0];
    }
  }

  if (existingReview) {
    const updatedReview = {
      ...reviewData,
      rating: Number(reviewData.rating),
      updatedAt: now,
    };
    await db
      .update(schema.reviews)
      .set(updatedReview)
      .where(eq(schema.reviews.reviewId, existingReview.reviewId));
    
    return {
      ...existingReview,
      ...updatedReview,
    } as Review;
  } else {
    const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newReview = {
      reviewId: newId,
      userId: reviewData.userId,
      name: reviewData.name,
      email: reviewData.email,
      avatar: reviewData.avatar,
      rating: Number(reviewData.rating),
      title: reviewData.title,
      treatmentType: reviewData.treatmentType || "",
      reviewText: reviewData.reviewText,
      status: reviewData.status,
      isPinned: false,
      verified: true,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(schema.reviews).values(newReview);
    return newReview as Review;
  }
}

export async function deleteReviewFromDb(reviewId: string): Promise<boolean> {
  try {
    await db.delete(schema.reviews).where(eq(schema.reviews.reviewId, reviewId));
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
}

export async function togglePinInDb(reviewId: string): Promise<Review | null> {
  try {
    const results = await db.select().from(schema.reviews).where(eq(schema.reviews.reviewId, reviewId));
    if (results.length === 0) return null;
    const current = results[0];
    const updatedPinned = !current.isPinned;
    await db
      .update(schema.reviews)
      .set({ isPinned: updatedPinned })
      .where(eq(schema.reviews.reviewId, reviewId));
    return { ...current, isPinned: updatedPinned } as Review;
  } catch (error) {
    console.error("Error toggling pin:", error);
    return null;
  }
}

export async function updateReviewStatusInDb(
  reviewId: string,
  status: "approved" | "rejected" | "pending"
): Promise<Review | null> {
  try {
    const results = await db.select().from(schema.reviews).where(eq(schema.reviews.reviewId, reviewId));
    if (results.length === 0) return null;
    const current = results[0];
    await db
      .update(schema.reviews)
      .set({ status })
      .where(eq(schema.reviews.reviewId, reviewId));
    return { ...current, status } as Review;
  } catch (error) {
    console.error("Error updating review status:", error);
    return null;
  }
}

// MESSAGES
export async function getDbMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
    return raw as ContactMessage[];
  } catch (error) {
    console.error("Error reading database messages:", error);
    return [];
  }
}

export async function insertMessage(
  messageData: Omit<ContactMessage, "messageId" | "status" | "createdAt">
): Promise<ContactMessage> {
  const now = new Date().toISOString();
  const newId = Math.random().toString(36).substring(2, 15);
  const newMessage = {
    messageId: newId,
    name: messageData.name,
    email: messageData.email,
    messageText: messageData.messageText,
    status: "unread" as const,
    createdAt: now,
  };
  await db.insert(schema.messages).values(newMessage);
  return newMessage;
}

export async function deleteMessageFromDb(messageId: string): Promise<boolean> {
  try {
    await db.delete(schema.messages).where(eq(schema.messages.messageId, messageId));
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}

export async function markMessageReadInDb(messageId: string): Promise<ContactMessage | null> {
  try {
    const results = await db.select().from(schema.messages).where(eq(schema.messages.messageId, messageId));
    if (results.length === 0) return null;
    const current = results[0];
    await db
      .update(schema.messages)
      .set({ status: "read" })
      .where(eq(schema.messages.messageId, messageId));
    return { ...current, status: "read" } as ContactMessage;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return null;
  }
}

// APPOINTMENTS
export async function getDbAppointments(): Promise<Appointment[]> {
  try {
    const raw = await db.select().from(schema.appointments).orderBy(desc(schema.appointments.createdAt));
    return raw.map((a) => ({
      ...a,
      timeSlot: a.timeSlot || "",
    })) as Appointment[];
  } catch (error) {
    console.error("Error reading database appointments:", error);
    return [];
  }
}

export async function insertAppointment(
  appointmentData: Omit<Appointment, "appointmentId" | "status" | "createdAt" | "updatedAt">
): Promise<Appointment> {
  const now = new Date().toISOString();
  const newId = Math.random().toString(36).substring(2, 15);
  const newAppointment = {
    appointmentId: newId,
    name: appointmentData.name,
    phone: appointmentData.phone,
    date: appointmentData.date,
    timeSlot: appointmentData.timeSlot || "",
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(schema.appointments).values(newAppointment);
  return newAppointment;
}

export async function updateAppointmentStatusInDb(
  appointmentId: string,
  status: Appointment["status"]
): Promise<Appointment | null> {
  try {
    const results = await db.select().from(schema.appointments).where(eq(schema.appointments.appointmentId, appointmentId));
    if (results.length === 0) return null;
    const current = results[0];
    const now = new Date().toISOString();
    await db
      .update(schema.appointments)
      .set({ status, updatedAt: now })
      .where(eq(schema.appointments.appointmentId, appointmentId));
    return { ...current, status, updatedAt: now } as Appointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return null;
  }
}

export async function deleteAppointmentFromDb(appointmentId: string): Promise<boolean> {
  try {
    await db.delete(schema.appointments).where(eq(schema.appointments.appointmentId, appointmentId));
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }
}

// SETTINGS
const defaultSettings: SystemSettings = {
  isBookingEnabled: true,
  contactPhone: "+91 99982 90040",
  clinicTimings: "Mon - Sat: 9:00 AM - 6:00 PM",
  showReviews: true,
};

export async function getDbSettings(): Promise<SystemSettings> {
  try {
    const results = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
    if (results.length === 0) {
      await db.insert(schema.settings).values({ id: 1, ...defaultSettings });
      return defaultSettings;
    }
    return results[0] as SystemSettings;
  } catch (error) {
    console.error("Error reading database settings:", error);
    return defaultSettings;
  }
}

export async function saveDbSettings(settingsData: SystemSettings): Promise<boolean> {
  try {
    const results = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
    if (results.length === 0) {
      await db.insert(schema.settings).values({ id: 1, ...settingsData });
    } else {
      await db
        .update(schema.settings)
        .set(settingsData)
        .where(eq(schema.settings.id, 1));
    }
    return true;
  } catch (error) {
    console.error("Error writing settings:", error);
    return false;
  }
}
