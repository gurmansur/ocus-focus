import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface FindBoardRow {
  projetoNome: string;
  swimlaneId: number;
  swimlaneNome: string;
  swimlaneCor: string;
  swimlaneVertical: number;
  swimlaneIcone: string | null;
  userStoryId: number | null;
  userStoryTitulo: string | null;
  userStoryDescricao: string | null;
  userStoryEstimativaTempo: number | null;
  userStoryPrioridade: string | null;
  userStoryDataVencimento: Date | null;
  responsavelId: number | null;
  responsavelNome: string | null;
  commentCount: number | null;
}

@Injectable()
export class KanbanRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findBoard(projetoId: number, sprintId?: number) {
    const params: Array<number> = [projetoId];

    const sql = `
      SELECT
        p.PRO_NOME            AS projetoNome,
        s.SWI_ID              AS swimlaneId,
        s.SWI_NOME            AS swimlaneNome,
        s.SWI_COR             AS swimlaneCor,
        s.SWI_VERTICAL        AS swimlaneVertical,
        s.SWI_ICONE           AS swimlaneIcone,
        us.UST_ID             AS userStoryId,
        us.UST_TITULO         AS userStoryTitulo,
        us.UST_DESCRICAO      AS userStoryDescricao,
        us.UST_ESTIMATIVA_TEMPO AS userStoryEstimativaTempo,
        us.UST_PRIORIDADE     AS userStoryPrioridade,
        us.UST_DATA_VENCIMENTO AS userStoryDataVencimento,
        u.USU_ID              AS responsavelId,
        u.USU_NOME            AS responsavelNome,
        COALESCE(cmt.commentCount, 0) AS commentCount
      FROM PROJETOS p
      INNER JOIN KANBANS k ON k.FK_PRO_ID = p.PRO_ID
      INNER JOIN SWIMLANES s ON s.FK_KAN_ID = k.KAN_ID
      LEFT JOIN USER_STORIES us ON us.FK_SWI_ID = s.SWI_ID AND us.UST_DATA_EXCLUSAO IS NULL
      LEFT JOIN USUARIOS u ON u.USU_ID = us.FK_USUARIO_USU_RES_ID
      LEFT JOIN (
        SELECT FK_USER_STORY, COUNT(*) AS commentCount
        FROM COMENTARIOS
        WHERE CMN_DATA_EXCLUSAO IS NULL
        GROUP BY FK_USER_STORY
      ) cmt ON cmt.FK_USER_STORY = us.UST_ID
      ${sprintId ? 'INNER JOIN SPRINTS_USERS_STORIES sus ON sus.userStoriesUstId = us.UST_ID AND sus.sprintsSpriId = ?' : ''}
      WHERE p.PRO_ID = ?
      ORDER BY s.SWI_ORDEM ASC, s.SWI_ID ASC, us.UST_ID ASC
    `;

    if (sprintId) {
      params.unshift(sprintId);
    }

    const rows = (await this.dataSource.manager.query(
      sql,
      params,
    )) as FindBoardRow[];

    if (!rows.length) {
      return { nome: '', swimlanes: [] };
    }

    const swimlaneMap = new Map<number, any>();

    for (const row of rows) {
      if (!swimlaneMap.has(row.swimlaneId)) {
        swimlaneMap.set(row.swimlaneId, {
          id: row.swimlaneId,
          nome: row.swimlaneNome,
          cor: row.swimlaneCor,
          vertical: !!row.swimlaneVertical,
          icone: row.swimlaneIcone,
          userStories: [],
        });
      }

      if (row.userStoryId) {
        swimlaneMap.get(row.swimlaneId).userStories.push({
          id: row.userStoryId,
          titulo: row.userStoryTitulo,
          descricao: row.userStoryDescricao,
          estimativa_tempo: row.userStoryEstimativaTempo,
          prioridade: row.userStoryPrioridade,
          dataVencimento: row.userStoryDataVencimento,
          responsavel: row.responsavelId
            ? {
                id: row.responsavelId,
                nome: row.responsavelNome,
              }
            : null,
          commentCount: row.commentCount ?? 0,
        });
      }
    }

    const firstRow = rows[0];

    return {
      nome: firstRow.projetoNome,
      swimlanes: Array.from(swimlaneMap.values()),
    };
  }
}
