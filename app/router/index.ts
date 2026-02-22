import { createWorkspace, listWorkspaces } from "@/app/router/workspace";
import { createChannel, getChannel, listChannels } from "@/app/router/channel";
import {
  createMessage,
  listMessages,
  listThreadReplies,
  updateMessage,
} from "@/app/router/message";
import { inviteMember, listMembers } from "@/app/router/member";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
    member: {
      list: listMembers,
      invite: inviteMember,
    },
  },
  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
    update: updateMessage,
    thread: {
      list: listThreadReplies,
    },
  },
};
