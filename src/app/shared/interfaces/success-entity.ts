export interface SuccessEntity<T> {
  message: string
  data: T
  rawStatusCode: number
  statusCode: string
  statusText: string
}
