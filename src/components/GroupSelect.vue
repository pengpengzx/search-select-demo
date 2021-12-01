<template>
  <div style="position: relative" ref="select-input">
    <div style="position: relative; z-index: 5" @keyup.stop="keyupHandler">
      <input
        type="text"
        v-model="searchValue"
        :placeholder="placeholder"
        @focus="focusHandler"
        @compositionstart="compositionHandler"
        @compositionend="compositionHandler"
        @input="throttle(search.bind(this, $event), 200)()"
      />
      <div class="select-wraper" v-if="isShowSelect">
        <group-option
          :groupList="groupList"
          @confirm="confirmHandler"
          :value="result"
        ></group-option>
        <p v-if="groupList.length === 0" class="select-tip">
          {{ emptyDataText }}
        </p>
      </div>
    </div>
    <!-- 外层mask 用来点击组件意外的区域时关闭组件 -->
    <div class="mask" @click="closeSelect" v-if="isShowMask"></div>
  </div>
</template>

<script>
import GroupOption from "./GroupOption.vue";
import { cloneDeep, throttle } from "./utils";

export default {
  components: { GroupOption },
  name: "HelloWorld",
  data() {
    return {
      groupList: [], // select的options
      isShowSelect: false, // 是否展示模拟弹框
      result: null, // 搜索结果
      searchValue: "", // 搜索关键词
      itemList: [], // 所有子item的容器
      keyUpIndex: -1, // 上下键盘选择元素的索引值
      isShowMask: false,
      isWaitingInputFlag: false,
    };
  },
  props: {
    // 数据源
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Object,
      default: null,
    },
    placeholder: {
      type: String,
      default: "请输入要搜索的内容",
    },
    emptyDataText: {
      type: String,
      default: "暂无数据...",
    },
  },
  created() {
    this.initData();
  },
  mounted() {
  },
  watch: {
    groupList(val) {
      let tempArr = [];
      val.forEach((el) => {
        tempArr = tempArr.concat(el.itemList);
      });
      this.itemList = this.cloneDeep(tempArr);
    },
  },
  methods: {
    throttle,
    cloneDeep,
    initData() {
      this.groupList = this.cloneDeep(this.data);
      this.result = this.cloneDeep(this.value);
    },
    // 搜索
    async search(e) {
      try {
        if (this.isWaitingInputFlag) {return false;}

        const target = e.target.value;
        if (target === "") {return this.initData();}

        const data = await this.fetchData(target);
        this.groupList = data || [];
      } catch (error) {
        console.log(error);
      }
    },
    // 模拟获取数据
    fetchData(target) {
      return new Promise((resolve) => {
        const tempList = [];
        this.cloneDeep(this.data).forEach((el) => {
          const resultItem = el.itemList.filter((item) => {
            return item.title.indexOf(target) > -1;
          });
          if (resultItem.length > 0) {
            el.itemList = resultItem;
            tempList.push(el);
          }
        });
        resolve(this.cloneDeep(tempList));
      });
    },
    focusHandler() {
      this.isShowSelect = true;
      this.isShowMask = true;
    },
    // 关闭select
    closeSelect() {
      this.isShowSelect = false;
      this.searchValue = "";
      this.keyUpIndex = -1;
      this.isShowMask = false;
      this.initData();
    },
    confirmHandler(val) {
      this.result = val;
      this.$emit("onChange", this.result);
      this.$nextTick(() => {
        this.closeSelect();
      });
    },
    keyupHandler(e) {
      if (e.code === "ArrowDown") {
        this.arrowDown(e);
      }
      if (e.code === "ArrowUp") {
        this.arrowUp(e);
      }
    },
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event 优化拼音输入体验
    compositionHandler(e) {
      this.isWaitingInputFlag = e.type !== "compositionend";
    },
    // 键盘【上】事件
    arrowUp(e) {
      // 只有arrow down或者up的时候获取dom
      let itemListDom = this.$refs['select-input'].getElementsByTagName("li");

      // 处理边界条件
      if (this.keyUpIndex === -1) {
        this.keyUpIndex = itemListDom.length;
      }
      this.keyUpIndex -= 1;

      // 处理边界条件
      if (this.keyUpIndex === -1) {
        this.keyUpIndex = itemListDom.length - 1;
      }
      const target = itemListDom[this.keyUpIndex];

      if (this.isJumpThisItem(target)) {
        return this.arrowUp(e);
      }
      target.focus();
    },
    // 键盘【下】事件
    arrowDown(e) {
      let itemListDom = this.$refs['select-input'].getElementsByTagName("li");

      this.keyUpIndex += 1;
      // 处理边界条件
      if (this.keyUpIndex === itemListDom.length) {
        this.keyUpIndex = 0;
      }
      const target = itemListDom[this.keyUpIndex];

      if (this.isJumpThisItem(target)) {
        return this.arrowDown(e);
      }
      target.focus();
    },
    // 是否应该跳过该item
    isJumpThisItem(target) {
      const hasItem = this.itemList.filter((el) => !el.isDisabled).length > 0;
      return hasItem && target.className.indexOf("disabled") > -1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
input {
  width: 100%;
  border-radius: 3px;
  padding: 4px 10px;
}
.select-wraper {
  background: #999;
  border-radius: 3px;
  min-height: 100px;
}
.select-tip {
  padding-top: 25px;
  color: white;
}
.item {
  width: 100%;
  text-align: left;
  position: relative;
  display: block;
  color: white;
  padding: 0 45px;
  white-space: nowrap;
  overflow-x: scroll;
}
.item p {
  display: inline-block;
  position: relative;
  left: 0;
}
.transx {
  animation: transx 5s infinite;
}
.long-text-animate {
  transform: translateX(-100px);
}

.group-title {
  padding: 5px 30px 0 30px;
  text-align: left;
  color: #666;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}
.isFocus {
  background: #656565;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
@keyframes transx {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
