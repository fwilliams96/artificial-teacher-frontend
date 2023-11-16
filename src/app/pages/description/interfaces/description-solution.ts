export enum DescriptionSolutionType {
    SPEECH = 'SPEECH',
    TEXT = 'TEXT'
}

export interface DescriptionSolution {
    content: string,
    type: DescriptionSolutionType
}