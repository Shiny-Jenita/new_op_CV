import * as yup from "yup";

const scoreSchema = yup
  .array()
  .of(
    yup.object({
      type: yup
        .string()
        .oneOf(["none", "gpa", "cgpa"], "Must be either 'none', 'gpa' or 'cgpa'")
        .notRequired(), // Changed from required to notRequired
      value: yup
        .string()
        .nullable()
        // Only require value when type is gpa or cgpa
        .when('type', {
          is: (type) => type === 'gpa' || type === 'cgpa',
          then: (schema) => schema.required('* Score value is required when GPA/CGPA is selected'),
          otherwise: (schema) => schema.notRequired(),
        })
        .test(
          "is-numeric",
          "* Score must be a number",
          (val, context) => {
            // Skip validation if type is none or empty
            if (context.parent.type === 'none' || !context.parent.type) return true;
            // Allow empty values when not required
            if (val === null || val === "") return context.parent.type !== 'gpa' && context.parent.type !== 'cgpa';
            return !isNaN(parseFloat(val));
          }
        )
        .test(
          "decimal-precision",
          "* Score can have at most 2 decimal places",
          (val, context) => {
            // Skip validation if type is none or empty
            if (context.parent.type === 'none' || !context.parent.type) return true;
            if (val === null || val === "") return context.parent.type !== 'gpa' && context.parent.type !== 'cgpa';
            const decimalRegex = /^\d+(\.\d{1,2})?$/;
            return decimalRegex.test(val);
          }
        )
        .test(
          "gpa-range",
          "* GPA must be between 0.0 and 5.0",
          function (val) {
            const { type } = this.parent;
            if (type === "gpa" && val !== null && val !== "") {
              const numVal = parseFloat(val);
              return numVal >= 0.0 && numVal <= 5.0;
            }
            return true;
          }
        )
        .test(
          "cgpa-range",
          "* CGPA must be between 0.0 and 10.0",
          function (val) {
            const { type } = this.parent;
            if (type === "cgpa" && val !== null && val !== "") {
              const numVal = parseFloat(val);
              return numVal >= 0.0 && numVal <= 10.0;
            }
            return true;
          }
        ),
    })
  )
  .notRequired();


const validateWebsiteUrl = (value) => {
  if (!value || value.trim() === "") return true;
  const cleanUrl = value.replace(/^https?:\/\//, '');
  if (!cleanUrl.startsWith('www.')) {
    return false;
  }

  const urlPattern = /^www\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\w\.-]*)*\/?$/;
  return urlPattern.test(cleanUrl);
};
// Main resume form schema
export const resumeFormSchema = yup.object().shape({
  firstName: yup.string().required("* First name is required"),
  lastName: yup.string().required("* Last name is required"),
  dob: yup.date().required("* Date of birth is required"),
  email: yup.string().email("Invalid email").required("* Email is required"),
  address: yup.string().optional(),
  city: yup.string().required("* City is required"),
  state: yup.string().required("* State is required"),
  country: yup.string().required("* Country is required"),
  zipcode: yup.string().optional(),
  phone: yup
    .string()
    .required("* Phone number is required")
    .matches(
      /^\+?[0-9\s\-().]{7,20}$/,
      "Invalid phone number format"
    )
  ,
  currentTitle: yup.string().required("* Title/Position is required"),
  industry: yup.string().optional(),
  websites: yup.array().of(
    yup.object().shape({
      type: yup.string(), // Not required
      url: yup.string()
        .test(
          "website-url-validation",
          "Invalid URL (e.g., www.example.com)",
          validateWebsiteUrl
        ), // Not re // Not required
    })
  ),
  languages: yup.array().of(
    yup.object().shape({
      name: yup.string(), // Not required
      proficiency: yup.string(), // Not required
      skills: yup.array().of(yup.string()), // Not required
    })
  ),
  experience: yup.array().of(
    yup.object().shape({
      companyName: yup.string().required("* Company Name is required"),
      jobTitle: yup.string().required("* Job Title is required"),
      location: yup.string(),
      startDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .typeError("* Start Date is required")
        .required("* Start Date is required"),
      endDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .typeError("* End Date is required")
        .when('currentlyWorking', {
          is: true,
          then: (schema) => schema.nullable(),
          otherwise: (schema) => schema.required("* End Date is required")
        }),

      currentlyWorking: yup.boolean().default(false),

      responsibilities: yup
        .array()
        .of(yup.string().trim().required("* Responsibility cannot be empty"))
        .min(1, "* At least one responsibility is required")
        .required("* Responsibilities is required"),
    })
  ),
  education: yup
    .array()
    .of(
      yup.object().shape({
        level: yup.string().required("* Education level is required"),
        university: yup.string().required("* Institution name is required"),
        major: yup.string().required("* Degree is required"),
        specialization: yup.string().optional(),
        location: yup.string(),
        currentlyEnrolled: yup.boolean().default(false),
        startDate: yup
          .date()
          .transform((value, original) =>
            original === "" ? null : value
          )
          .nullable()
          .typeError("* Invalid start date")
          .required("* Start date is required"),
        endDate: yup
          .date()
          .transform((value, original) =>
            original === "" ? null : value
          )
          .nullable()
          .typeError("* Invalid end date")
          .when('currentlyEnrolled', {
            is: true,
            then: (schema) => schema.nullable(),
            otherwise: (schema) => schema
              .required("* End date is required")
              .min(
                yup.ref("startDate"),
                "* End date must be after start date"
              )
          }),
        score: scoreSchema,
        description: yup.array().of(yup.string()).optional(),
        scoreJson: yup.string().optional(),
      })
    )
    .optional(),
  projects: yup.array().of(
    yup.object().shape({
      projectName: yup.string().required("* Project Name is required"),
      projectDescription: yup.array().of(yup.string()).optional(),
      projectUrl: yup.string(),
    })
  ),
  publications: yup.array().of(
    yup.object().shape({
      title: yup.string().required("* Title is required"),
      author: yup.string().required("* Author/'s is required"),
      description: yup.array().of(yup.string()), // Optional
      publisherUrl: yup.string().nullable(), // Optional
      publishedDate: yup
        .date()
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .typeError("* Published Date must be a valid date")
        .required("* Publication Date is required")// Don't add `.required()` if optional
    })
  ),
  certifications: yup.array().of(
    yup.object().shape({
      name: yup.string().required("* Certificate Name is required"), // Not required
      completionId: yup.string(),
      issuer: yup.string(), // Not required
      url: yup.string(), // Not required
      startDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue === "" ? null : value;
        })
        .nullable()
        .optional(),

      endDate: yup
        .date()
        .transform((value, originalValue) => {
          return originalValue === "" ? null : value;
        })
        .nullable()
        .optional(),
    })
  ),
});