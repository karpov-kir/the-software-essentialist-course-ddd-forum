export interface UseCase<Input = void, Output = void> {
  execute(input: Input): Promise<Output>;
}
