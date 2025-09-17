import { createContext } from 'react'

type ApphiveServerContextType = {
  serverHost: string
  getIdToken: () => Promise<string | null>
  firebaseUserUid: string | null
  baseQueryKey: string[]
  extraHeaders: Record<string, string> | null
  subscribeToFirebaseRealtimeDbPath: (
    path: string,
    listener: (value: unknown) => void
  ) => () => void
}

const ApphiveServerContext = createContext<ApphiveServerContextType>(
  null as unknown as ApphiveServerContextType
)

export default ApphiveServerContext
