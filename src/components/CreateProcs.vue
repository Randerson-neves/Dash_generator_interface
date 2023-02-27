<template>
    <div class="orderbutton">
      <div v-for="(param, index) in params" :key="index" class="row">
        <q-select
          v-model="param.input"
          :options="options"
          label="Tipo de Indicador"
          outlined
          class="param-select"
          @change="updateText(param.input)"
        />
        <p>
            {{ param.input }}
        </p>
        <q-input
          v-model="param.name"
          class="param-input"
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
          v-model="param.text"
          class="param-input"
          label="Input de texto baseado nas seleções acima"
          outlined
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        params: [],
        options: [
          { label: 'Porcentagem', value: 'percent' },
          { label: 'Número', value: 'number' },
          { label: 'Hora', value: 'hour' },
          { label: 'Moeda', value: 'currency' },
        ],
        indicatorOptions: [],
        inputText: ''
      };
    },
    mounted() {
      const jsonParams = decodeURIComponent(this.$route.query.params);
      this.params = JSON.parse(jsonParams);
    },
    methods: {
      updateText(param) {
        console.log(param)
        if (param.value === 'percent') {
          param.input = 'percentual_func_v2(';
        } else if (param.input === 'number' || param.type === 'hour') {
          param.text = 'ROUND(';
        } else if (param.input === 'hour') {
          param.text = 'big_time_to_sec(';
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
  