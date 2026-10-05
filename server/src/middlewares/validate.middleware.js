export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.validatedData = {
      ...req.validatedData,
      ...result.data,
    };
    next();
  };
};

/* 
{
  success: false,

  error: ZodError {
    issues: [
      {
        path: ["body", "name"],
        message: "Too small: expected string to have >=2 characters"
      },
      {
        path: ["body", "email"],
        message: "Invalid email address"
      },
      {
        path: ["body", "password"],
        message: "Too small: expected string to have >=8 characters"
      }
    ]
  }
} */

/* 

{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "priority",
      "message": "Priority must be low, medium, or high"
    },
    {
      "field": "status",
      "message": "Status must be todo, in-progress, or completed"
    }
  ]
}

*/

/* 
import { z } from "zod";

// 1. Define schema
const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8),
  }),
});

// 2. Dummy incoming request
const req = {
  body: {
    name: "  Balakumaran  ",
    email: "  BALA@GMAIL.COM  ",
    password: "password123",
  },
  params: {},
  query: {},
};

// 3. Call safeParse
const result = registerSchema.safeParse({
  body: req.body,
  params: req.params,
  query: req.query,
});

// 4. Check result
console.log("SUCCESS:", result.success);

// 5. Print parsed data
console.log("RESULT DATA:", result.data);

// 6. Store parsed data on req
req.validatedData = {
  ...req.validatedData,
  ...result.data,
};

// 7. Print validated data
console.log("VALIDATED DATA:", req.validatedData);

// 8. Access controller data
const { name, email, password } = req.validatedData.body;

console.log("NAME:", name);
console.log("EMAIL:", email);
console.log("PASSWORD:", password); */


