/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import userRoles from "constants/userRoles";

function DeputyDirectorAddRegionalManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [full_name, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ffm_id, setFieldForceManagerId] = useState("");
  const [fieldForceManagers, setFieldForceManagers] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const user = location.state || {};

  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      console.log(user.username);
      try {
        const response = await axios.get(
          `https://it-club.uz/common/get-users-by-username?username=${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER
        );
        console.log(fieldForceManagers);
        setFieldForceManagers(fieldForceManagers);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    fetchFieldForceManagers();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Define the request payload
    const userData = {
      full_name,
      username,
      password,
      ffm_id,
      product_manager_id: user.id,
      region_id: user.region_id,
      status: userRoles.REGIONAL_MANAGER,
    };

    try {
      // Call the API with authorization header
      const response = await axios.post("https://it-club.uz/dd/register-for-dd", userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle a successful response
      setMessage({ color: "success", content: "Пользователь успешно зарегистрирован!" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      // Handle errors gracefully
      setMessage({
        color: "error",
        content:
          "Не удалось зарегистрировать пользователя. " +
          (error.response?.data?.detail || "Проверьте правильность введенных данных и попробуйте снова."),
      });
    }
  };

  return (
    <BasicLayout>
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
            Добавить регионального менеджера
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Полное имя"
                fullWidth
                value={full_name}
                onChange={(e) => setFullname(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Имя пользователя"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Пароль"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="field-force-manager-label">Менеджер полевых персоналов</InputLabel>
                <Select
                  labelId="field-force-manager-label"
                  value={ffm_id}
                  label="Менеджер полевых персоналов"
                  onChange={(e) => setFieldForceManagerId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {fieldForceManagers.map((ffm) => (
                    <MenuItem key={ffm.id} value={ffm.id}>
                      {ffm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddRegionalManager;
