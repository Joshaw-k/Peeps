"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultDappAddress } from "../utils/constants";
import { useConnectWallet } from "@web3-onboard/react";
// import {
//   SUMMARY_HISTORY_CACHE_NAME,
//   SUMMARY_SEARCH_CACHE_NAME,
// } from "../helpers/constants";

interface IPeepsContext {
  wallet: any;
  connecting: boolean;
  connect: any;
  disconnect: any;
  baseDappAddress: string;
  updateBaseDappAddress: any;
}

const PeepsContext = createContext<IPeepsContext>({
  wallet: null,
  connecting: false,
  connect: null,
  disconnect: null,
  baseDappAddress: "",
  updateBaseDappAddress: null,
});

/*
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const getSummarySearchCache = () => {
  const defaultSummarySearchCache = null;
  let currentSearchCache = localStorage.getItem(SUMMARY_SEARCH_CACHE_NAME);
  if (!currentSearchCache) {
    currentSearchCache = localStorage.setItem(
      SUMMARY_SEARCH_CACHE_NAME,
      JSON.stringify(defaultSummarySearchCache)
    );
  }
  // console.log(isJsonString(currentSearchCache));
  // console.log(typeof currentSearchCache);

  return isJsonString(currentSearchCache)
    ? JSON.parse(currentSearchCache)
    : null;
};

export const updateSummarySearchCache = (rawData) => {
  // Save summary data to localStorage
  localStorage.setItem(SUMMARY_SEARCH_CACHE_NAME, JSON.stringify(rawData));
};

export const getSummaryHistoryCache = () => {
  let currentHistoryCache = localStorage.getItem(SUMMARY_HISTORY_CACHE_NAME);
  // console.log(currentHistoryCache);
  if (!currentHistoryCache) {
    currentHistoryCache = localStorage.setItem(SUMMARY_HISTORY_CACHE_NAME, []);
  }

  return isJsonString(currentHistoryCache)
    ? JSON.parse(currentHistoryCache)
    : [];
};

export const updateSummaryHistoryCache = (rawData) => {
  // Save search history data to localStorage
  // 1. Search query
  // 2. Search datetime
  const currentHistory = getSummaryHistoryCache();
  // console.log(currentHistory);
  currentHistory.push(rawData);
  localStorage.setItem(
    SUMMARY_HISTORY_CACHE_NAME,
    JSON.stringify(currentHistory)
  );
  // if (currentHistory) {
  // } else {
  //     localStorage.setItem(SUMMARY_HISTORY_CACHE_NAME, JSON.stringify(rawData));
  // }
};
*/

export interface PeepsProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const PeepsProvider: React.FC<PeepsProviderProps<any>> = ({
  children,
}: PeepsProviderProps) => {
  // const searchParams = new URLSearchParams(window.location.search);
  // const searchQuery = searchParams.get("search_query");
  const [baseDappAddress, setBaseDappAddress] =
    useState<string>(defaultDappAddress);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  /*
  const [baseData, setBaseData] = useState(getSummarySearchCache() || []);
  const [eventData, setEventData] = useState(null);
  const [mainQuery, setMainQuery] = useState("");
  const [eventOpened, setEventOpened] = useState(false);
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);
  const [moreSummary, setMoreSummary] = useState(baseData);

  const deleteSummarySearchCache = () => {
    localStorage.removeItem(SUMMARY_SEARCH_CACHE_NAME);
  };

  const readSummarySearchCache = (key) => {
    const parsedSummarySearchCache = getSummarySearchCache();
    return parsedSummarySearchCache ? parsedSummarySearchCache[key] : null;
  };

  const query = useCallback((searchInput) => {
    setMainQuery(searchInput);
  }, []);

  const updateSummaryBaseData = (newSummaryData) => {
    setBaseData(newSummaryData);
    // if (!newSummaryData.streaming) {
    //     updateSummarySearchCache(JSON.stringify(newSummaryData));
    // }
  };

  const updateMoreSummary = (moreSummaryData) => {
    setMoreSummary(moreSummaryData);
    // rewrite the localStorage
    // if (!moreSummaryData.streaming) {
    //     updateSummarySearchCache(JSON.stringify(moreSummaryData));
    // }
  };

  const summaryData = useCallback(
    (res) => {
      setBaseData(res);
    },
    [mainQuery]
  );
  */

  const updateBaseDappAddress = (newDappAddress: string) => {
    setBaseDappAddress(newDappAddress);
  };

  /*
  const summary = useCallback(
    (searchQuery: string) => {
      let isLoading = true;
      let isError = false;
      let nextPageData = null;

      const fetchConfig = {
        method: "GET",
        headers: {
          Accept: "application/json",
          // 'Origin': '*',
          // 'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        },
        modes: "cors", // options: cors, no-cors, same-origin
        withCredentials: false,
        cache: "default", // options: default, no-store, reload, no-cache, force-cache, only-if-cached
        params: {
          search_input: searchQuery,
        },
      };

      console.log("summary use callback");

      // Create a result dict and a result array to store the offline data from the streamed summary response
      let group_data;
      let resultArray = [];
      let resultGroupArray = [];
      let resultDict = { data: resultGroupArray };
      console.log(resultDict);

      console.log(searchQuery);

      if (!searchQuery) return;
      console.log(searchQuery);

      try {
        const eventSource = new EventSource(
          `${process.env.REACT_APP_BASE_URL}/summary?search_input=${searchQuery}`,
          { fetchConfig }
        );
        eventSource.onopen = (event) => {
          console.log("Opened Event stream useSummaryContext");
        };
        console.log(eventSource);
        if (eventSource.readyState === 1 || EventSource.CLOSED) {
          eventSource.close();
        }

        eventSource.onmessage = (event) => {
          console.log(event.data);
          setEventData(event.data);
        };
      } catch (err) {
        console.error(err);
        return;
      }

      // return () => {
      //     eventSource.close();
      //     console.log("Closed event source - event streaming");
      // }

      return { eventData, baseData };
    },
    [searchQuery]
  );
  */

  // useEffect(() => {
  //     setBaseData(baseData);
  //     console.log(baseData);
  // }, [baseData]);

  return (
    <PeepsContext.Provider
      value={{
        wallet,
        connecting,
        connect,
        disconnect,
        baseDappAddress,
        updateBaseDappAddress,
        // searchQuery,
        // summary,
        // eventData,
        // baseData,
        // updateSummaryBaseData,
        // mainQuery,
        // query,
        // summaryData,
        // eventOpened,
        // setEventOpened,
        // isFetchingSummary,
        // setIsFetchingSummary,
        // moreSummary,
        // updateMoreSummary,
      }}
    >
      {children}
    </PeepsContext.Provider>
  );
};

export const usePeepsContext = () => useContext(PeepsContext);

export default PeepsProvider;
