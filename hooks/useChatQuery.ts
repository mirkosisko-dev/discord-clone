import qs from "query-string";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/SocketProvider";

interface IChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: IChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam = undefined,
  }: {
    pageParam: any;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      {
        skipNull: true,
      },
    );

    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetching, status };
};

export default useChatQuery;
