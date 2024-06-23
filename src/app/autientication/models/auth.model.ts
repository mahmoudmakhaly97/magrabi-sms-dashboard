export interface AuthLogin{
    username:string;
    password:string;
    token?:string
}
export interface AuthRegister{
    email:string;
    password:string;
    roleID:string;
    username:string
}