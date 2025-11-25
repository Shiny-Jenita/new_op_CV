import * as yup from "yup";

// ----------------- LOGIN & PASSWORD -----------------

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("* Email is required"),
  password: yup.string().required("* Password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("* Email is required"),
});

export const verifyCodeSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("* OTP is required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must have 8 characters with uppercase, lowercase, numbers and symbols are required."
    )
    .required("* Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("* Confirm Password is required"),
});

export const signUpSchema = yup.object().shape({
  firstName: yup.string().required("* First name is required"),
  lastName: yup.string().required("* Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("* Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must have 8 characters with uppercase, lowercase, numbers and symbols are required."
    )
    .required("* Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password do not match!")
    .required("* Confirm password is required"),
  referalCode: yup.string().optional(),
});

export const signupVerifyCodeSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("* OTP is required"),
});

// ----------------- RESUME SCHEMAS -----------------

export const resumeSchema = yup.object().shape({
  firstName: yup.string().required("* Required"),
  lastName: yup.string().required("* Required"),
  email: yup
    .string()
    .required("* Required")
    .email("Invalid email format"),
  dob: yup.date().nullable().required("* Required Field"),
  city: yup.string().required("* Required"),
  state: yup.string().required("* Required"),
  country: yup.string().required("* Required"),
  zipcode: yup.string().required("* Required"),
  phone: yup
    .string()
    .required("* Required")
    .matches(/^\d{10}$/, "* Phone number must be exactly 10 digits"),
  currentTitle: yup.string().required("* Required"),
  industry: yup.string().required("* Required"),
  websites: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        type: yup.string().required("* Website type is required"),
      })
    )
    .required(),
  languages: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("* Language name is required"),
        proficiency: yup.string().optional(),
      })
    )
    .required(),
  projects: yup.array().of(
    yup.object().shape({
      projectName: yup.string().required("* Required Field"),
      projectDescription: yup.string().required("* Required Field"),
    })
  ),
});

// ----------------- WORK EXPERIENCE -----------------

export const addexperiancescheme = yup.object().shape({
  experiences: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        companyName: yup.string().required("* Company Name is required"),
        jobTitle: yup.string().required("* Job Title is required"),
        skills: yup.array().of(yup.string()).min(1, "* At least one skill is required"),
        startDate: yup.date().nullable().required("* Start Date is required"),
        endDate: yup.date().nullable().when("currentlyWorking", {
          is: false,
          then: (schema) => schema.required("* End Date is required"),
          otherwise: (schema) => schema.nullable(),
        }),
        currentlyWorking: yup.boolean(),
        responsibilities: yup.string().required("* Description is required"),
      })
    )
    .required(),
});

// ----------------- EDUCATION -----------------

export const educationSchema = yup.object().shape({
  education: yup.string().required("* Education is required"),
  university: yup.string().required("* University/Institute is required"),
  major: yup.string().required("* Major is required"),
  startDate: yup.date().nullable().required("* Start Date is required"),
  endDate: yup.date().nullable().required("* End Date is required"),
  specialization: yup.string().optional(),
  grade: yup.string().optional(),
  description: yup.string().optional(),
});

// ----------------- CERTIFICATION -----------------

export const certificationSchema = yup.object().shape({
  certificateName: yup.string().required("* Certification Name is required"),
  completionId: yup.string().required("* Completion ID is required"),
  url: yup.string().url("Invalid URL").required("* Certificate URL is required"),
  startDate: yup.date().nullable().required("* Start Date is required"),
  endDate: yup.date().nullable().required("* End Date is required"),
});

// ----------------- PUBLICATION -----------------

export const publicationSchema = yup.object().shape({
  title: yup.string().required("* Title is required"),
  publisher: yup.string().required("* Publisher is required"),
  publishedDate: yup.date().nullable().required("* Published On date is required"),
  publisherUrl: yup.string().url("Invalid URL").optional(),
  author: yup.string().required("* Author is required"),
  description: yup.string().optional(),
});

// ----------------- BASIC INFO -----------------

export const basicInfoSchema = yup.object().shape({
  firstName: yup.string().trim().required("* Required Field"),
  lastName: yup.string().trim().required("* Required Field"),
  email: yup
    .string()
    .trim()
    .required("* Required Field")
    .test("valid-email", "Invalid Format", (value) =>
      !value || yup.string().email().isValidSync(value)
    ),
  address: yup.string().trim(),
  city: yup
    .string()
    .trim()
    .required("* Required Field")
    .test("valid-city", "Invalid Format", (value) =>
      !value || /^[A-Za-z\s]+$/.test(value)
    ),
  state: yup
    .string()
    .trim()
    .required("* Required Field")
    .test("valid-state", "Invalid Format", (value) =>
      !value || /^[A-Za-z\s]+$/.test(value)
    ),
  country: yup.string().trim().required("* Required Field"),
  zipcode: yup
    .string()
    .trim()
    .test("valid-zipcode", "Invalid Format", (value) =>
      !value || (/^\d+$/.test(value) && value.length >= 5 && value.length <= 10)
    ),
  phone: yup.string().required("* Required Field"),
  currentTitle: yup.string().trim().required("* Required Field"),
  industry: yup.string().trim(),
  dob: yup.date().nullable().required("* Required Field"),
});
