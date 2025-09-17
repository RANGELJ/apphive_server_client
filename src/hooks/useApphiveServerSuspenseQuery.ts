import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import ApphiveServerContext from '../shared/ApphiveServerContext'
import apphiveServerRequestGet from '../shared/apphiveServerRequestGet'
import { ServerError, ServerErrorClientShowable } from '../shared/ServerErrors'
import useModelUpdatesListener from './useModelUpdatesListener'

/**
 * Options for {@link useApphiveServerSuspenseQuery}.
 */
export type Options<ReturnType> = {
  staleTimeInMillis?: number
  searchParams?: [string, string | undefined][]
  /**
   * When true, clears the exact query's cache before refetching, which makes the hook suspend
   * until fresh data arrives and propagates errors to the nearest error boundary.
   * When false, refetch keeps the cached data and typically does not suspend if data exists.
   * Default: false.
   */
  cleanOnRefetch?: boolean
  getPropsToListen?: (data: ReturnType) => {
    name: string
    prop: string
    identifier: string | number
  }[]
  onRefetch?: () => void
}

/**
 * Suspense-ready GET query to the Apphive server with optional cache-clean refetch behavior.
 *
 * @param path - API path starting with '/'.
 * @param options - Query options.
 * @param options.staleTimeInMillis - Time in ms to consider data fresh. Default: Infinity.
 * @param options.searchParams - Tuple list of search params appended to the request.
 * @param options.cleanOnRefetch - When true, performs a "clean" refetch (removes the exact
 * cache entry before refetching, suspends until fresh data, and bubbles errors to the nearest
 * error boundary). When false, refetch keeps existing cached data. Default: false.
 * @param options.getPropsToListen - Map the fetched data to model props to automatically
 * trigger refetches when the server notifies updates for those props.
 */
const useApphiveServerSuspenseQuery = <ReturnType>(
  path: `/${string}`,
  options?: Options<ReturnType>
) => {
  const {
    getIdToken,
    serverHost,
    firebaseUserUid,
    baseQueryKey,
    extraHeaders,
  } = useContext(ApphiveServerContext)

  const queryKey = [
    ...baseQueryKey,
    'get',
    path,
    options?.searchParams,
    firebaseUserUid,
  ] as const

  const query = useSuspenseQuery<ReturnType, ServerError>({
    queryKey,
    queryFn: () =>
      apphiveServerRequestGet<ReturnType>({
        path,
        searchParams: options?.searchParams,
        serverHost,
        getIdToken,
        extraHeaders,
      }),
    retry: (failureCount, error) => {
      if (error instanceof ServerErrorClientShowable) {
        return false
      }
      if (failureCount >= 3) {
        return false
      }
      return true
    },
    staleTime: options?.staleTimeInMillis ?? Infinity,
  })

  const queryClient = useQueryClient()

  useModelUpdatesListener({
    refetch: options?.cleanOnRefetch
      ? () => {
          options.onRefetch?.()
          queryClient.removeQueries({
            queryKey,
            exact: true,
          })
          query.refetch()
        }
      : () => {
          options?.onRefetch?.()
          query.refetch()
        },
    updatedAtFromServer: query.dataUpdatedAt,
    modelProps: options?.getPropsToListen?.(query.data) ?? [],
  })

  return query
}

export default useApphiveServerSuspenseQuery
