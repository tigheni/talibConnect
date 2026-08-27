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
  // Fetch Wilayas
  useEffect(() => {
    const fetchWilayas = async () => {
      const { data, error } = await supabase
        .from("wilayas")
        .select("id,name_en")
        .order("name_en");

      if (error) {
        console.error(error);
        return;
      }

      setWilayas(data || []);
    };

    fetchWilayas();
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

      setInstitutions(data || []);
    };

    fetchInstitutions();
  }, [selectedWilaya]);

  useEffect(() => {
    if (!selectedInstitution) {
      setFaculties([]);
      setSelectedFaculty("");
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

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

      setFaculties(data || []);
    };

    fetchFaculties();
  }, [selectedInstitution]);

  useEffect(() => {
    if (!selectedFaculty) {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

    const fetchDepartments = async () => {
      const { data } = await supabase
        .from("departments")
        .select("id,name_en")
        .eq("faculty_id", Number(selectedFaculty))
        .order("name_en");

      setDepartments(data || []);
    };

    fetchDepartments();
  }, [selectedFaculty]);

  const resetSelections = () => {
    setSelectedWilaya("");
    setSelectedInstitution("");
    setSelectedFaculty("");
    setSelectedDepartment("");

    setInstitutions([]);
    setFaculties([]);
    setDepartments([]);
  };
  return {
    wilayas,
    institutions,
    faculties,
    departments,

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
