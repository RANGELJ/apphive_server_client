import apphiveServerGetErrorFromResponse from './apphiveServerGetErrorFromResponse'

type Args = {
  serverHost: string
  getIdToken: () => Promise<string | null>
  path: `/${string}`
  searchParams?: [string, string | undefined][]
}

const apphiveServerRequestGet = async <ReturnType = unknown>({
  serverHost,
  getIdToken,
  path,
  searchParams,
}: Args) => {
  const headers: Record<string, string> = {}

  const idToken = await getIdToken()

  if (idToken) {
    headers['apphive-auth'] = idToken
  }

  const url = new URL(`${serverHost}/v2${path}`)

  if (searchParams) {
    searchParams.forEach(([name, value]) => {
      if (value === undefined || value === '') {
        return
      }
      url.searchParams.append(name, value)
    })
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw await apphiveServerGetErrorFromResponse(response)
  }

  const responseData: { result: ReturnType } = await response.json()

  return responseData.result ?? (null as ReturnType)
}

export default apphiveServerRequestGet
