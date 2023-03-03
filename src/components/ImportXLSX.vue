<template>
  <q-page>
    <div class="q-layout column justify-center items-center q-pt-md q-pb-md">
      <q-input outlined v-model="team_subdomain" label="Subdomínio" required/>
      <input type="file" ref="fileInput" style="display: none" @change="handleFileInput" class="bg-green-6 text-white p-4 rounded">
      <q-btn label="Envie o arquivo a ser processado" @click="chooseFile" class="bg-blue-6 text-white p-4 rounded q-mt-md" :disabled="!team_subdomain"/>
    </div>

      <div class="q-layout row justify-center items-center q-pt-md q-pb-md">
        <div class="sideinfo">
          <div class="markaround">
            <div class="scrollable ">
              <p>{{ btn1_fileIndicators }}</p>
            </div>
            <q-btn label="Clean File Data" @click="copyContent(btn1_fileIndicators)" :disabled="!allFunctionsCompleted"/>
          </div>
        </div>
        <div class="sideinfo">
          <div class="markaround">
            <div class="scrollable">
              <p>{{ btn2_fileMapping }}</p>
            </div>
            <q-btn label="Load File Data" @click="copyContent(btn2_fileMapping)" :disabled="!allFunctionsCompleted"/>
          </div>
        </div>
        <div class="sideinfo">
          <div class="markaround">
            <div class="scrollable">
              <p>{{btn3_sqlScripts }}</p>
            </div>
            <q-btn label="Sql Scripts" @click="copyContent(btn3_sqlScripts)" :disabled="!allFunctionsCompleted"/>
          </div>
        </div>
      </div>
      <q-btn label="Nova Rota" @click="goToNewRoute" class="bg-purple-6 text-white p-4 rounded q-mt-md" :disabled="!allFunctionsCompleted"/>
  </q-page>
</template>

<script>
import * as XLSX from 'xlsx';
import {setDataType, setMappingIndicators, generateDataArray, generateSqlScript} from '../utils/dataTreatment'

export default {
    data() {
      return {
        fileName: null,
        btn1_fileIndicators: null,
        btn2_fileMapping: null,
        btn3_sqlScripts: null,
        team_subdomain: "",
        allFunctionsCompleted: false,
        procsParams: null
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

          let indicatorsArray = generateDataArray(data);
          this.procsParams = indicatorsArray;

          this.btn1_fileIndicators = setDataType(indicatorsArray);
          this.btn2_fileMapping = setMappingIndicators(indicatorsArray);
          this.btn3_sqlScripts = generateSqlScript(indicatorsArray, this.team_subdomain.toLowerCase())

          resolve();
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(file);
      }).then(() => {
        this.resetImport();
        this.allFunctionsCompleted = true;
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
    },

    goToNewRoute() {
      const jsonParams = encodeURIComponent(JSON.stringify(this.procsParams))
      if (this.allFunctionsCompleted) {
        this.$router.push({
          path: '/proc-generator',
          query: {
            params: jsonParams
          }
        })
      }
    }
  },
}

</script>

<style lang="scss" scoped>
  .q-layout.row {
  display: flex;
  flex-direction: row;
}

.sideinfo {
  height: 35%; 
  width: 25%;
  margin-left: 30px;
}

.scrollable {
  overflow-y: auto;
  max-height: 500px;
}

.content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn-below {
    margin-top: 10px;
  }
  
  .markaround{
    border: 2px black solid;
    display: flex; 
    flex-direction: column;
  }

</style>