-- Populate test database (ocus_focus_test) with sample data

-- Use the test database
USE ocus_focus_test;

-- Insert users
INSERT INTO `USUARIOS` (`USU_DATA_CADASTRO`) VALUES 
  (NOW()), -- User 1
  (NOW()), -- User 2
  (NOW()), -- User 3
  (NOW()); -- User 4

-- Insert collaborators
INSERT INTO `COLABORADORES` (`COL_NOME`, `COL_EMAIL`, `COL_SENHA`, `COL_EMPRESA`, `COL_CARGO`, `FK_USUARIOS_USU_ID`) VALUES 
  ('John Doe', 'john@example.com', '$2b$12$5AXqWiqaC017/d.XwWoCEuEPpJs5jfsKAdt1QO2ZYJlRXhjxfzWE.', 'Test Company', 'Gerente de Projeto', 1),
  ('Jane Smith', 'jane@example.com', '$2b$12$5AXqWiqaC017/d.XwWoCEuEPpJs5jfsKAdt1QO2ZYJlRXhjxfzWE.', 'Test Company', 'Analista de Sistemas', 2),
  ('Bob Johnson', 'bob@example.com', '$2b$12$5AXqWiqaC017/d.XwWoCEuEPpJs5jfsKAdt1QO2ZYJlRXhjxfzWE.', 'Test Company', 'Desenvolvedor', 3);

-- Insert projects
INSERT INTO `PROJETOS` (`PRO_NOME`, `PRO_DESCRICAO`, `PRO_EMPRESA`, `PRO_DATA_INICIO`, `PRO_PREVISAO_FIM`, `PRO_STATUS`) VALUES 
  ('Test Project 1', 'Project for testing purposes', 'Test Company', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'EM ANDAMENTO'),
  ('Test Project 2', 'Another test project', 'Test Company', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'EM ANDAMENTO');

-- Insert collaborator-project relationships
INSERT INTO `COLABORADORES_PROJETOS` (`COP_ATIVO`, `COP_ADMINISTRADOR`, `FK_COLABORADORES_COL_ID`, `FK_COLABORADORES_FK_USUARIOS_USU_ID`, `FK_PROJETOS_PRO_ID`) VALUES 
  (1, 1, 1, 1, 1), -- John is admin on Project 1
  (1, 0, 2, 2, 1), -- Jane is member on Project 1
  (1, 0, 3, 3, 1), -- Bob is member on Project 1
  (1, 1, 1, 1, 2); -- John is admin on Project 2

-- Insert stakeholders
INSERT INTO `STAKEHOLDERS` (`STA_CHAVE`, `STA_SENHA`, `STA_NOME`, `STA_CARGO`, `STA_EMAIL`, `FK_USUARIOS_USU_ID`, `FK_PROJETOS_PRO_ID`) VALUES 
  ('stakeholder1', '$2b$12$5AXqWiqaC017/d.XwWoCEuEPpJs5jfsKAdt1QO2ZYJlRXhjxfzWE.', 'Alice Williams', 'Product Owner', 'alice@example.com', 4, 1);

-- Insert status for stakeholder prioritization
INSERT INTO `STATUS_PRIORIZACAO` (`SPA_PARTICIPACAO_REALIZADA`, `SPA_ALERTA_EMITIDO`, `FK_STAKEHOLDERS_STA_ID`, `FK_STAKEHOLDERS_FK_USUARIOS_USU_ID`) VALUES 
  (0, 0, 1, 4);

-- Insert Kanbans for projects
INSERT INTO `KANBANS` (`FK_PRO_ID`) VALUES 
  (1), -- Kanban for Project 1
  (2); -- Kanban for Project 2

