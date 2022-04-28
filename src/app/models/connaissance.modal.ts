import { Sujet } from "./sujet.model";
import { User } from "./user.model";

export  class Connaissance{
    id : Number ; 
    user : User;
    contenuConnaissance : Text;
    sujet: Sujet[];
    createdAt : Date;
    updatedAt : Date;
    statutValidation: boolean;
}