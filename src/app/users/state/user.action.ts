import { addUser } from "../models/user.model";

export class AddUserAction {
    static readonly type = '[addUserState] AddUserAction';
    constructor(public user:addUser) {}
  }
export class GetAllUserAction {
    static readonly type = '[addUserState] GetAllUserAction';
    constructor() {}
  }