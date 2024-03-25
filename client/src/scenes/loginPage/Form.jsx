import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  let initialValues = isLogin ? initialValuesLogin : initialValuesRegister;

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <>
      {isRegister ? (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesRegister}
          validationSchema={registerSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  label="First Name"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.firstName}
                  name="firstName"
                  error={
                    Boolean(props.touched.firstName) &&
                    Boolean(props.errors.firstName)
                  }
                  helperText={props.touched.firstName && props.errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.lastName}
                  name="lastName"
                  error={
                    Boolean(props.touched.lastName) &&
                    Boolean(props.errors.lastName)
                  }
                  helperText={props.touched.lastName && props.errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.location}
                  name="location"
                  error={
                    Boolean(props.touched.location) &&
                    Boolean(props.errors.location)
                  }
                  helperText={props.touched.location && props.errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.occupation}
                  name="occupation"
                  error={
                    Boolean(props.touched.occupation) &&
                    Boolean(props.errors.occupation)
                  }
                  helperText={
                    props.touched.occupation && props.errors.occupation
                  }
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      props.setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!props.values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{props.values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                <TextField
                  label="Email"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.email}
                  name="email"
                  error={
                    Boolean(props.touched.email) && Boolean(props.errors.email)
                  }
                  helperText={props.touched.email && props.errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  value={props.values.password}
                  name="password"
                  error={
                    Boolean(props.touched.password) &&
                    Boolean(props.errors.password)
                  }
                  helperText={props.touched.password && props.errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {"REGISTER"}
                </Button>
                <Typography
                  onClick={() => {
                    setPageType("login");
                    props.resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {"Already have an account? Login here."}
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      ) : (
        <>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    label="Email"
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    value={props.values.email}
                    name="email"
                    error={
                      Boolean(props.touched.email) &&
                      Boolean(props.errors.email)
                    }
                    helperText={props.touched.email && props.errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    value={props.values.password}
                    name="password"
                    error={
                      Boolean(props.touched.password) &&
                      Boolean(props.errors.password)
                    }
                    helperText={props.touched.password && props.errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                {/* BUTTONS */}
                <Box>
                  <Button
                    fullWidth
                    type="submit"
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": { color: palette.primary.main },
                    }}
                  >
                    {"LOGIN"}
                  </Button>
                  <Typography
                    onClick={() => {
                      setPageType("register");
                      props.resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                      },
                    }}
                  >
                    {"Don't have an account? Sign Up here."}
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};

export default Form;
