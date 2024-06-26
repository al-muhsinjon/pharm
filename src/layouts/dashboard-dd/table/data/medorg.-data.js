import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useMedicalOrganizationData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchMedicalOrganizations() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const medicalOrganizations = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Адрес", accessor: "address", align: "left" },
          { Header: "Регион", accessor: "region", align: "left" },
          { Header: "Медицинский представитель", accessor: "medRep", align: "left" },
        ];

        const rows = medicalOrganizations.map((medOrg) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {medOrg.name}
            </MDTypography>
          ),
          address: (
            <MDTypography variant="caption" fontWeight="medium">
              {medOrg.address}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium">
              {medOrg.region.name}
            </MDTypography>
          ),
          medRep: (
            <MDTypography variant="caption" fontWeight="medium">
              {medOrg.med_rep.full_name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchMedicalOrganizations();
  }, [accessToken, apiPath]);

  return data;
}
