<template>
  <div id="app">
    <div></div>
    <GroupSelect
      :data="mockData"
      @onChange="changHandler"
      key="b"
      :value="result"
      placeholder="写点什么.."
    />
    <div v-if="result" style="margin-top: 15px">
      你选择了: {{ result.title }}
    </div>
    <GroupSelect :data="mockData" @onChange="changHandler2" key="a" :value="result2"/>
    <div v-if="result2" style="margin-top: 15px">
      你选择了: {{ result2.title }}
    </div>
  </div>
</template>

<script>
import GroupSelect from "./components/GroupSelect.vue";
// 测试数据
const mockData = [
  {
    title: "汽车",
    key: "car",
    itemList: [
      {
        title: "奔驰奔驰奔驰奔驰奔驰奔驰奔驰奔驰奔驰奔驰奔驰奔",
        key: "m",
        isDisabled: false,
      },
      {
        title: "宝马",
        key: "b",
        isDisabled: false,
      },
      {
        title: "奥迪",
        key: "a",
        isDisabled: true,
      },
    ],
  },
  {
    title: "自行车",
    key: "bicyle",
    itemList: [
      {
        title: "捷安特",
        key: "g",
        isDisabled: false,
      },
      {
        title: "闪电",
        key: "ss",
        isDisabled: false,
      },
      {
        title: "凤凰",
        key: "p",
        isDisabled: false,
      },
      {
        title: "宝凤凰",
        key: "pp",
        isDisabled: false,
      },
      {
        title: "宝凤奔驰",
        key: "ppp",
        isDisabled: true,
      },
    ],
  },
];
export default {
  name: "App",
  data() {
    return {
      mockData,
      result: null,
      result2: {
        isDisabled: false,
        key: "b",
        title: "宝马",
      },
    };
  },
  components: {
    GroupSelect,
  },
  methods: {
    changHandler(val) {
      this.result = val;
    },
    changHandler2(val) {
      this.result2 = val;
    },
  },
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 200px;
}
</style>
