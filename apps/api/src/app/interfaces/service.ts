export interface IService<T, K> {
	execute(data: T): Promise<K>;
}
