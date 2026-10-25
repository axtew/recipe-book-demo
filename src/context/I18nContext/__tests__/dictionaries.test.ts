import { describe, expect, it } from "vitest";

/** Every file of `public/dictionaries/`, found by pattern so a new language is covered without edits here. */
const dictionaries = import.meta.glob<unknown>("../../../../public/dictionaries/*.json", {
  eager: true,
  import: "default",
});

const REFERENCE_FILE = "ru.json";

function getFileName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/** Dotted paths of every leaf; array items are addressed by index. */
function collectLeaves(node: unknown, path: string, leaves: Map<string, unknown>) {
  if (typeof node === "object" && node !== null) {
    for (const [key, child] of Object.entries(node)) {
      collectLeaves(child, path === "" ? key : `${path}.${key}`, leaves);
    }
    return;
  }

  leaves.set(path, node);
}

function getLeaves(fileName: string): Map<string, unknown> {
  const entry = Object.entries(dictionaries).find(([path]) => getFileName(path) === fileName);
  const leaves = new Map<string, unknown>();

  collectLeaves(entry?.[1], "", leaves);

  return leaves;
}

const dictionaryFiles = Object.keys(dictionaries).map(getFileName);

describe("dictionaries", () => {
  it("include the reference dictionary", () => {
    expect(dictionaryFiles).toContain(REFERENCE_FILE);
  });

  it("include more than the reference dictionary", () => {
    expect(dictionaryFiles.length).toBeGreaterThan(1);
  });

  describe.each(dictionaryFiles)("%s", (fileName) => {
    it("has exactly the keys of the reference dictionary", () => {
      const keys = [...getLeaves(fileName).keys()].sort();
      const referenceKeys = [...getLeaves(REFERENCE_FILE).keys()].sort();

      expect(keys).toEqual(referenceKeys);
    });

    it("has a non-empty string in every leaf", () => {
      for (const [path, value] of getLeaves(fileName)) {
        expect(typeof value, path).toBe("string");
        expect((value as string).trim(), path).not.toBe("");
      }
    });
  });
});
