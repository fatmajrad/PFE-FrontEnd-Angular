import { Sujet } from "./sujet.model";
import { User } from "./user.model";

export  class Connaissance{
    id : Number ; 
    user : User;
    contenuConnaissance : String;
    sujet: Sujet[];
    createdAt : Date;
    updatedAt : Date;
    statut: String;
}