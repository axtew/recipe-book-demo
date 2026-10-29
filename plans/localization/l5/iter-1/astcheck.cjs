// Compares HEAD and working-tree versions of each changed file by AST shape:
// node kinds + identifier names + non-string literal text; comments and
// string/template literal contents are ignored.
const ts = require("C:/Users/stevv/Desktop/recipe-book/node_modules/typescript");
const { execSync } = require("child_process");
const fs = require("fs");
const root = "C:/Users/stevv/Desktop/recipe-book";
const files = execSync("git diff --name-only", { cwd: root }).toString().trim().split("\n").filter(Boolean);
const STR = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
]);
function sig(name, text) {
  const sf = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  (function walk(n) {
    if (STR.has(n.kind)) out.push("STR");
    else if (n.kind === ts.SyntaxKind.Identifier || n.kind === ts.SyntaxKind.NumericLiteral) out.push(n.kind + ":" + n.text);
    else out.push(String(n.kind));
    ts.forEachChild(n, walk);
  })(sf);
  return out.join("|");
}
let bad = 0, strChanged = 0;
const strings = (name, text) => {
  const sf = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  (function walk(n) { if (STR.has(n.kind)) out.push(n.text); ts.forEachChild(n, walk); })(sf);
  return out;
};
for (const f of files) {
  const head = execSync(`git show HEAD:${f}`, { cwd: root, maxBuffer: 1 << 26 }).toString();
  const cur = fs.readFileSync(root + "/" + f, "utf8");
  const same = sig(f, head) === sig(f, cur);
  const a = strings(f, head), b = strings(f, cur);
  const changed = a.filter((s, i) => s !== b[i]).length;
  strChanged += changed;
  if (!same) { bad++; console.log("AST DIFF", f); }
}
console.log(`files checked: ${files.length}, AST differences: ${bad}, changed string literals: ${strChanged}`);
let nonCyr = 0;
for (const f of files) {
  const head = execSync(`git show HEAD:${f}`, { cwd: root, maxBuffer: 1 << 26 }).toString();
  const cur = fs.readFileSync(root + "/" + f, "utf8");
  const a = strings(f, head), b = strings(f, cur);
  a.forEach((s, i) => { if (s !== b[i] && !/[А-Яа-яЁё]/.test(s)) { nonCyr++; console.log("NONCYR", f, s); } });
}
console.log("changed strings without Cyrillic in HEAD:", nonCyr);
