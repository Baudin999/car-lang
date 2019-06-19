# XSD generation from ZDragon

_DISCLAIMER: These examples are contrived to keep the resulting XSD schemas as short as possible.
Please do not confuse these examples with real world implementations._

In this example we will try and define a simple type which we can export to XML. This type is
defined as:

```
type Person =
    FirstName: String
    LastName: Maybe String
    DateOfBirth: Date
```

The resulting XSD looks like:

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:element name="Person_FirstName" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_LastName" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_DateOfBirth" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:date"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_FirstName" minOccurs="1" />
            <xsd:element ref="self:Person_LastName" minOccurs="0" />
            <xsd:element ref="self:Person_DateOfBirth" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

Notice the following things:

## Naming

For each field in the Person type we generate an element in the XSD, this element has the following
name: _Type_\__Element_ because types are uniquely named in the car lang this will not lead to
collisions.

If we have a `Maybe` type, like `LastName: Maybe String`, this is translated into an element with
`minOccurs="0"`. All the generated elements have `nillable="false"`. This construct means that you
can leave an element out of the XML document, but if you put it in, it needs to have a valid value.

## Data Types

In z-dragon we have the following base types:

- String
- Char
- Number
- Boolean
- Date
- Time
- DateTime

These translate into the following XSD types:

```
type Person =
    FirstName: String
    LastName: Maybe String
    DateOfBirth: Date
    Age: Number
    Active: Boolean
    LastModified: DateTime
    DoNotContactAfter: Time
    GenderCharacter: Char
```

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:element name="Person_FirstName" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_LastName" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_DateOfBirth" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:date"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_Age" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:integer">
              <xsd:minInclusive value="1" />
              <xsd:maxInclusive value="9999" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_Active" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:boolean"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_LastModified" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:dateTime"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_DoNotContactAfter" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:time"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_GenderCharacter" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="1" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_FirstName" minOccurs="1" />
            <xsd:element ref="self:Person_LastName" minOccurs="0" />
            <xsd:element ref="self:Person_DateOfBirth" minOccurs="1" />
            <xsd:element ref="self:Person_Age" minOccurs="1" />
            <xsd:element ref="self:Person_Active" minOccurs="1" />
            <xsd:element ref="self:Person_LastModified" minOccurs="1" />
            <xsd:element ref="self:Person_DoNotContactAfter" minOccurs="1" />
            <xsd:element ref="self:Person_GenderCharacter" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

## Restrictions

Restrictions are the way we "scope" our values. For example, if the age of a person is numberic
value between 0 and 130 we can write this as:

```
type Person =
    Age: Number
        | min 0
        | max 130
```

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:element name="Person_Age" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:integer">
              <xsd:minInclusive value="0" />
              <xsd:maxInclusive value="130" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_Age" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

We can also use patterns:

```
type Person =
    Name: String
        | min 1
        | max 31
        | pattern /[A-Z][a-z]{30}/
```

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:element name="Person_Name" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="31" />
              <xsd:pattern value="/[A-Z][a-z]{30}/" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_Name" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

Keep in mind that we do not inspect the pattern. So saying things like like: "But the pattern
already specifies the min and the max length of the name.", are not valid in the contect of zdragon.

# Aliassing

Some times it is too much work to keep writing the same patterns over and over, this is when we can
use a zdragon concept called an Alias.

```
alias Name = String
    | min 1
    | max 31
    | pattern /[A-Z][a-z]{30}/


type Person =
    FirstName: Name
    LastName: Name
```

```xml
<xsd:schema
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"

      xmlns:self="http://xsd.essent.nl"
      targetNamespace="http://xsd.essent.nl">
      <!-- VERSION: 1.0 -->
      <xsd:simpleType name="Name">
        <xsd:restriction base="xsd:string">
          <xsd:minLength value="1" />
          <xsd:maxLength value="31" />
          <xsd:pattern value="/[A-Z][a-z]{30}/" />
        </xsd:restriction>
      </xsd:simpleType>
      <xsd:element name="Person_FirstName" type="self:Name" nillable="false">
        <xsd:annotation></xsd:annotation>
      </xsd:element>
      <xsd:element name="Person_LastName" type="self:Name" nillable="false">
        <xsd:annotation></xsd:annotation>
      </xsd:element>
      <xsd:complexType name="Person">
        <xsd:all>
          <xsd:element ref="self:Person_FirstName" minOccurs="1"/>
          <xsd:element ref="self:Person_LastName" minOccurs="1"/>
        </xsd:all>
      </xsd:complexType>
    </xsd:schema>
```

