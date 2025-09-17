import { useSuspenseQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import ApphiveServerContext from '../shared/ApphiveServerContext'
import apphiveServerRequestGet from '../shared/apphiveServerRequestGet'
import { ServerError, ServerErrorClientShowable } from '../shared/ServerErrors'
import useModelUpdatesListener from './useModelUpdatesListener'

type Options<ReturnType> = {
  staleTimeInMillis?: number
  searchParams?: [string, string | undefined][]
  getPropsToListen?: (data: ReturnType) => {
    name: string
    prop: string
    identifier: string | number
  }[]
}

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

  const query = useSuspenseQuery<ReturnType, ServerError>({
    queryKey: [
      ...baseQueryKey,
      'get',
      path,
      options?.searchParams,
      firebaseUserUid,
    ],
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
      if (failureCount >= 4) {
        return false
      }
      return true
    },
    staleTime: options?.staleTimeInMillis ?? Infinity,
  })

  useModelUpdatesListener({
    refetch: query.refetch,
    updatedAtFromServer: query.dataUpdatedAt,
    modelProps: options?.getPropsToListen?.(query.data) ?? [],
  })

  return query
}

export default useApphiveServerSuspenseQuery
