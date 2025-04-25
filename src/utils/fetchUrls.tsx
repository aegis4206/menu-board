import useFetchActions from './fetchActions';

export const useFetch = <T=unknown>() => useFetchActions<T>("");

export const useAdminUser = <T=unknown>() => useFetchActions<T>("auth/user");
export const usePosts = <T=unknown>() => useFetchActions<T>("posts");
export const useTypes = <T=unknown>() => useFetchActions<T>("types");
export const useTabs = <T=unknown>() => useFetchActions<T>("tabs");

