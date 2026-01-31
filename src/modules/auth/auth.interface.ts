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


export interface userType{
    id:string,
    name: string,
    email: string,
    role:string|undefined,
    emailVerified:boolean
  }

  