import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

it("should not throw an error because of no test", () => {
  expect(2).toEqual(2);
});
// describe("Define simple variable declarations", () => {
//   const source = `

// let a = 12

// let b = "Baudin"

// `;

//   const { cst, ast, errors } = transpile(source);

//   it("We should be able to tokenize", () => {
//     expect(ast).toBeDefined();
//   });
// });

// describe("Define simple function", () => {
//   const source = `

// let sum a b = a + b

// `;

//   const { cst, tokens, ast, errors } = transpile(source);

//   //log(cst);

//   it("We should be able to tokenize", () => {
//     expect(ast).toBeDefined();
//   });
// });

// describe("Define simple function", () => {
//   const source = `

// let sum = List.sum

// `;

//   const { cst, tokens, ast, errors } = transpile(source);

//   log(cst);

//   it("We should be able to tokenize", () => {
//     expect(ast).toBeDefined();
//   });
// });
