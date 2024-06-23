import { smsProviderModel } from "../../models/quickMessage.model";

export class PostSmsProviderAction {
    static readonly type = '[smsProviderState] PostSmsProviderAction';
    constructor(public smsModel:smsProviderModel) {}
  }