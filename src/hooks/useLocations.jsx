import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export function useLocations() {
  const [wilayas, setWilayas] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedWilaya, setSelectedWilayaState] = useState("");
  const [selectedInstitution, setSelectedInstitutionState] = useState("");
  const [selectedFaculty, setSelectedFacultyState] = useState("");
  const [selectedDepartment, setSelectedDepartmentState] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const institutionRequestId = useRef(0);
  const facultyRequestId = useRef(0);
  const departmentRequestId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const fetchWilayas = async () => {
      setInitialLoading(true);

      const { data, error } = await supabase
        .from("wilayas")
        .select("id, name_en")
        .order("name_en");

      if (cancelled) return;

      if (error) {
        console.error("Failed to fetch wilayas:", error);
        setWilayas([]);
      } else {
        setWilayas(data || []);
      }

      setInitialLoading(false);
    };

    fetchWilayas();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSelectedWilaya = useCallback(async (value) => {
    const requestId = ++institutionRequestId.current;
    setSelectedWilayaState(value);
    setSelectedInstitutionState("");
    setSelectedFacultyState("");
    setSelectedDepartmentState("");
    setInstitutions([]);
    setFaculties([]);
    setDepartments([]);
    setDepartmentsLoading(false);

    if (!value) return;

    const { data, error } = await supabase
      .from("institutions")
      .select("id, name_en")
      .eq("wilaya_id", Number(value))
      .order("name_en");
    if (requestId !== institutionRequestId.current) return;

    if (error) {
      console.error("Failed to fetch institutions:", error);
      setInstitutions([]);
      return;
    }

    setInstitutions(data || []);
  }, []);

  const setSelectedInstitution = useCallback(async (value) => {
    const requestId = ++facultyRequestId.current;
    setSelectedInstitutionState(value);
    setSelectedFacultyState("");
    setSelectedDepartmentState("");
    setFaculties([]);
    setDepartments([]);
    setDepartmentsLoading(false);

    if (!value) return;

    const { data, error } = await supabase
      .from("faculties")
      .select("id, name_en")
      .eq("institution_id", Number(value))
      .order("name_en");

    if (requestId !== facultyRequestId.current) return;

    if (error) {
      console.error("Failed to fetch faculties:", error);
      setFaculties([]);
      return;
    }

    setFaculties(data || []);
  }, []);

  const setSelectedFaculty = useCallback(async (value) => {
    const requestId = ++departmentRequestId.current;

    setSelectedFacultyState(value);
    setSelectedDepartmentState("");
    setDepartments([]);
    if (!value) {
      setDepartmentsLoading(false);
      return;
    }

    setDepartmentsLoading(true);

    const { data, error } = await supabase
      .from("departments")
      .select("id, name_en")
      .eq("faculty_id", Number(value))
      .order("name_en");
    if (requestId !== departmentRequestId.current) return;
    if (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([]);
    } else {
      setDepartments(data || []);
    }
    setDepartmentsLoading(false);
  }, []);

  const setSelectedDepartment = useCallback((value) => {
    setSelectedDepartmentState(value);
  }, []);

  const resetSelections = useCallback(() => {
    institutionRequestId.current += 1;
    facultyRequestId.current += 1;
    departmentRequestId.current += 1;

    setSelectedWilayaState("");
    setSelectedInstitutionState("");
    setSelectedFacultyState("");
    setSelectedDepartmentState("");

    setInstitutions([]);
    setFaculties([]);
    setDepartments([]);

    setDepartmentsLoading(false);
  }, []);

  const hasNoDepartments =
    Boolean(selectedFaculty) && !departmentsLoading && departments.length === 0;

  return {
    wilayas,
    institutions,
    faculties,
    departments,

    selectedWilaya,
    selectedInstitution,
    selectedFaculty,
    selectedDepartment,

    initialLoading,
    departmentsLoading,
    hasNoDepartments,

    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
    setSelectedDepartment,

    resetSelections,
  };
}
