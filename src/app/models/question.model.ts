import { Sujet } from "./sujet.model";
import { User } from "./user.model";

export class Question{
   id: number;
   intituleQuestion:String;
   descriptionQuestion:Text;
   imageCode:Blob;
   fragmenCode:Blob;
   user:Number; 
   tag : Sujet[]
}