
/*
GENERATED ON: 1560591986280
*/ 


// The Maybe Monad implemented in TypeScript
type Maybe<T> = Nothing<T> | Just<T>

class Just<T> {
  a: T;
  constructor(a) {
    if (a !== null && a !== undefined) this.a = a;
    // @ts-ignore
    else return new Nothing();
  }
}

class Nothing<T> {}

// IMPLEMENTATION

type XP = number;
enum BoughtFrom {
    Racial_Package = "Racial Package",
    Professional_Package = "Professional Package",
    XP = "XP",
    Gift = "Gift",
    Other = "Other"
}
type IStat = Strength | Agility | Intuition | Perception | Charisma | None;
interface INamable {
    Name: string;
    Description: string;
}
  


interface IBuyable {
    Source: BoughtFrom;
    Stat: IStat;
    Bought: boolean;
    Skilled: boolean;
    Professional: boolean;
    Master: boolean;
}
  

/**
A skill is something a character can do
 */
interface ISkill {
    Name: string;
    Description: string;
    Source: BoughtFrom;
    Stat: IStat;
    Bought: boolean;
    Skilled: boolean;
    Professional: boolean;
    Master: boolean;
}
  


interface IResistance {
    Name: string;
    Description: string;
    Source: BoughtFrom;
    Stat: IStat;
    Bought: boolean;
    Skilled: boolean;
    Professional: boolean;
    Master: boolean;
}
  


interface ISpecial {
    Name: string;
    Description: string;
    Source: BoughtFrom;
    Stat: IStat;
    Bought: boolean;
    Skilled: boolean;
    Professional: boolean;
    Master: boolean;
}
  


interface IFeat {
    Rank: number;
    XP: number;
    Stat: IStat;
    Name: string;
    Description: string;
}
  

/**
A statistic is a base value for a character's potential Statistics serve as a
 base bonus for certain abilities.
 */
interface IStatistic {
    Stat: IStat;
    Description: string;
    XP: XP;
    Value: number;
}
  


interface ICharacter {
    Name: string;
    Skills: ISkill[];
    Specials: ISpecial[];
    Feats: IFeat[];
    Strength: IStatistic;
    Agility: IStatistic;
    Intuition: IStatistic;
    Perception: IStatistic;
    Charisma: IStatistic;
}
  
    