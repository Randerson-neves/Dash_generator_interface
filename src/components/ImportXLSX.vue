<template>
  <q-page>
    <div class="q-layout column justify-center items-center q-pt-md q-pb-md">
      <input type="text" v-model="inputValue" placeholder="Nome do ambiente" class="q-mb-md">
      <input type="file" ref="fileInput" style="display: none" @change="handleFileInput" class="bg-green-6 text-white p-4 rounded">
      <q-btn label="Selecione o arquivo" @click="chooseFile" class="bg-green-6 text-white p-4 rounded q-mt-md" />
      <q-btn-group class="q-mt-md">
        <q-btn label="Clean File Data" @click="copyContent(btn1_fileIndicators)" />
        <q-btn label="Load File Data" @click="copyContent(btn2_fileMapping)" />
        <q-btn label="Sql Scripts" @click="copyContent(btn3_sqlScripts)" />
      </q-btn-group>
    </div>
  </q-page>
</template>

<script>
import * as XLSX from 'xlsx';
import {setDataType, setMappingIndicators, generateDataArray, generateSqlScript} from '../utils/dataTreatment'

//posteriormente, tentar ter um arquivo com todas as funções de tratamento do XLSX

export default {
    data() {
      return {
        fileName: null,
        btn1_fileIndicators: null,
        btn2_fileMapping: null,
        btn3_sqlScripts: null,
        inputValue: ""
      }
    },
    methods: {

      chooseFile() {
        this.$refs.fileInput.click();
      },

      handleFileInput(event) {
        const file = event.target.files[0];
        this.fileName = file.name;
        this.importData(file);
      },

      // Função de importação e conversão do arquivo XLSX
      async importData(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet, { range: 'A1:ZZ2'})[0];
          // data representa as 2 primeiras linhas do XLSX em todo o comprimento
          let indicatorsArray = generateDataArray(data);

          //seta o tipo de dado que cada indicador possui e já transforma no modelo de código que será recebido
          //fazer com que ele possua um script default que faça com que o arquivo load e clean seja gerado automaticamente
          // e fique em storage no botão
          this.btn1_fileIndicators = setDataType(indicatorsArray);
          this.btn2_fileMapping = setMappingIndicators(indicatorsArray);
          this.btn3_sqlScripts = generateSqlScript(indicatorsArray, this.inputValue.toLowerCase())

          resolve();
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(file);
      }).then(() => {
        this.resetImport();
      }).catch((error) => {
        console.error(error);
        this.resetImport();
      });
    },

    resetImport() {
      this.fileName = null;
      this.importProgress = 0;
      this.$refs.fileInput.value = '';
    },

    copyContent(content){
      navigator.clipboard.writeText(content)
    }

  },
}

</script>