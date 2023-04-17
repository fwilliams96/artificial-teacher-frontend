import { ViolationEntity } from './violation-entity'

export interface ErrorEntity {
  errors: ViolationEntity[]
  message: string
  rawStatusCode: number
  statusCode: string
  statusText: string
}
