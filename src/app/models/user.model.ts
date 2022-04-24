import { Role } from "./role.model";
export class User{
    id:Number;
    email:string ;
    nomUser:String;
    password:string ;
    roles:Role[];
    token: any;
    statutValidation:boolean;
    userFonction:String;
    validatedAt:Date;
    demandedAt:Date;

    
}