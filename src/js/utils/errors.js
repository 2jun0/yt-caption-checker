export class InvalidYouTubeVideoUrlError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidYouTubeVideoUrlError'
  }
}

export class InvalidYouTubeThumnailElementError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidYouTubeThumnailElementError'
  }
}

export class CircuitOpenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CircuitOpenError'
  }
}
