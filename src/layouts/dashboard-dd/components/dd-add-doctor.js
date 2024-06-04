import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import SearchControl from "../../../services/geoSearchController";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Fix for missing default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function DeputyDirectorAddDoctor() {
  const navigate = useNavigate();
  const location = useLocation();

  const { accessToken } = useSelector((state) => state.auth);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [specialityId, setSpecialityId] = useState("");
  const [medicalOrganizationId, setMedicalOrganizationId] = useState("");
  const [categories, setCategories] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [medicalOrganizations, setMedicalOrganizations] = useState([]);
  const { id } = location.state || {};

  const [doctorData, setDoctorData] = useState({
    full_name: "",
    contact1: "",
    contact2: "",
    email: "",
  });

  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Не удалось получить категории:", error);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-speciality`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSpecialities(response.data);
      } catch (error) {
        console.error("Не удалось получить специальности:", error);
      }
    };

    const fetchMedicalOrganizations = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-medical-organization`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedicalOrganizations(response.data);
      } catch (error) {
        console.error("Не удалось получить медицинские организации:", error);
      }
    };

    fetchCategories();
    fetchSpecialities();
    fetchMedicalOrganizations();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `https://it-club.uz/mr/add-doctor?user_id=${id}`,
        {
          ...doctorData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          category_id: parseInt(categoryId, 10),
          speciality_id: parseInt(specialityId, 10),
          medical_organization_id: parseInt(medicalOrganizationId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Доктор успешно добавлен" });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setMessage({
        color: "error",
        content:
          "Не удалось добавить доктора. " +
          (error.response?.data?.detail || "Пожалуйста, проверьте свои данные и попробуйте снова."),
      });
    }
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
      move() {
        setLatitude(map.getCenter().lat);
        setLongitude(map.getCenter().lng);
      },
    });

    return latitude !== 0 && longitude !== 0 ? (
      <Marker
        position={[latitude, longitude]}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target;
            const position = marker.getLatLng();
            setLatitude(position.lat);
            setLongitude(position.lng);
          },
        }}
      ></Marker>
    ) : null;
  }

  const handleChange = (e) => {
    setDoctorData({
      ...doctorData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Добавить врача
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Полное имя"
                  fullWidth
                  name="full_name"
                  value={doctorData.full_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 1"
                  fullWidth
                  name="contact1"
                  value={doctorData.contact1}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="text"
                  label="Контакт 2"
                  fullWidth
                  name="contact2"
                  value={doctorData.contact2}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  name="email"
                  value={doctorData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="categories-label">Категории</InputLabel>
                  <Select
                    labelId="categories-label"
                    value={categoryId}
                    label="Категории"
                    onChange={(e) => setCategoryId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="specialities-label">Специальности</InputLabel>
                  <Select
                    labelId="specialities-label"
                    value={specialityId}
                    label="Специальности"
                    onChange={(e) => setSpecialityId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {specialities.map((speciality) => (
                      <MenuItem key={speciality.id} value={speciality.id}>
                        {speciality.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="medical-organizations-label">Медицинские Организации</InputLabel>
                  <Select
                    labelId="medical-organizations-label"
                    value={medicalOrganizationId}
                    label="Медицинские Организации"
                    onChange={(e) => setMedicalOrganizationId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {medicalOrganizations.map((organization) => (
                      <MenuItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <MDBox mb={2} style={{ height: "200px" }}>
                  <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <SearchControl setLatitude={setLatitude} setLongitude={setLongitude} />
                    <LocationMarker />
                  </MapContainer>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Широта: {latitude}</MDTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6">Долгота: {longitude}</MDTypography>
              </Grid>
            </Grid>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default DeputyDirectorAddDoctor;
