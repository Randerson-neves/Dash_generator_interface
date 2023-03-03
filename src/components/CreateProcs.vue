<template>
  <div class="orderbutton">
    <div v-for="(param, index) in params.fileParams.slice().reverse()" :key="index" class="row">
      <q-select
        v-model="param.input"
        :options="type_options"
        label="Tipo de Indicador"
        outlined
        class="param-select"
        @change="updateText(param.input)"
      />

      <q-input
        v-model="param.name"
        class="paraminput"
        label="Nome do Indicador calculado"
        outlined
      />

      <div class="param-select" v-for="num in param.numIndicators" :key="num">

        <q-select
          v-model="param.calc['indicator' + num]"
          :options="indicatorOptions"
          label="Nome do Indicador"
          outlined
        />
      </div>
    
      <q-select
          v-model="param.calc['operations']"
          :options="operations_options"
          outlined
        />

      <div class="button-container">
        <q-btn icon="add" size="10px" @click="addIndicatorToCalc(param)" />
        <q-btn icon="remove" size="10px" @click="removeIndicatorToCalc(param)" />
      </div>
      <p>{{ param }}</p>
      
    </div>
    <q-btn
      icon="add"
      color="primary"
      class="add-row-button"
      label="Criar novo cálculo"
      @click="addNewCalc(index)"
    />
  </div>
</template>
  
  <script>
  export default {

    data() {
      return {
        params: {
          fileParams: [],
        },
        type_options: [
          { label: 'Porcentagem', value: 'percentual_func_v2(' },
          { label: 'Número', value: 'ROUND(' },
          { label: 'Hora', value: 'big_time_to_sec(' },
          { label: 'Moeda', value: 'ROUND(' },
        ],
        operations_options: [
          {label: 'Divisao', value: '/'},
          {label: 'Soma', value: '+'},
          {label: 'Subtração', value: '-'},
          {label: 'Multiplicação', value: '*'},          
        ],
        indicatorOptions: [],
      };
    },

    mounted() {
      const jsonParams = decodeURIComponent(this.$route.query.params);

      this.params.fileParameters = JSON.parse(jsonParams).map(param => {
        return {
          label: (param.indicator_name).toLowerCase(),
          type: this.changeType(param.indicator_type)
        };
      });

      this.indicatorOptions = this.params.fileParameters.map(param => {
        return {
          label: param.label,
          type: param.type
        };
      });
    },

    methods: {

      changeType(type){
        const numberType = ['inteiro', 'decimal', 'percentual', 'porcentagem', 'hora']
        for (const elemento of numberType) {
          if (type.toLowerCase().includes(elemento)) {
            return elemento;
          }
        }
      },

      addNewCalc(index) {
        const newParam = {
          numIndicators: 1, // novo param começa com 1 q-select
          calc:{}
        };
        this.params.fileParams.splice(index + 1, 0, newParam);
      },

      addIndicatorToCalc(param) {
        param.calc['indicator' + param.numIndicators];
        param.numIndicators++;
      },

      removeIndicatorToCalc(param){

        if(param.numIndicators > 1 ){
          delete param['indicator' + param.numIndicators];
          param.numIndicators--;
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
    width: 10%;

  }
  
  .param-input {
    width: 20%;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 3px;
  }

  .button-container q-btn:first-child {
    margin-bottom: 10px;
  }

  .add-row-button{
    margin-top: 10px;
  }


</style>
  