import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm : FormGroup

  constructor(private userService : UserService , private  formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email :["",[Validators.required,Validators.email]],
      password :["",[Validators.required, Validators.minLength(8)]],
      confirmpassword: [""],
    },
    {validators: this.passwordErrorValidator});
  }
  passwordErrorValidator = (control: FormGroup) => {
    const password = control.value.password;
    const confirmpassword = control.value.confirmpassword;

    return password !== confirmpassword
      ? control.get('confirmpassword').setErrors({ passwordMismatch: true })
      : control.get('confirmpassword').setErrors(null);
  }

  resetPassword(){
    this.userService.getUserByEmail(this.resetPasswordForm.get('email').value).subscribe((response)=>{
      if (response.length>0){
        let body={
          password : this.resetPasswordForm.get('password').value
        }
        this.userService.resetPassword(response[0].id,body).subscribe((response)=>{
            console.log(response);
        })
      }
})}
}

