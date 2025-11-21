import { createWorkspace, listWorkspaces } from "@/app/router/workspace";
import { createChannel, listChannels } from "@/app/router/channel";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
  },
  channel: {
    create: createChannel,
    list: listChannels,
  },
};
