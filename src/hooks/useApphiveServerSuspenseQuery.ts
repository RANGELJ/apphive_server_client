import { useSuspenseQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import ApphiveServerContext from '../shared/ApphiveServerContext'
import apphiveServerRequestGet from '../shared/apphiveServerRequestGet'
import { ServerError } from '../shared/ServerErrors'

type Options = {
  staleTimeInMillis?: number
  searchParams?: [string, string | undefined][]
}

const useApphiveServerSuspenseQuery = <ReturnType>(
  path: `/${string}`,
  options?: Options
) => {
  const { getIdToken, serverHost, firebaseUserUid, baseQueryKey } =
    useContext(ApphiveServerContext)

  return useSuspenseQuery<ReturnType, ServerError>({
    queryKey: [...baseQueryKey, path, options?.searchParams, firebaseUserUid],
    queryFn: () =>
      apphiveServerRequestGet<ReturnType>({
        path,
        searchParams: options?.searchParams,
        serverHost,
        getIdToken,
      }),
    staleTime: options?.staleTimeInMillis ?? Infinity,
  })
}

export default useApphiveServerSuspenseQuery
