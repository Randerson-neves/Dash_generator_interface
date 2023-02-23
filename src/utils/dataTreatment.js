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

function setIndicatorType(indicator){
    const numberType = ['inteiro', 'decimal', 'percentual', 'porcentagem']
    for (const elemento of numberType) {
      if (indicator.toLowerCase().includes(elemento)) {
        return true
      }
    }
  }