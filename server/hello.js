import { z } from "zod";

const schema = z.object({
  fullname: z.string().trim(),
});

const objec = {
  fullname: 1,
};

const valid = schema.safeParse(objec);

console.log(valid);
