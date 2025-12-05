
export type errorResponseType = {
    success: false,
    message: string,
    errors: string
}

export type successResponseType = {
    success: true, 
    message: string,
    data: [] | {}
}