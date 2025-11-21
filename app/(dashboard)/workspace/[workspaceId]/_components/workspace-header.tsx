"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

interface WorkspaceHeaderProps {}

export const WorkspaceHeader = ({}: WorkspaceHeaderProps) => {
  const { data } = useSuspenseQuery(orpc.channel.list.queryOptions());

  return (
    <h2 className="text-lg font-semibold">{data.currentWorkspace.orgName}</h2>
  );
};
