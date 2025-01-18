export type PayloadProps = {
	id: string;
};

export interface ITokenProvider {
	generate(id: string): string;
	verify(token: string): Promise<PayloadProps>;
}
