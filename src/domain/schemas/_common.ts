import { z } from "zod";

// Primitives the entity schemas are built from. The limits repeat the check constraints of
// the database schema and invent nothing beyond them: a mismatch between what
// the form lets through and what Postgres accepts is an error the user sees
// only after pressing “Save”.

/** A name after trimming whitespace; empty does not pass. */
export const nameSchema = z.string().trim().min(1);

/** A reference to a row of another table. */
export const idSchema = z.uuid();

/** One of the four nutrition numbers per 100 g. Null — the numbers are not filled in yet. */
export const nutrientPer100Schema = z.number().nonnegative().nullable();

/** A date without time, `YYYY-MM-DD`. That is how it is stored in the database and how it lives in the app. */
export const dateSchema = z.iso.date();
