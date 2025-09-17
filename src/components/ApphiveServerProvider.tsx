import { type PropsWithChildren } from 'react'
import ApphiveServerContext from '../shared/ApphiveServerContext'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'

type Props = PropsWithChildren<{
  serverHost: string
  baseQueryKey: string[]
  firebaseUserUid: string | null
  extraHeaders: Record<string, string> | null
  queryClient: QueryClient
  getIdToken: () => Promise<string | null>
  subscribeToFirebaseRealtimeDbPath: (
    path: string,
    listener: (value: unknown) => void
  ) => () => void
}>

const ApphiveServerProvider = ({
  children,
  serverHost,
  baseQueryKey,
  firebaseUserUid,
  extraHeaders,
  getIdToken,
  queryClient,
  subscribeToFirebaseRealtimeDbPath,
}: Props) => {
  return (
    <ApphiveServerContext.Provider
      value={{
        serverHost,
        baseQueryKey,
        extraHeaders,
        firebaseUserUid,
        getIdToken,
        subscribeToFirebaseRealtimeDbPath,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApphiveServerContext.Provider>
  )
}

export default ApphiveServerProvider
