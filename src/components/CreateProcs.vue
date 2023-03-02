<template>
    <div class="orderbutton">
      <div v-for="(param, index) in params.fileParams" :key="index" class="row">
        <q-select
          v-model="param.input"
          :options="options"
          label="Tipo de Indicador"
          outlined
          class="param-select"
          @change="updateText(param.input)"
        />
        <q-input
          v-model="param.name"
          class="paraminput"
          label="Nome do Indicador"
          outlined
        />
        <q-select
          v-model="param.calc"
          :options="indicatorOptions"
          label="nome do Indicador"
          outlined
          class="param-select"
        />
        <q-input
          v-if="param.input && param.input.value"
          v-model="(param.input.value)"
          class="param-input"
          label="Input de texto baseado nas seleções acima"
          outlined
          :value="''"
        />
        <q-input
          v-else
          class="param-input"
          label="Input de texto baseado nas seleções acima"
          outlined
          :value="''"
        />
        <p>
          {{ param }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {

    data() {
      return {
        params: [],
        options: [
          { label: 'Porcentagem', value: 'percentual_func_v2(' },
          { label: 'Número', value: 'ROUND(' },
          { label: 'Hora', value: 'big_time_to_sec(' },
          { label: 'Moeda', value: 'ROUND(' },
        ],
        indicatorOptions: [],
        inputText: ''
      };
    },

    mounted() {
      const jsonParams = decodeURIComponent(this.$route.query.params);
      this.params.fileParams = JSON.parse(jsonParams).map(param => {
        return {
          label: param.indicator_name,
          type: this.changeType(param.indicator_type)
        };
      });
      this.indicatorOptions = this.params.fileParams.map(param => {
        return {
          label: param.label  ,
          type: param.type
        };
      });
    },

    methods: {
      changeType(type){
        const numberType = ['inteiro', 'decimal', 'percentual', 'porcentagem', 'hora']
        for (const elemento of numberType) {
          if (type.toLowerCase().includes(elemento)) {
            console.log(elemento)
            return elemento
          }
        }
      }
    }
  };

  </script>
  
  <style>
  .orderbutton {
    margin-top: 3%;
    margin-left: 2%;
  }
  
  .param-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .param-select {
    width: 15%;
  }
  
  .param-input {
    width: 20%;
  }
  </style>
  