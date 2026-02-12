export interface TokenExchangeResponse {
	access_token: string;
	issued_token_type: string;
	token_type: string;
	expires_in: number;
}

export interface IntrospectResponse {
	active: boolean;
	token_type?: string;
	sub?: string;
	iat?: number;
	exp?: number;
	aud?: string;
	iss?: string;
	jti?: string;
	nbf?: number;
	client_id?: string;
}
