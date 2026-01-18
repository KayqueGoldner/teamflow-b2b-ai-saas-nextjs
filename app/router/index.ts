import { createWorkspace, listWorkspaces } from "@/app/router/workspace";
import { createChannel, getChannel, listChannels } from "@/app/router/channel";
import { createMessage, listMessages } from "@/app/router/message";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
  },
  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
  },
};
