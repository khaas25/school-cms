import * as yup from "yup";

export const signupSchema = yup.object().shape({
  firstName: yup.string().min(2).required("First Name is Required!"),
  lastName: yup.string().min(2).required("Last Name is Required!"),
  email: yup
    .string()
    .email("Please type a valid email!")
    .required("Email is a required field"),
  password: yup.string().min(5).required("Password is required"),
});
