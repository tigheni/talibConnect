import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
);
const {
  data: { user },
} = await supabase.auth.getUser();

console.log(user);

const data = JSON.parse(fs.readFileSync("./data/mostaganem.json", "utf8"));

const WILAYA_MAP = {
  ua2aks: 16,
  ubma: 23,
  umbm: 28,
  umkb: 7,
  ummto: 15,
  usthb: 16,
  usto: 31,
  um: 27,
};

async function upsertInstitution(slug, institution) {
  const payload = {
    slug,

    name_ar: institution.name.ar,
    name_fr: institution.name.fr,
    name_en: institution.name.en,

    type: institution.type,

    wilaya_id: WILAYA_MAP[slug],
  };

  const { data: row, error } = await supabase
    .from("institutions")
    .upsert(payload, {
      onConflict: "slug",
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`✓ Institution: ${row.name_en}`);

  return row;
}

async function upsertFaculty(slug, faculty, institutionId) {
  const payload = {
    slug,

    institution_id: institutionId,

    name_ar: faculty.name.ar,
    name_fr: faculty.name.fr,
    name_en: faculty.name.en,

    type: faculty.type,
  };

  const { data: row, error } = await supabase
    .from("faculties")
    .upsert(payload, {
      onConflict: "slug,institution_id",
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`   ├── Faculty: ${row.name_en}`);

  return row;
}

async function upsertDepartment(slug, department, facultyId) {
  const payload = {
    slug,

    faculty_id: facultyId,

    name_ar: department.name.ar,
    name_fr: department.name.fr,
    name_en: department.name.en,

    type: department.type,
  };

  const { data: row, error } = await supabase
    .from("departments")
    .upsert(payload, {
      onConflict: "slug,faculty_id",
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`      └── Department: ${row.name_en}`);

  return row;
}
async function importDepartments(facultyNode, facultyId) {
  if (!facultyNode.children) return;

  for (const [departmentSlug, departmentNode] of Object.entries(
    facultyNode.children,
  )) {
    await upsertDepartment(departmentSlug, departmentNode, facultyId);
  }
}

async function importFaculties(institutionNode, institutionId) {
  if (!institutionNode.children) return;

  for (const [facultySlug, facultyNode] of Object.entries(
    institutionNode.children,
  )) {
    const faculty = await upsertFaculty(
      facultySlug,
      facultyNode,
      institutionId,
    );

    await importDepartments(facultyNode, faculty.id);
  }
}

async function importInstitutions() {
  const entries = Object.entries(data);

  console.log(`Found ${entries.length} institutions\n`);

  for (const [slug, institutionNode] of entries) {
    if (!WILAYA_MAP[slug]) {
      console.warn(`⚠ No wilaya mapping found for "${slug}". Skipping...`);
      continue;
    }

    const institution = await upsertInstitution(slug, institutionNode);

    await importFaculties(institutionNode, institution.id);

    console.log("");
  }
}
async function main() {
  console.log("=================================");
  console.log(" Kuliya Importer");
  console.log("=================================\n");

  try {
    await importInstitutions();

    console.log("\n=================================");
    console.log("✅ Import completed successfully!");
    console.log("=================================");
  } catch (error) {
    console.error("\n❌ Import failed:");
    console.error(error);

    process.exit(1);
  }
}

main();