If you want to reuse fields described in other types you can easilly pluck them from these types
using the following syntax:

```
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
```

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:simpleType name="Name">
          <xsd:restriction base="xsd:string">
            <xsd:minLength value="1" />
            <xsd:maxLength value="31" />
            <xsd:pattern value="/[A-Z][a-z]{30}/" />
          </xsd:restriction>
        </xsd:simpleType>
        <xsd:element name="Address_Street" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="Address">
          <xsd:all>
            <xsd:element ref="self:Address_Street" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
        <xsd:element name="Person_FirstName" type="self:Name" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:element name="Person_LastName" type="self:Name" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:element name="Person_Address" type="self:Address" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_FirstName" minOccurs="1" />
            <xsd:element ref="self:Person_LastName" minOccurs="1" />
            <xsd:element ref="self:Person_Address" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
        <xsd:element name="Customer_Name" type="self:Name" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:element name="Customer_Address" type="self:Address" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:complexType name="Customer">
          <xsd:all>
            <xsd:element ref="self:Customer_Name" minOccurs="1" />
            <xsd:element ref="self:Customer_Address" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

## Choices - Emumerations

Sometimes we want to have a single choice, an enumeration:

```
choice Gender =
    | "Male"
    | "Female"
    | "Other"

type Person =
    Name: String
    Gender: Gender
```

```xml
 <xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:complexType name="Gender">
          <xsd:choice>
            <xsd:element name="Male"/>
            <xsd:element name="Female"/>
            <xsd:element name="Other"/>
          </xsd:choice>
        </xsd:complexType>
        <xsd:element name="Person_Name" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="Person_Gender" type="self:Gender" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_Name" minOccurs="1" />
            <xsd:element ref="self:Person_Gender" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
      </xsd:schema>
```

## Data Elements

Data element is used when you have a choice between two complex types.

```
type Foo

type Bar

data FooBar =
    | Foo
    | Bar
```

```xml
 <xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:complexType name="Foo">
          <xsd:all></xsd:all>
        </xsd:complexType>
        <xsd:complexType name="Bar">
          <xsd:all></xsd:all>
        </xsd:complexType>
        <xsd:complexType name="FooBar">
          <xsd:choice>
            <xsd:element type="self:Foo" name="FooBar_Foo" />
            <xsd:element type="self:Bar" name="FooBar_Bar" />
          </xsd:choice>
        </xsd:complexType>
      </xsd:schema>
```

```
type Person =
    Id: CustomerIdentifier

type KvK =
    Number: String
    MembershipDate: Date

alias CustomerNumber = String

data CustomerIdentifier =
    | KvK
    | CustomerNumber
```

```xml
<xsd:schema
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"

        xmlns:self="http://xsd.essent.nl"
        targetNamespace="http://xsd.essent.nl">
        <!-- VERSION: 1.0 -->
        <xsd:element name="Person_Id" type="self:CustomerIdentifier" nillable="false">
          <xsd:annotation></xsd:annotation>
        </xsd:element>
        <xsd:complexType name="Person">
          <xsd:all>
            <xsd:element ref="self:Person_Id" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
        <xsd:element name="KvK_Number" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:string">
              <xsd:minLength value="1" />
              <xsd:maxLength value="100" />
            </xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:element name="KvK_MembershipDate" nillable="false">
          <xsd:annotation></xsd:annotation>
          <xsd:simpleType>
            <xsd:restriction base="xsd:date"></xsd:restriction>
          </xsd:simpleType>
        </xsd:element>
        <xsd:complexType name="KvK">
          <xsd:all>
            <xsd:element ref="self:KvK_Number" minOccurs="1" />
            <xsd:element ref="self:KvK_MembershipDate" minOccurs="1" />
          </xsd:all>
        </xsd:complexType>
        <xsd:simpleType name="CustomerNumber">
          <xsd:restriction base="xsd:string">
            <xsd:minLength value="1" />
            <xsd:maxLength value="100" />
          </xsd:restriction>
        </xsd:simpleType>
        <xsd:complexType name="CustomerIdentifier">
          <xsd:choice>
            <xsd:element type="self:KvK" name="CustomerIdentifier_KvK" />
            <xsd:element type="self:CustomerNumber" name="CustomerIdentifier_CustomerNumber" />
          </xsd:choice>
        </xsd:complexType>
      </xsd:schema>
```
