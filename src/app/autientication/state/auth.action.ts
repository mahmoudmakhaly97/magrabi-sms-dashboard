import { AuthLogin } from "../models/auth.model";

export class LoginAction {
    static readonly type = '[authState] LoginAction';
    constructor(public credentails:AuthLogin) {}
  }
export class SetTokenAction {
    static readonly type = '[authState] SetTokenAction';
    constructor(public token:string) {}
  }
export class GetTokenAction {
    static readonly type = '[authState] GetTokenAction';
    constructor() {}
  }
export class RemoveTokenAction {
    static readonly type = '[authState] RemoveTokenAction';
    constructor() {}
  }
export class GetRoleBaseAction {
    static readonly type = '[authState] GetRoleBaseAction';
    constructor() {}
  }
export class GetUsernameAction {
    static readonly type = '[authState] GetUsernameAction';
    constructor() {}
  }
export class LogoutAction {
    static readonly type = '[authState] LogoutAction';
    constructor() {}
  }
