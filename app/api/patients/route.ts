import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const PATIENTS_FILE = path.join(process.cwd(), "data", "patients.json");

// Helper to authenticate admin session
function getAdminSession() {
  const token = cookies().get("patient_session")?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session || !session.isAdmin) return null;
  return session;
}

// Perform legacy migration once if file exists and has records
async function migrateLegacyJson() {
  try {
    const fileData = await fs.readFile(PATIENTS_FILE, "utf-8");
    const legacyPatients = JSON.parse(fileData);

    if (Array.isArray(legacyPatients) && legacyPatients.length > 0) {
      for (const lp of legacyPatients) {
        const pId = lp.patientId || `PAT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const name = lp.name || "";
        const age = lp.age ? Number(lp.age) : null;
        const gender = lp.gender || null;

        // Handle date fields fallback
        const visitDate = lp.visitDate || lp.dateOfVisit || new Date().toISOString().slice(0, 10);

        // Handle diagnosis fields fallback
        const diagnosisCategory = lp.diagnosisCategory || lp.diseaseType || "General";
        const diagnosis = lp.diagnosis || lp.diseaseType || "General";

        // Handle payment method fallback
        const paymentType = lp.paymentType || lp.paymentMethod || "Cash";

        // Handle referring doctor fallback
        const referringDoctor = lp.referringDoctor || lp.referredBy || null;

        // Handle contact phone fallback
        const contact = lp.contact || lp.phone || null;

        const flags = JSON.stringify(lp.flags || []);
        const notes = lp.notes || lp.doctorNotes || null;
        const month = lp.month || null;
        const year = lp.year || null;

        // Gather all other customized clinical fields to save in extraData
        const knownKeys = [
          "patientId", "name", "age", "gender", "visitDate", "dateOfVisit",
          "diagnosisCategory", "diagnosis", "diseaseType", "paymentType",
          "paymentMethod", "referringDoctor", "referredBy", "contact",
          "phone", "flags", "notes", "doctorNotes", "month", "year",
          "createdAt", "updatedAt"
        ];

        const extra: Record<string, any> = {};
        for (const key of Object.keys(lp)) {
          if (!knownKeys.includes(key)) {
            extra[key] = lp[key];
          }
        }

        const dbPayload = {
          patientId: pId,
          name,
          age,
          gender,
          visitDate,
          diagnosisCategory,
          diagnosis,
          paymentType,
          referringDoctor,
          contact,
          flags,
          notes,
          month,
          year,
          extraData: JSON.stringify(extra),
          createdAt: lp.createdAt || new Date().toISOString(),
          updatedAt: lp.updatedAt || new Date().toISOString(),
        };

        // Insert to DB
        await db.insert(schema.patients).values(dbPayload).onConflictDoNothing();
      }

      // Clear the legacy JSON file so we don't repeat migration
      await fs.writeFile(PATIENTS_FILE, "[]", "utf-8");
    }
  } catch (err) {
    // If file doesn't exist or is invalid, do nothing
  }
}

// GET: Fetch all patient records (Admin only)
export async function GET() {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    // Run migration if any legacy JSON records exist
    await migrateLegacyJson();

    // Load patients from DB
    const list = await db.select().from(schema.patients);

    // Format database patients to flat structure matching previous JSON structure
    const formatted = list.map((p) => {
      let extra: Record<string, any> = {};
      try {
        if (p.extraData) extra = JSON.parse(p.extraData);
      } catch (e) { }

      let parsedFlags: string[] = [];
      try {
        if (p.flags) parsedFlags = JSON.parse(p.flags);
      } catch (e) { }

      return {
        ...p,
        flags: parsedFlags,
        ...extra
      };
    });

    return NextResponse.json({ success: true, patients: formatted });
  } catch (error) {
    logError("GET patients error", error);
    return NextResponse.json({ error: "Failed to load patient records from DB." }, { status: 500 });
  }
}

// POST: Add a new patient record (Admin only)
export async function POST(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();

    let patientId = body.patientId?.trim();
    if (!patientId) {
      patientId = `PAT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    } else {
      const exists = await db.select().from(schema.patients).where(eq(schema.patients.patientId, patientId));
      if (exists.length > 0) {
        return NextResponse.json({ error: "Patient ID already exists." }, { status: 400 });
      }
    }

    const name = body.name || "";
    const age = body.age ? Number(body.age) : null;
    const gender = body.gender || null;
    const visitDate = body.visitDate || new Date().toISOString().slice(0, 10);
    const diagnosisCategory = body.diagnosisCategory || "";
    const diagnosis = body.diagnosis || "";
    const paymentType = body.paymentType || "Cash";
    const referringDoctor = body.referringDoctor || null;
    const contact = body.contact || null;
    const flags = JSON.stringify(body.flags || []);
    const notes = body.notes || null;
    const month = body.month ? Number(body.month) : null;
    const year = body.year ? Number(body.year) : null;

    // Any other parameters are customization EHR fields saved in extraData
    const knownKeys = [
      "patientId", "name", "age", "gender", "visitDate", "diagnosisCategory",
      "diagnosis", "paymentType", "referringDoctor", "contact", "flags",
      "notes", "month", "year"
    ];

    const extra: Record<string, any> = {};
    for (const key of Object.keys(body)) {
      if (!knownKeys.includes(key)) {
        extra[key] = body[key];
      }
    }

    const dbPayload = {
      patientId,
      name,
      age,
      gender,
      visitDate,
      diagnosisCategory,
      diagnosis,
      paymentType,
      referringDoctor,
      contact,
      flags,
      notes,
      month,
      year,
      extraData: JSON.stringify(extra),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(schema.patients).values(dbPayload);

    return NextResponse.json({
      success: true,
      patient: { ...dbPayload, flags: body.flags || [], ...extra }
    });
  } catch (error) {
    logError("POST patient error", error);
    return NextResponse.json({ error: "Failed to save patient record to DB." }, { status: 500 });
  }
}

// PUT: Update an existing patient record (Admin only)
export async function PUT(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, oldPatientId } = body;
    const lookupId = oldPatientId || patientId;
    if (!lookupId) {
      return NextResponse.json({ error: "Patient ID is required for update." }, { status: 400 });
    }

    const exists = await db.select().from(schema.patients).where(eq(schema.patients.patientId, lookupId));
    if (exists.length === 0) {
      return NextResponse.json({ error: "Patient record not found in DB." }, { status: 404 });
    }

    // If patientId is being changed, check if new patientId is already taken by another patient
    const newId = patientId?.trim();
    if (newId && newId !== lookupId) {
      const duplicate = await db.select().from(schema.patients).where(eq(schema.patients.patientId, newId));
      if (duplicate.length > 0) {
        return NextResponse.json({ error: "New Patient ID already exists." }, { status: 400 });
      }
    }

    const name = body.name !== undefined ? body.name : exists[0].name;
    const age = body.age !== undefined ? (body.age ? Number(body.age) : null) : exists[0].age;
    const gender = body.gender !== undefined ? body.gender : exists[0].gender;
    const visitDate = body.visitDate !== undefined ? body.visitDate : exists[0].visitDate;
    const diagnosisCategory = body.diagnosisCategory !== undefined ? body.diagnosisCategory : exists[0].diagnosisCategory;
    const diagnosis = body.diagnosis !== undefined ? body.diagnosis : exists[0].diagnosis;
    const paymentType = body.paymentType !== undefined ? body.paymentType : exists[0].paymentType;
    const referringDoctor = body.referringDoctor !== undefined ? body.referringDoctor : exists[0].referringDoctor;
    const contact = body.contact !== undefined ? body.contact : exists[0].contact;
    const flags = body.flags !== undefined ? JSON.stringify(body.flags) : exists[0].flags;
    const notes = body.notes !== undefined ? body.notes : exists[0].notes;
    const month = body.month !== undefined ? (body.month ? Number(body.month) : null) : exists[0].month;
    const year = body.year !== undefined ? (body.year ? Number(body.year) : null) : exists[0].year;

    // Custom fields in extraData
    const knownKeys = [
      "patientId", "name", "age", "gender", "visitDate", "diagnosisCategory",
      "diagnosis", "paymentType", "referringDoctor", "contact", "flags",
      "notes", "month", "year", "createdAt", "updatedAt"
    ];

    const extra: Record<string, any> = {};
    for (const key of Object.keys(body)) {
      if (!knownKeys.includes(key)) {
        extra[key] = body[key];
      }
    }

    const updatedData = {
      patientId: newId || lookupId,
      name,
      age,
      gender,
      visitDate,
      diagnosisCategory,
      diagnosis,
      paymentType,
      referringDoctor,
      contact,
      flags,
      notes,
      month,
      year,
      extraData: JSON.stringify(extra),
      updatedAt: new Date().toISOString(),
    };

    await db
      .update(schema.patients)
      .set(updatedData)
      .where(eq(schema.patients.patientId, lookupId));

    return NextResponse.json({
      success: true,
      patient: { ...updatedData, patientId, flags: body.flags || [], ...extra }
    });
  } catch (error) {
    logError("PUT patient error", error);
    return NextResponse.json({ error: "Failed to update patient record in DB." }, { status: 500 });
  }
}

// DELETE: Delete a patient record (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required." }, { status: 400 });
    }

    await db.delete(schema.patients).where(eq(schema.patients.patientId, patientId));

    return NextResponse.json({ success: true, message: "Patient record deleted successfully from DB." });
  } catch (error) {
    logError("DELETE patient error", error);
    return NextResponse.json({ error: "Failed to delete patient record from DB." }, { status: 500 });
  }
}
