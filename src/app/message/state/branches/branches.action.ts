import { createBranch } from "../../models/branch.model";

export class AddNewBranchAction {
    static readonly type = '[branchState] AddNewBranchAction';
    constructor(public branchModel:createBranch) {}
  }
export class EditBranchAction {
    static readonly type = '[branchState] EditBranchAction';
    constructor(public branchModel:createBranch) {}
  }
export class GetAllBranchesAction {
    static readonly type = '[branchState] GetAllBranchesAction';
    constructor() {}
  }
export class GetBranchByIdAction {
    static readonly type = '[branchState] GetBranchByIdAction';
    constructor(public areaId:number) {}
  }
export class GetAllAreasAction {
    static readonly type = '[branchState] GetAllAreasAction';
    constructor(public regionId:number) {}
  }