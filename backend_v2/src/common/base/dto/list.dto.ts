export abstract class BaseListDto<TEntity> {
  id: string;
  abstract fromEntity(entity: TEntity): void;
}
