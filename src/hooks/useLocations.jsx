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

  // Fetch Wilayas
  useEffect(() => {
    const fetchWilayas = async () => {
      const { data, error } = await supabase
        .from("wilayas")
        .select("*")
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
      return;
    }

    const fetchInstitutions = async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
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

  // Fetch Faculties
  useEffect(() => {
    if (!selectedInstitution) {
      setFaculties([]);
      setSelectedFaculty("");
      setDepartments([]);
      return;
    }

    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from("faculties")
        .select("*")
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
      return;
    }

    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
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

    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,

    resetSelections,
  };
}
