import { createXSD } from "../../src/transformations/xsd/createXSD";
import { fakeModule } from "../fakes";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("A Type can be converted into an XSD", () => {
  const source = `

type Person =
    FirstName: String
    LastName: Maybe String    
    DateOfBirth: Date

`;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test all of the base types", () => {
  const source = `
  
type Person =
    FirstName: String
    LastName: Maybe String    
    DateOfBirth: Date
    Age: Number
    Active: Boolean
    LastModified: DateTime
    DoNotContactAfter: Time
    GenderCharacter: Char
  
  `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test Restrictions", () => {
  const source = `
    
type Person =
    Age: Number
        | min 0
        | max 130
    
    `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test Patterns", () => {
  const source = `
      
type Person =
    Name: String
        | min 1
        | max 31
        | pattern /[A-Z][a-z]{30}/
    
      `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test the ALIAS", () => {
  const source = `

alias Name = String
    | min 1
    | max 31
    | pattern /[A-Z][a-z]{30}/

    
type Person =
    FirstName: Name
    LastName: Name
        `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test Plucking", () => {
  const source = `
  
alias Name = String
    | min 1
    | max 31
    | pattern /[A-Z][a-z]{30}/

type Address =
    Street: String
    
type Person =
    FirstName: Name
    LastName: Name
    Address: Address

type Customer =
    Name: Person.FirstName
    pluck Person.Address
          `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test Enumerations", () => {
  const source = `
    
choice Gender =
    | "Male"
    | "Female"
    | "Other"

type Person =
    Name: String
    Gender: Gender
            `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("Test Data", () => {
  const source = `
      
type Person =
    Id: CustomerIdentifier
    
type KvK = 
    Number: String
    MembershipDate: Date

alias CustomerNumber = String

data CustomerIdentifier =
    | KvK
    | CustomerNumber
              `;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});
