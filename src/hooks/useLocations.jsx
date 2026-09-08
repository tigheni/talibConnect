/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useLocations() {
  const [wilayas, setWilayas] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchWilayas = async () => {
      const { data, error } = await supabase
        .from("wilayas")
        .select("id,name_en")
        .order("name_en");

      if (error) {
        console.error(error);
        return;
      }

      if (!cancelled) setWilayas(data || []);
    };

    fetchWilayas();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedWilaya) {
      setInstitutions([]);
      setSelectedInstitution("");
      setFaculties([]);
      setSelectedFaculty("");
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

    let cancelled = false;

    const fetchInstitutions = async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("id,name_en")
        .eq("wilaya_id", Number(selectedWilaya))
        .order("name_en");

      if (error) {
        console.error(error);
        return;
      }

      if (!cancelled) setInstitutions(data || []);
    };

    fetchInstitutions();

    return () => {
      cancelled = true;
    };
  }, [selectedWilaya]);

  useEffect(() => {
    if (!selectedInstitution) {
      setFaculties([]);
      setSelectedFaculty("");
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

    let cancelled = false;

    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from("faculties")
        .select("id,name_en")
        .eq("institution_id", Number(selectedInstitution))
        .order("name_en");

      if (error) {
        console.error(error);
        return;
      }

      if (!cancelled) setFaculties(data || []);
    };

    fetchFaculties();

    return () => {
      cancelled = true;
    };
  }, [selectedInstitution]);

  useEffect(() => {
    if (!selectedFaculty) {
      setDepartments([]);
      setSelectedDepartment("");
      setDepartmentsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      const { data, error } = await supabase
        .from("departments")
        .select("id,name_en")
        .eq("faculty_id", Number(selectedFaculty))
        .order("name_en");

      if (cancelled) return;

      if (error) console.error(error);
      setDepartments(data || []);
      setDepartmentsLoading(false);
    };

    fetchDepartments();

    return () => {
      cancelled = true;
    };
  }, [selectedFaculty]);

  const hasNoDepartments =
    Boolean(selectedFaculty) && !departmentsLoading && departments.length === 0;

  const resetSelections = () => {
    setSelectedWilaya("");
    setSelectedInstitution("");
    setSelectedFaculty("");
    setSelectedDepartment("");

    setInstitutions([]);
    setFaculties([]);
    setDepartments([]);
    setDepartmentsLoading(false);
  };
  return {
    wilayas,
    institutions,
    faculties,
    departments,
    hasNoDepartments,
    departmentsLoading,

    selectedWilaya,
    selectedInstitution,
    selectedFaculty,
    selectedDepartment,

    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
    setSelectedDepartment,

    resetSelections,
  };
}
