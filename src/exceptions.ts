/**
 * Default HTTP exception class, which is thrown when an HTTP error occurs. It contains the response and status code of the error.
 */
export class HttpException extends Error {
	/** Creates an instance of HttpException.
	 * @param response The response body of the error, which can be a string or any other type (e.g., an object).
	 * @param status The HTTP status code of the error.
	 */
	constructor(
		public readonly response: string | unknown,
		public readonly status: number
	) {
		super(typeof response === 'string' ? response : JSON.stringify(response));
	}

	/**
	 * Creates an HttpException from a Response object.
	 * It reads the response body and status code, and creates an HttpException with the appropriate message and status.
	 */
	public static async fromResponse(response: Response): Promise<HttpException> {
		const contentType = response.headers.get('content-type') ?? '';
		const body = contentType.includes('application/json') ? await response.json() : await response.text();
		return new HttpException(body, response.status);
	}
}
