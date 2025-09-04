import unknownIsRecord from '@rangeljl/shared/unknownIsRecord'

const errorsId = '1RzR1mIpbI'

export class ServerError extends Error {
  statusCode: number

  constructor() {
    super('')
    this.name = 'ApphiveServerError'
    this.statusCode = 401
  }

  getSendableObject() {
    return {
      id: errorsId,
      name: this.name,
    }
  }

  static createFromSendableObject(sendableObject: unknown) {
    const subErrorClasses = [
      ServerErrorAuthSessionExpired,
      ServerErrorClientShowable,
      ServerErrorModelNotFound,
    ]

    const subErrorInstances = subErrorClasses.reduce<null | ServerError>(
      (acc, SubErrorClass) => {
        if (acc !== null) {
          return acc
        }
        return SubErrorClass.createFromSendableObject(sendableObject)
      },
      null
    )

    if (subErrorInstances) {
      return subErrorInstances
    }

    if (!unknownIsRecord(sendableObject)) {
      return null
    }

    if (Object.keys(sendableObject).length !== 1) {
      return null
    }

    if (sendableObject.id !== '1RzR1mIpbI') {
      return null
    }

    if (sendableObject.name !== 'ApphiveServerUnknownError') {
      return null
    }

    return new ServerError()
  }
}

export class ServerErrorAuthSessionExpired extends ServerError {
  constructor() {
    super()
    this.name = 'ApphiveServerAuthSessionExpiredError'
  }

  getSendableObject() {
    return {
      id: errorsId,
      name: this.name,
    }
  }

  static createFromSendableObject(sendableObject: unknown) {
    if (!unknownIsRecord(sendableObject)) {
      return null
    }

    if (Object.keys(sendableObject).length !== 2) {
      return null
    }

    if (sendableObject.id !== '1RzR1mIpbI') {
      return null
    }

    if (sendableObject.name !== 'ApphiveServerAuthSessionExpiredError') {
      return null
    }

    return new ServerErrorAuthSessionExpired()
  }
}

export class ServerErrorClientShowable extends ServerError {
  public enMessage: string
  public esMessage: string

  constructor(constructorArgs: { enMessage: string; esMessage: string }) {
    super()
    this.name = 'ApphiveServerClientShowableError'
    this.enMessage = constructorArgs.enMessage
    this.esMessage = constructorArgs.esMessage
    this.message = this.enMessage
  }

  static isByMessageContent(error: unknown, message: string) {
    if (!(error instanceof ServerErrorClientShowable)) {
      return false
    }

    return error.enMessage === message || error.esMessage === message
  }

  getSendableObject() {
    return {
      id: errorsId,
      name: this.name,
      enMessage: this.enMessage,
      esMessage: this.esMessage,
    }
  }

  static createFromSendableObject(sendableObject: unknown) {
    if (!unknownIsRecord(sendableObject)) {
      return null
    }

    if (Object.keys(sendableObject).length !== 4) {
      return null
    }

    if (sendableObject.id !== '1RzR1mIpbI') {
      return null
    }

    if (sendableObject.name !== 'ApphiveServerClientShowableError') {
      return null
    }

    if (typeof sendableObject.enMessage !== 'string') {
      return null
    }

    if (typeof sendableObject.esMessage !== 'string') {
      return null
    }

    return new ServerErrorClientShowable({
      enMessage: sendableObject.enMessage,
      esMessage: sendableObject.esMessage,
    })
  }
}

export class ServerErrorModelNotFound extends ServerError {
  modelName: string

  constructor(modelName: string) {
    super()
    this.name = 'ApphiveServerModelNotFoundError'
    this.modelName = modelName
  }

  getSendableObject() {
    return {
      id: errorsId,
      name: this.name,
      modelName: this.modelName,
    }
  }

  static createFromSendableObject(sendableObject: unknown) {
    if (!unknownIsRecord(sendableObject)) {
      return null
    }

    if (Object.keys(sendableObject).length !== 3) {
      return null
    }

    if (sendableObject.id !== '1RzR1mIpbI') {
      return null
    }

    if (sendableObject.name !== 'ApphiveServerModelNotFoundError') {
      return null
    }

    if (typeof sendableObject.modelName !== 'string') {
      return null
    }

    return new ServerErrorModelNotFound(sendableObject.modelName)
  }
}
