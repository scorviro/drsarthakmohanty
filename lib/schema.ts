import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  reviewId: text("reviewId").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  treatmentType: text("treatmentType").default(""),
  reviewText: text("reviewText").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  isPinned: integer("isPinned", { mode: "boolean" }).default(false).notNull(),
  verified: integer("verified", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const messages = sqliteTable("messages", {
  messageId: text("messageId").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  messageText: text("messageText").notNull(),
  status: text("status", { enum: ["unread", "read"] }).default("unread").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const appointments = sqliteTable("appointments", {
  appointmentId: text("appointmentId").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  timeSlot: text("timeSlot").default(""),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] }).default("pending").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey().default(1),
  isBookingEnabled: integer("isBookingEnabled", { mode: "boolean" }).default(true).notNull(),
  contactPhone: text("contactPhone").default("+91 82382 86706").notNull(),
  clinicTimings: text("clinicTimings").default("Mon - Sat: 9:00 AM - 6:00 PM").notNull(),
  showReviews: integer("showReviews", { mode: "boolean" }).default(true).notNull(),
});

export const patients = sqliteTable("patients", {
  patientId: text("patientId").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  visitDate: text("visitDate").notNull(),
  diagnosisCategory: text("diagnosisCategory").notNull(),
  diagnosis: text("diagnosis").notNull(),
  paymentType: text("paymentType").notNull(),
  referringDoctor: text("referringDoctor"),
  contact: text("contact"),
  flags: text("flags"), // stringified array
  notes: text("notes"),
  month: integer("month"),
  year: integer("year"),
  extraData: text("extraData"), // JSON stringified object containing other dynamic custom fields
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
export const keyValueStore = sqliteTable("key_value_store", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
