import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFunctionGenCode1762708431122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           DROP FUNCTION IF EXISTS gen_code(TEXT, TEXT);
        `);
    await queryRunner.query(`
CREATE OR REPLACE FUNCTION gen_code(codeInput TEXT, propertyIdInput TEXT)
RETURNS TEXT AS $func$
DECLARE
    now Date:= now();
    counterCurrent BIGINT:= 0;
    resultCode TEXT;
    config RECORD;
    sequences RECORD;
    formatDate TEXT:= to_char(now(), 'MMYY');
BEGIN
    -- Kiểm tra input
    IF codeInput isnull or propertyIdInput isnull or codeInput = '' or propertyIdInput = '' THEN
        RAISE EXCEPTION 'Code config and Property required!';
    END IF;

    -- Lấy cấu hình từ bảng config
    -- Trường hợp lấy cấu hình theo property
    SELECT * INTO config  FROM "code_configs" WHERE "code" = codeInput and "propertyId" = propertyIdInput;
    IF NOT FOUND THEN
        RAISE WARNING 'Not found config for code type: %, property: %', codeInput, propertyIdInput;
        -- Trường hợp không tìm thất config thì lấy default
        SELECT * INTO config FROM "code_configs" WHERE "code" = codeInput;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Not found config default for code type: %', codeInput;
        END IF;
    END IF;

    -- Kiểm tra đã có dữ liệu trước đó chưa
    SELECT * INTO sequences FROM "code_sequences" WHERE "code" = codeInput and "propertyId" = propertyIdInput;
    IF NOT FOUND THEN
        -- Tạo mới khi chưa có
        INSERT INTO code_sequences("code", "propertyId", "createdAt", "currentValue", "counter", "lastResetDate",  "updatedAt")
        VALUES (codeInput, propertyIdInput, now, '', 0, now,  now)
        RETURNING * INTO sequences;
    END IF;

    -- Gen code
    IF sequences."currentValue" = '' and sequences.counter = 0 THEN
        UPDATE code_sequences
        SET "currentValue" = lpad('1', config.length, '0'), counter = 1, "lastResetDate" = now()
        WHERE "id" = sequences.id
        RETURNING * INTO sequences;
    ELSE
        IF config."resetType" = 'NONE' THEN
            counterCurrent:= sequences.counter;
        ELSEIF config."resetType" = 'YEARLY'
               and (sequences."lastResetDate" is null or date_part('year', sequences."lastResetDate") <> date_part('year', now())) THEN
                counterCurrent = 0;
        ELSEIF config."resetType" = 'MONTHLY'
            and (sequences."lastResetDate" is null or to_char(sequences."lastResetDate", 'YYYYMM') <> to_char(now(), 'YYYYMM')) THEN
            counterCurrent:= 0;
        ELSEIF config."resetType" = 'WEEKLY'
            and (sequences."lastResetDate" is null or to_char(sequences."lastResetDate", 'YYYYMMIW') <> to_char(now(), 'YYYYMMIW')) THEN
            counterCurrent:= 0;
        END IF;

        counterCurrent:= counterCurrent + 1;
        UPDATE code_sequences
        SET "currentValue" = lpad(counterCurrent::text, config.length, '0'), counter = counterCurrent, "lastResetDate" = now()
        WHERE "id" = sequences.id
        RETURNING * INTO sequences;
    END IF;

    -- Không có config format
    IF config.format is null or config.format = '' THEN
        RETURN sequences.counter;
    END IF;

    -- Áp dụng format
    IF(config."formatDatePattern" notnull and config."formatDatePattern" != '') THEN
        formatDate:= to_char(now(), config."formatDatePattern");
    END IF;
    resultCode := config.format;
    resultCode := replace(resultCode, '{prefix}', coalesce(config.prefix, ''));
    resultCode := replace(resultCode, '{date}', coalesce(formatDate, ''));
    resultCode := replace(resultCode, '{counter}', coalesce(sequences."currentValue", ''));
    resultCode := replace(resultCode, '{suffix}', coalesce(config.suffix, ''));
    RAISE INFO 'GEN CODE COMPLETED: %', resultCode;
    RETURN resultCode;
END;
$func$ LANGUAGE plpgsql;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
