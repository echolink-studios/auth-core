import type { IntrospectResponse, TokenExchangeResponse } from './response.types';
import { HttpException } from './common.exceptions';

/**
 * Service for handling authentication-related operations, such as token exchange and introspection.
 * It communicates with an authentication server to perform these operations, using client credentials for authentication.
 */
export class AuthService {
	/** Creates an instance of AuthService.
	 * @param baseUrl A function that returns the base URL of the authentication server.
	 * @param clientId A function that returns the client ID for authentication.
	 * @param clientSecret A function that returns the client secret for authentication.
	 */
	constructor(
		private readonly baseUrl: () => string,
		private readonly clientId: () => string,
		private readonly clientSecret: () => string
	) {}

	/**
	 * Exchanges a subject token for a new access token for a specified resource.
	 * @param resource The resource for which the access token is requested.
	 * @param subjectToken The token to be exchanged, typically an access token.
	 * @returns A promise that resolves to a TokenExchangeResponse containing the new access token and related information.
	 * @throws HttpException if the token exchange request fails or returns a non-OK response.
	 */
	public async exchangeToken(resource: string, subjectToken: string): Promise<TokenExchangeResponse> {
		const response = await fetch(`${this.baseUrl()}/token`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${this.getBasicAuth()}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'token_exchange',
				resource,
				requested_token_type: 'access_token',
				subject_token: subjectToken,
				subject_token_type: 'access_token',
			}),
		});
		if (!response.ok) {
			throw await HttpException.fromResponse(response);
		}
		return (await response.json()) as TokenExchangeResponse;
	}

	/**
	 * Introspects a token to check its validity and retrieve associated information.
	 * @param token The token to be introspected, typically an access token.
	 * @returns A promise that resolves to an IntrospectResponse containing the token's active status and related information.
	 * @throws HttpException if the introspection request fails or returns a non-OK response.
	 */
	public async introspectToken(token: string): Promise<IntrospectResponse> {
		const response = await fetch(`${this.baseUrl()}/introspect`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${this.getBasicAuth()}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),
		});
		if (!response.ok) {
			throw await HttpException.fromResponse(response);
		}
		return (await response.json()) as IntrospectResponse;
	}

	public getBasicAuth(): string {
		return Buffer.from(`${this.clientId()}:${this.clientSecret()}`).toString('base64');
	}
}
