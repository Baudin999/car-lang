import { transpile } from "../../src/transpiler";
import { createXSD } from "../../src/xsd/createXSD";

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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);
  //console.log(xsd);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);
  //console.log(xsd);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);
  //console.log(xsd);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);

  // console.log(xsd);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);

  // console.log(xsd);

  it("Should not contain errors", () => {
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

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);
  // console.log(xsd);

  it("Should not contain errors", () => {
    expect(errors.length).toEqual(0);
  });
});
