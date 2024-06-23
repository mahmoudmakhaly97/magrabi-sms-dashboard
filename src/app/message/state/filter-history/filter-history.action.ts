import { filterModel } from "../../models/filter.model";

export class FilterHistoryAction {
    static readonly type = '[historyState] FilterHistoryAction';
    constructor(public filterModel:filterModel) {}
  }