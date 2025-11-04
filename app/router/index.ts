import { createWorkspace, listWorkspaces } from "@/app/router/workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
  },
};
