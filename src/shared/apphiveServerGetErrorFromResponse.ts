import { ServerError } from './ServerErrors'

const apphiveServerGetErrorFromResponse = async (response: Response) => {
  const rawServerError = await response.json()

  const serverError = ServerError.createFromSendableObject(rawServerError)

  return serverError
}

export default apphiveServerGetErrorFromResponse
