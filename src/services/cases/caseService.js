// services/caseService.js
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/cases`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function createCase(data) {
  const res = await axios.post(API_URL, data, getAuthHeaders());
  return res.data;
}

export async function updateCase(id, data) {
  const res = await axios.patch(`${API_URL}/${id}`, data, getAuthHeaders());
  return res.data;
}


export const updateCaseStatus = async (id, case_status_id) => {
  const res = await axios.patch(
    `${API_URL}/${id}/status`,
    { case_status_id: Number(case_status_id) },
    getAuthHeaders()
  );

  return res.data.case;
};
