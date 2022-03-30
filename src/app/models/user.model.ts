import { Role } from "./role.model";
export class User{
    id:number;
    email:string ;
    nomUser:String;
    password:string ;
    roles:Role[];
    token: any;
   /* statutValidation:boolean;
    userFonction:String;
    validatedAt:Date;
    demandedAt:Date;*/
}