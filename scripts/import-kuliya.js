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

const data = JSON.parse(fs.readFileSync("./data/annaba/essg.json", "utf8"));

const WILAYA_MAP = {
  ufas: 19,
  ufmc1: 16,
  ua2aks: 16,
  enstp: 16,
  ismas: 16,
  usthb: 16,
  essaia: 16,
  ua1: 16,
  isg: 16,
  emalger: 16,
  esaa: 16,
  esba: 16,
  esss: 16,
  ubma: 23,
  essg: 23,
  esmt: 13,
  umbm: 28,
  umkb: 7,
  ummto: 15,
  usto: 31,
  enso: 31,
  essbo: 31,
  ensttic: 31,
  esgee: 31,
  uo1: 31,
  um: 27,
  esam: 27,
  esgen: 42,
  encrbc: 42,
  us: 21,
  esi_sba: 22,
  usba: 22,
  ug: 24,
  ulk: 40,
  ucm: 43,
  escf: 25,
  ensc: 25,
  ueais: 25,
  uc2: 25,
  ubouira: 10,
  ensh: 9,
  ub: 6,
  ut: 13,
  uadrar: 1,
  cut: 37,
  cua: 3,
  uatl: 3,
  uat: 46,
  ucbet: 36,
  udbkm: 44,
  ltu: 12,
  umts: 20,
  ubatna1: 5,
  ueloued: 39,
  uhbc: 2,
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