-- Insert Swimlanes
INSERT INTO `SWIMLANES` (`SWI_NOME`, `SWI_VERTICAL`, `SWI_COR`, `FK_KAN_ID`) VALUES 
  ('To Do', 0, '#ff0000', 1),
  ('In Progress', 0, '#ffff00', 1),
  ('Done', 0, '#00ff00', 1),
  ('To Do', 0, '#ff0000', 2),
  ('In Progress', 0, '#ffff00', 2),
  ('Done', 0, '#00ff00', 2);

-- Insert functional requirements
INSERT INTO `REQUISITOS_FUNCIONAIS` (`REQ_ESPECIFICACAO`, `REQ_NOME`, `REQ_NUMERO_IDENTIFICADOR`, `FK_PROJETOS_PRO_ID`) VALUES 
  ('The system must allow users to create new projects', 'Create Project', 1, 1),
  ('The system must allow users to assign tasks to team members', 'Assign Tasks', 2, 1),
  ('The system must generate reports based on project progress', 'Generate Reports', 3, 1);

-- Insert use cases
INSERT INTO `CASOS_DE_USO` (`CAS_NOME`, `CAS_DESCRICAO`, `CAS_COMPLEXIDADE`, `FK_REQUISITOS_FUNCIONAIS_REQ_ID`) VALUES 
  ('Create New Project', 'User creates a new project in the system', 'SIMPLES', 1),
  ('Modify Project Details', 'User modifies existing project information', 'MEDIO', 1),
  ('Assign Task to Team Member', 'Project manager assigns a task to a team member', 'SIMPLES', 2),
  ('Generate Progress Report', 'User generates a report showing project progress', 'MEDIO', 3);

-- Insert scenarios for use cases
INSERT INTO `CENARIOS` (`CEN_NOME`, `CEN_DESCRICAO`, `CEN_TIPO`, `FK_CASOS_DE_USO_CAS_ID`) VALUES 
  ('Happy Path - Create Project', 'User successfully creates a project with all valid information', 'PRINCIPAL', 1),
  ('Error - Invalid Project Dates', 'System shows error when end date is before start date', 'ALTERNATIVO', 1),
  ('Happy Path - Task Assignment', 'Project manager successfully assigns task to available team member', 'PRINCIPAL', 3);

-- Insert actors
INSERT INTO `ATORES` (`ATO_NOME`, `ATO_COMPLEXIDADE`, `ATO_DESCRICAO`, `FK_PROJETOS_PRO_ID`) VALUES 
  ('Project Manager', 'MEDIO', 'Person who manages projects and team', 1),
  ('Team Member', 'SIMPLES', 'Person who works on project tasks', 1),
  ('Stakeholder', 'SIMPLES', 'Person with interest in the project', 1);

-- Insert test suites
INSERT INTO `SUITES_DE_TESTE` (`SDT_NOME`, `SDT_STATUS`, `SDT_DESCRICAO`, `SDT_OBSERVACOES`, `FK_PROJETO_PRO_ID`) VALUES 
  ('Project Management Tests', 'ATIVO', 'Tests for project management features', 'Critical test suite', 1),
  ('Task Management Tests', 'ATIVO', 'Tests for task management features', 'Medium priority', 1);

-- Insert test cases
INSERT INTO `CASOS_DE_TESTE` (`CDT_NOME`, `CDT_STATUS`, `CDT_METODO`, `CDT_TECNICA`, `CDT_PRIORIDADE`, `CDT_COMPLEXIDADE`, `CDT_DESCRICAO`, `CDT_OBSERVACOES`, `CDT_PRE_CONDICAO`, `CDT_POS_CONDICAO`, `CDT_DADOS_ENTRADA`, `CDT_RESULTADO_ESPERADO`, `FK_CASOS_DE_USO_CAS_ID`, `FK_SUITE_DE_TESTE_SDT_ID`, `FK_COLABORADORES_COL_ID`, `FK_PROJETO_PRO_ID`) VALUES 
  ('Create Project Test', 'ATIVO', 'MANUAL', 'FUNCIONAL', 'ALTA', 'SIMPLES', 'Test creating a new project', 'Basic functionality test', 'User is logged in', 'Project is created', '{"name": "Test Project", "description": "Description", "startDate": "2023-01-01", "endDate": "2023-12-31"}', 'Project is created successfully and appears in project list', 1, 1, 1, 1),
  ('Assign Task Test', 'ATIVO', 'MANUAL', 'FUNCIONAL', 'MEDIA', 'SIMPLES', 'Test assigning tasks to team members', 'Team management test', 'Project exists with tasks', 'Task is assigned', '{"taskId": 1, "assigneeId": 2}', 'Task is assigned to team member and appears in their task list', 3, 2, 1, 1);

