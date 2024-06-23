import { tempConfig } from "../models/tempConfig.model";

export class GetAllTemplateAction {
    static readonly type = '[messageState] GetAllTemplateAction';
    constructor() {}
  }
export class EditTemplateAction {
    static readonly type = '[messageState] EditTemplateAction';
    constructor(public template:tempConfig) {}
  }
export class updateTemplateStatusAction {
    static readonly type = '[messageState] updateTemplateStatusAction';
    constructor(public template:tempConfig) {}
  }

