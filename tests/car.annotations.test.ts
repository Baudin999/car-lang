import { transpile } from "../src/transpiler";
import { IType, IData, ITypeField, IDataOption } from "../src/outline";

/*
# Annotations 

Annotations are part of a type and as such are part of the documentation. We
should think of annotations not as comments but as descriptions. There are two
types of annotations, the "description" kind:

@ This is a description in the form of an annotation
@ it can span multiple lines.
type Person

There is also a qualified annotation:

@ ignore: true
@ aggregate: Person
type person

There qualified annotations are used in the rest of the application to generate
certain patterns. 

*/

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Annotations should be possible on a type and the fields", () => {
    const source = `

@ This is a multiline annotation
@ Which should just work
type Person =
    FirstName: Name
    @ This is the last name
    @ type: String
    LastName: Name
    Age: Number
        | min 0
        | max 150

@ A Maybe data type, just like in the 
@ pretty languages...
data Maybe a =
    @ This is a description
    @ type: Just a
    | Just a
    @ Return nothing
    | Nothing

@ An alias can also have a description
@ But no annotations on the restrictions
alias Name = String
    | min 2
    | max 50
    | pattern /[A-Z]\w+/

choice Gender =
    @ Male
    | "Male"
    @ Female
    | "Female"
`;

    const { tokens, errors, ast } = transpile(source);

    it("AST should be defined", () => {
        expect(ast).toBeDefined();
        expect(errors.length).toEqual(0);
    });

    it("Should have one annotation with the key 'description'", () => {
        expect((ast[0] as IType).annotations.length).toEqual(1);
        expect((ast[1] as IData).annotations.length).toEqual(1);
    });

    it("Should be possible for fields to contain annotations", () => {
        expect(((ast[0] as IType).fields[0] as ITypeField).annotations.length).toEqual(0);
        expect(((ast[0] as IType).fields[1] as ITypeField).annotations.length).toEqual(2);
        expect(((ast[1] as IData).options[0] as IDataOption).annotations.length).toEqual(2);
        expect(((ast[1] as IData).options[1] as IDataOption).annotations.length).toEqual(1);
    });
});
