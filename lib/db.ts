import fs from "fs";
import path from "path";

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

const filePath = path.join(process.cwd(), "reviews.json");

// Helper to get all reviews from reviews.json
export function getDbReviews(): Review[] {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    const raw = JSON.parse(data);
    
    // Normalize old reviews schema if present
    return raw.map((r: any) => ({
      reviewId: r.reviewId || r.id || Date.now().toString(),
      userId: r.userId || "anonymous",
      name: r.name || "Anonymous Patient",
      email: r.email || "anonymous@patient.com",
      avatar: r.avatar || "",
      rating: Number(r.rating) || 5,
      title: r.title || "Excellent Care",
      treatmentType: r.treatmentType || "",
      reviewText: r.reviewText || r.comment || "",
      status: r.status || "approved",
      isPinned: r.isPinned || false,
      verified: r.verified !== undefined ? r.verified : true,
      createdAt: r.createdAt || r.date || new Date().toISOString(),
      updatedAt: r.updatedAt || r.date || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error reading database:", error);
    return [];
  }
}

// Save reviews back to reviews.json
export function saveDbReviews(reviews: Review[]): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Upsert a review: If userId already has a review, update it. Otherwise insert new.
export function upsertReview(reviewData: Omit<Review, "reviewId" | "createdAt" | "updatedAt" | "verified" | "isPinned">): Review {
  const reviews = getDbReviews();
  const existingIndex = reviews.findIndex((r) => r.userId === reviewData.userId && r.userId !== "anonymous");

  const now = new Date().toISOString();

  if (existingIndex > -1) {
    // Update existing review
    const updatedReview: Review = {
      ...reviews[existingIndex],
      ...reviewData,
      rating: Number(reviewData.rating),
      updatedAt: now,
    };
    reviews[existingIndex] = updatedReview;
    saveDbReviews(reviews);
    return updatedReview;
  } else {
    // Insert new review
    const newReview: Review = {
      ...reviewData,
      reviewId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      verified: true,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };
    // Put pending or approved reviews at the top
    reviews.unshift(newReview);
    saveDbReviews(reviews);
    return newReview;
  }
}

// Delete a review
export function deleteReviewFromDb(reviewId: string): boolean {
  const reviews = getDbReviews();
  const filtered = reviews.filter((r) => r.reviewId !== reviewId);
  if (reviews.length === filtered.length) return false;
  return saveDbReviews(filtered);
}

// Toggle pinned review
export function togglePinInDb(reviewId: string): Review | null {
  const reviews = getDbReviews();
  const index = reviews.findIndex((r) => r.reviewId === reviewId);
  if (index === -1) return null;
  reviews[index].isPinned = !reviews[index].isPinned;
  saveDbReviews(reviews);
  return reviews[index];
}

// Approve/Reject review status
export function updateReviewStatusInDb(reviewId: string, status: "approved" | "rejected" | "pending"): Review | null {
  const reviews = getDbReviews();
  const index = reviews.findIndex((r) => r.reviewId === reviewId);
  if (index === -1) return null;
  reviews[index].status = status;
  saveDbReviews(reviews);
  return reviews[index];
}

export interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  messageText: string;
  status: "unread" | "read";
  createdAt: string;
}

const messagesFilePath = path.join(process.cwd(), "messages.json");

export function getDbMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(messagesFilePath)) {
      fs.writeFileSync(messagesFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(messagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading messages database:", error);
    return [];
  }
}

export function saveDbMessages(messages: ContactMessage[]): boolean {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing messages database:", error);
    return false;
  }
}

export function insertMessage(messageData: Omit<ContactMessage, "messageId" | "status" | "createdAt">): ContactMessage {
  const messages = getDbMessages();
  const now = new Date().toISOString();
  const newMessage: ContactMessage = {
    ...messageData,
    messageId: Math.random().toString(36).substring(2, 15),
    status: "unread",
    createdAt: now,
  };
  messages.unshift(newMessage);
  saveDbMessages(messages);
  return newMessage;
}

export function deleteMessageFromDb(messageId: string): boolean {
  const messages = getDbMessages();
  const filtered = messages.filter((m) => m.messageId !== messageId);
  if (messages.length === filtered.length) return false;
  return saveDbMessages(filtered);
}

export function markMessageReadInDb(messageId: string): ContactMessage | null {
  const messages = getDbMessages();
  const index = messages.findIndex((m) => m.messageId === messageId);
  if (index === -1) return null;
  messages[index].status = "read";
  saveDbMessages(messages);
  return messages[index];
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

const appointmentsFilePath = path.join(process.cwd(), "appointments.json");

export function getDbAppointments(): Appointment[] {
  try {
    if (!fs.existsSync(appointmentsFilePath)) {
      fs.writeFileSync(appointmentsFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(appointmentsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading appointments database:", error);
    return [];
  }
}

export function saveDbAppointments(appointments: Appointment[]): boolean {
  try {
    fs.writeFileSync(appointmentsFilePath, JSON.stringify(appointments, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing appointments database:", error);
    return false;
  }
}

export function insertAppointment(appointmentData: Omit<Appointment, "appointmentId" | "status" | "createdAt" | "updatedAt">): Appointment {
  const appointments = getDbAppointments();
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...appointmentData,
    appointmentId: Math.random().toString(36).substring(2, 15),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  appointments.unshift(newAppointment);
  saveDbAppointments(appointments);
  return newAppointment;
}

export function updateAppointmentStatusInDb(appointmentId: string, status: Appointment["status"]): Appointment | null {
  const appointments = getDbAppointments();
  const index = appointments.findIndex((a) => a.appointmentId === appointmentId);
  if (index === -1) return null;
  appointments[index].status = status;
  appointments[index].updatedAt = new Date().toISOString();
  saveDbAppointments(appointments);
  return appointments[index];
}

export function deleteAppointmentFromDb(appointmentId: string): boolean {
  const appointments = getDbAppointments();
  const filtered = appointments.filter((a) => a.appointmentId !== appointmentId);
  if (appointments.length === filtered.length) return false;
  return saveDbAppointments(filtered);
}

export interface SystemSettings {
  isBookingEnabled: boolean;
  contactPhone: string;
  clinicTimings: string;
  showReviews: boolean;
}

const settingsFilePath = path.join(process.cwd(), "settings.json");
const defaultSettings: SystemSettings = {
  isBookingEnabled: true,
  contactPhone: "+91 99982 90040",
  clinicTimings: "Mon - Sat: 9:00 AM - 6:00 PM",
  showReviews: true,
};

export function getDbSettings(): SystemSettings {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2), "utf-8");
      return defaultSettings;
    }
    const data = fs.readFileSync(settingsFilePath, "utf-8");
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error reading settings database:", error);
    return defaultSettings;
  }
}

export function saveDbSettings(settings: SystemSettings): boolean {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing settings database:", error);
    return false;
  }
}

