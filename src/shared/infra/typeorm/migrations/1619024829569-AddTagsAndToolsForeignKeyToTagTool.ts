import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddTagsAndToolsForeignKeyToTagTool1619024829569
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tag_tool',
      new TableColumn({
        name: 'tool_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'tag_tool',
      new TableColumn({
        name: 'tag_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'tag_tool',
      new TableForeignKey({
        name: 'ToolIdInTagTools',
        columnNames: ['tool_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tools',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tag_tool',
      new TableForeignKey({
        name: 'TagIdInTagTools',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',

        // onUpdate:
        // 'CASCADE' -> caso o id seja alterado ele será atualizado em todos os relacionamentos
        //

        // onDelete:
        // 'SET NULL' -> exclui somente o usuário e mantém os dados
        // 'RESTRICT' -> não permite A exclusão do usuário
        // 'CASCADE' -> exclui o usuário e todos os relacionamentos dele
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tag_tool', 'ToolIdInTagTools');
    await queryRunner.dropForeignKey('tag_tool', 'TagIdInTagTools');

    await queryRunner.dropColumn('tag_tool', 'tag_id');
    await queryRunner.dropColumn('tag_tool', 'tool_id');
  }
}
