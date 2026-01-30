import type { ROLE } from "../../../generated/prisma/enums";

export interface resisterData{
name:string,
email:string,
password:string,
role:ROLE
}

export interface loginData{
email:string,
password:string,
role:ROLE
}


  