-- Insert stakeholder prioritization
INSERT INTO `PRIORIZACAO_STAKEHOLDERS` (`PRS_CLASSIFICACAO_REQUISITO`, `PRS_RESPOSTA_POSITIVA`, `PRS_RESPOSTA_NEGATIVA`, `FK_STAKEHOLDERS_STA_ID`, `FK_STAKEHOLDERS_FK_USUARIOS_USU_ID`, `FK_REQUISITOS_FUNCIONAIS_REQ_ID`) VALUES 
  ('DEVE SER FEITO', 'ESPERADO', 'NAO GOSTARIA', 1, 4, 1),
  ('PERFORMANCE', 'GOSTARIA', 'CONVIVO COM ISSO', 1, 4, 2),
  ('ATRATIVO', 'GOSTARIA', 'NAO IMPORTA', 1, 4, 3);

-- Insert requirement results
INSERT INTO `RESULTADO_REQUISITOS` (`RPR_RESULTADO_FINAL`, `FK_REQUISITOS_FUNCIONAIS_REQ_ID`) VALUES 
  ('DEVE SER FEITO', 1),
  ('PERFORMANCE', 2),
  ('ATRATIVO', 3);

-- Insert test executions
INSERT INTO `EXECUCOES_DE_TESTE` (`EDT_NOME`, `EDT_DATA_EXECUCAO`, `EDT_RESPOSTA`, `EDT_RESULTADO`, `EDT_OBSERVACAO`, `EDT_METODO`, `FK_CASO_DE_TESTE_CDT_ID`) VALUES 
  ('Create Project Execution', NOW(), 'Test passed successfully', 'SUCESSO', 'All steps completed', 'MANUAL', 1),
  ('Assign Task Execution', NOW(), 'Test passed with warnings', 'SUCESSO', 'Some minor UI issues', 'MANUAL', 2);

-- Insert user stories
INSERT INTO `USER_STORIES` (`UST_TITULO`, `UST_DESCRICAO`, `UST_ESTIMATIVA_TEMPO`, `FK_COLABORADOR_COL_CRI_ID`, `FK_COLABORADOR_COL_RES_ID`, `FK_KANBAN_ID`, `FK_PRO_ID`, `FK_SWI_ID`) VALUES 
  ('Create project UI', 'As a user, I want a simple form to create new projects', 5, 1, 2, 1, 1, 1),
  ('Task assignment dropdown', 'As a manager, I want to assign tasks using a dropdown selector', 3, 1, 3, 1, 1, 2),
  ('Dashboard view', 'As a user, I want to see project progress on a dashboard', 8, 1, 2, 1, 1, 2);

-- Insert subtasks
INSERT INTO `SUBTAREFAS` (`SBT_DESCRICAO`, `SBT_COMPLETADA`, `FK_USER_STORY`) VALUES 
  ('Design form layout', 1, 1),
  ('Implement form validation', 0, 1),
  ('Create dropdown component', 1, 2),
  ('Connect to user database', 0, 2);

-- Insert comments
INSERT INTO `COMENTARIOS` (`cmn_comentario`, `cmn_criado_em`, `cmn_modificado_em`, `fk_usuario_id`, `fk_user_story`) VALUES 
  ('Form layout looks good, we should add field validation', NOW(), NOW(), 1, 1),
  ('I suggest using a search field with autocomplete', NOW(), NOW(), 2, 2);

