import { Question } from "./question.model";
export class Sujet{
    id:number;
    nom: string;
    descriptionSujet:Text;
    imageSujet : Blob;
    questions:Question[];

}