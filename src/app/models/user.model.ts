import { Role } from "./role.model";
export class User{
    id:Number;
    email:string ;
    nomUser:String;
    password:string ;
    roles:Role[];
   // token: any;
    statut:string;
    userFonction:String;
    validatedAt:Date;
    createdAt:Date;
    remarque:String; 
    token?:string;
}