-- Insert environment factors for projects
INSERT INTO `FATORES_AMBIENTAIS_PROJETOS` (`AMP_VALOR`, `FK_PROJETOS_PRO_ID`, `FK_FATORES_AMBIENTAIS_AMB_ID`) VALUES 
  (3, 1, 1), -- Familiarity with unified process (value 3 out of 5)
  (4, 1, 2), -- Application experience (value 4 out of 5)
  (4, 1, 3), -- OO experience (value 4 out of 5)
  (5, 1, 4), -- Project leader capability (value 5 out of 5)
  (4, 1, 5), -- Motivation (value 4 out of 5)
  (3, 1, 6), -- Requirement stability (value 3 out of 5) 
  (2, 1, 7), -- Part-time workers (value 2 out of 5)
  (2, 1, 8); -- Programming language difficulty (value 2 out of 5)

-- Insert technical factors for projects
INSERT INTO `FATORES_TECNICOS_PROJETOS` (`TEP_VALOR`, `FK_PROJETOS_PRO_ID`, `FK_FATORES_TECNICOS_TEC_ID`) VALUES 
  (3, 1, 1), -- Distributed system (value 3 out of 5)
  (4, 1, 2), -- Application performance (value 4 out of 5)
  (5, 1, 3), -- User efficiency (value 5 out of 5)
  (3, 1, 4), -- Processing complexity (value 3 out of 5)
  (4, 1, 5), -- Code reusability (value 4 out of 5)
  (5, 1, 6), -- Easy to install (value 5 out of 5)
  (5, 1, 7), -- Easy to use (value 5 out of 5)
  (3, 1, 8), -- Portability (value 3 out of 5)
  (4, 1, 9), -- Easy to change (value 4 out of 5)
  (3, 1, 10), -- Concurrency (value 3 out of 5)
  (4, 1, 11), -- Security features (value 4 out of 5)
  (2, 1, 12), -- Third-party access (value 2 out of 5)
  (4, 1, 13); -- User training (value 4 out of 5)

-- Insert estimation efforts
INSERT INTO `ESTIMATIVAS_ESFORCOS` (
  `EST_RESULTADO_HORAS`, 
  `EST_PESO_ATORES`, 
  `EST_PESO_CASOS_USO`, 
  `EST_PESO_PONTOS_CASOS_USO`, 
  `EST_TFACTOR`, 
  `EST_EFACTOR`, 
  `EST_RESULTADO_PONTOS_CASOS_USO`,
  `EST_DATA_ESTIMATIVA`,
  `projetoId`
) VALUES 
  (240.50, 6, 15, 21, 0.85, 0.75, 13.39, DATE_FORMAT(NOW(), '%Y-%m-%d'), 1);

-- Insert sprints
INSERT INTO `SPRINTS` (`SPR_NOME`, `SPR_DESCRICAO`, `SPR_HORAS_PREVISTAS`, `SPR_DATA_INICIO`, `SPR_DATA_FIM`) VALUES 
  ('Sprint 1', 'Initial development sprint', 80, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
  ('Sprint 2', 'Feature development sprint', 80, DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 29 DAY));

-- Connect sprints to user stories
INSERT INTO `SPRINTS_USERS_STORIES` (`uSERSTORIESUSTID`, `sPRINTSSPRID`) VALUES 
  (1, 1), -- Create project UI in Sprint 1
  (2, 1), -- Task assignment dropdown in Sprint 1
  (3, 2); -- Dashboard view in Sprint 2

-- Connect user stories to collaborators
INSERT INTO `USER_STORIES_COLABORADORES` (`uSERSTORIESUSTID`, `cOLABORADORESCOLID`) VALUES 
  (1, 2), -- Jane working on Create project UI
  (2, 3), -- Bob working on Task assignment dropdown
  (3, 2); -- Jane working on Dashboard view 