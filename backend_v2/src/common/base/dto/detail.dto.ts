export abstract class BaseDetailDto<TEntity> {
  id: string;
  abstract fromEntity(entity: TEntity): void;
}
