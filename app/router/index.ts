import { createWorkspace, listWorkspaces } from "@/app/router/workspace";
import { createChannel, listChannels } from "@/app/router/channel";
import { createMessage } from "@/app/router/message";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
  },
  channel: {
    create: createChannel,
    list: listChannels,
  },
  message: {
    create: createMessage,
  },
};
