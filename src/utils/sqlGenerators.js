export function generateSql(indicators, team_name){
    const historicTable =    `
    CREATE TABLE \`${team_name}_dashboardhistoric\` (
        \`dashboardmgoimport_id\` int(11) DEFAULT NULL,
        \`team_id\` int(11) DEFAULT NULL,
        \`agentidn0\` bigint(20) DEFAULT NULL,
        \`agentidn1\` bigint(20) DEFAULT NULL,
        \`agentidn2\` bigint(20) DEFAULT NULL,
        \`agentidn3\` bigint(20) DEFAULT NULL,
        \`namen0\` varchar(120) DEFAULT NULL,
        \`namen1\` varchar(120) DEFAULT NULL,
        \`namen2\` varchar(120) DEFAULT NULL,
        \`namen3\` varchar(120) DEFAULT NULL,
        \`data\` date DEFAULT NULL,
        KEY \`dashboardmgoimport_id\` (\`dashboardmgoimport_id\`),
        KEY \`team_id\` (\`team_id\`),
        KEY \`agentidn0\` (\`agentidn0\`),
        KEY \`agentidn1\` (\`agentidn1\`),
        KEY \`agentidn2\` (\`agentidn2\`),
        KEY \`agentidn3\` (\`agentidn3\`),
        KEY \`data\` (\`data\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    `;

    const importTable = `
    CREATE TABLE \`${team_name}_dashboardmgoimport\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`dashboardimportdetail_id\` int(11) NOT NULL,
        \`team_id\` int(11) NOT NULL,
        \`muid\` int(11) DEFAULT NULL,
        \`muname\` varchar(255) DEFAULT NULL,
        \`agentiddiretor\` bigint(20) DEFAULT NULL,
        \`eqpdiretor\` varchar(255) DEFAULT NULL,
        \`agentidcoordenador\` bigint(20) DEFAULT NULL,
        \`eqpcoordenador\` varchar(255) DEFAULT NULL,
        \`agentidsupervidor\` bigint(20) DEFAULT NULL,
        \`eqpsupervisor\` varchar(255) DEFAULT NULL,
        \`agentid\` bigint(20) DEFAULT NULL,
        \`agentname\` varchar(255) DEFAULT NULL,
        \`data\` date DEFAULT NULL,
        \`semana\` int(11) DEFAULT NULL,
        \`escalas\` int(11) DEFAULT NULL,
        ${indicators}
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`team_id_data_agentid\` (\`team_id\`,\`data\`,\`agentid\`),
        KEY \`team_id\` (\`team_id\`),
        KEY \`agentid\` (\`agentid\`),
        KEY \`agentiddiretor\` (\`agentiddiretor\`),
        KEY \`agentidcoordenador\` (\`agentidcoordenador\`),
        KEY \`agentidsupervidor\` (\`agentidsupervidor\`),
        KEY \`data_muId_agent_idx\` (\`data\`,\`agentid\`),
        KEY \`data\` (\`data\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    `

    const shutdownTable = `
        CREATE TABLE \`${team_name}_dashboardmgoshutdown\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`user_id\` int(11) NOT NULL,
            \`date\` date DEFAULT NULL,
            \`datetime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`team_id\` int(11) NOT NULL,
            \`historic\` tinyint(4) DEFAULT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    `

    const sqlTriggers = `
    USE \`beedoo_prod\`;
    
    DELIMITER $$
    
    USE \`beedoo_prod\`$$
    DROP TRIGGER IF EXISTS \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_INSERT\` $$
    DELIMITER ;
    USE \`beedoo_prod\`;
    
    DELIMITER $$
    
    USE \`beedoo_prod\`$$
    DROP TRIGGER IF EXISTS \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_DELETE\` $$
    DELIMITER ;
    DROP TRIGGER IF EXISTS \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_INSERT_WRONG_SCHEMA\`;
    
    DELIMITER $$
    USE \`beedoo_prod\`$$
    CREATE DEFINER=\`beedoo\`@\`%\` TRIGGER \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_INSERT\`
        AFTER INSERT
        ON \`beedoo_prod\`.\`${team_name}_dashboardmgoimport\`
        FOR EACH ROW
    BEGIN
        INSERT INTO \`${team_name}_dashboardhistoric\`
        SET \`${team_name}_dashboardhistoric\`.\`dashboardmgoimport_id\` = NEW.\`id\`,
            \`${team_name}_dashboardhistoric\`.\`team_id\`               = NEW.\`team_id\`,
            \`${team_name}_dashboardhistoric\`.\`agentidn0\`             = NEW.\`agentid\`,
            \`${team_name}_dashboardhistoric\`.\`agentidn1\`             = NEW.\`agentidsupervidor\`,
            \`${team_name}_dashboardhistoric\`.\`agentidn2\`             = NEW.\`agentidcoordenador\`,
            \`${team_name}_dashboardhistoric\`.\`agentidn3\`             = NEW.\`agentiddiretor\`,
            \`${team_name}_dashboardhistoric\`.\`namen0\`                = NEW.\`agentname\`,
            \`${team_name}_dashboardhistoric\`.\`namen1\`                = NEW.\`eqpsupervisor\`,
            \`${team_name}_dashboardhistoric\`.\`namen2\`                = NEW.\`eqpcoordenador\`,
            \`${team_name}_dashboardhistoric\`.\`namen3\`                = NEW.\`eqpdiretor\`,
            \`${team_name}_dashboardhistoric\`.\`data\`                  = NEW.\`data\`;
    END$$
    DELIMITER ;
    DROP TRIGGER IF EXISTS \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_DELETE_WRONG_SCHEMA\`;
    
    DELIMITER $$
    USE \`beedoo_prod\`$$
    CREATE DEFINER=\`beedoo\`@\`%\` TRIGGER \`beedoo_prod\`.\`${team_name}_dashboardmgoimport_AFTER_DELETE\`
        AFTER DELETE
        ON \`beedoo_prod\`.\`${team_name}_dashboardmgoimport\`
        FOR EACH ROW
    BEGIN
        DELETE
        FROM \`${team_name}_dashboardhistoric\`
        WHERE \`${team_name}_dashboardhistoric\`.\`dashboardmgoimport_id\` = OLD.\`id\`;
    END$$
    DELIMITER ;
    `;
    
    return historicTable + importTable + shutdownTable + sqlTriggers;
    
}