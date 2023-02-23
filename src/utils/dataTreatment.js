import {generateSql} from '../utils/sqlGenerators'

export function generateDataArray(data){
  let convertedFile = Object.entries(data).map(([type, name]) => ({ type, name }));
  let indicatorsArray = []
        //transforma array em uma classe para permitir conversão em tags de dashboard
        convertedFile.forEach(function(obj){
          if(obj['type'].includes('EMPTY')){
            return;
          }
          let objIndicators = {
            indicator_name: obj['name'],
            indicator_type: obj['type']
          }
          indicatorsArray.push(objIndicators)
        })
  return indicatorsArray;
}

export function setDataType(arr){
    let textType ='';
    arr.forEach(element => {
        let varType = setIndicatorType(element['indicator_type']) ? 'Number' : 'String' ;

        textType+= `
    <field>
        <name>${String(element['indicator_name']).toUpperCase()}</name>
        <type>${varType}</type>
        <length>-1</length>
        <precision>-1</precision>
        <trim_type>none</trim_type>
        <repeat>N</repeat>
        <format/>
        <currency/>
        <decimal/>
        <group/>
    </field>`
    });
    return textType;
  }

export function setMappingIndicators(arr){
    let textMap = '';
    arr.forEach(element => {
        textMap+= `
        <mapping>
            <stream_name>${String(element['indicator_name']).toLowerCase()}</stream_name>
            <field_name>${String(element['indicator_name']).toUpperCase()}</field_name>
            <field_format_ok>OK</field_format_ok>
        </mapping>`
    });
    return textMap;
}

export function generateSqlScript(arr, team_name){
  let sqlIndicators = '';
  arr.forEach(element => {
      let sqlType = setIndicatorType(element['indicator_type']) ? 'float' : 'time'
      let text = "`" + `${String(element['indicator_name']).toLowerCase()}` + "` " + `${sqlType} DEFAULT NULL,
      `;
      sqlIndicators += text
  });
  return generateSql(sqlIndicators, team_name)
}

function setIndicatorType(indicator){
    const numberType = ['inteiro', 'decimal', 'percentual', 'porcentagem']
    for (const elemento of numberType) {
      if (indicator.toLowerCase().includes(elemento)) {
        return true
      }
    }
  }