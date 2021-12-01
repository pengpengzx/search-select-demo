<template>
  <div style="position: relative">
    <div style="position: relative; z-index: 5" @keyup.stop="keyupHandler">
      <input
        type="text"
        v-model="searchValue"
        placeholder="请搜索.."
        @input="search"
        @focus="focusHandler"
      />
      <div class="select-wraper" v-if="isShowSelect">
        <!-- 模拟select -->
        <ul class="group" v-for="group in groupList" :key="group.key">
          <p class="group-title">{{ group.title }}</p>
          <li
            class="item"
            :class="{
              disabled: item.isDisabled,
              isChecked: result && item.key === result.key,
              isFocus: item.index,
            }"
            v-for="item in group.itemList"
            :tabindex="0"
            :key="item.key"
            @click="confirm(item)"
            @keydown.enter="confirm(item)"
          >
            <p
              @mouseenter.stop="mouseenterHandler"
              @mouseleave="mouseleaveHandler"
            >
              {{ item.title }}
            </p>
          </li>
        </ul>
        <p v-if="groupList.length === 0" class="select-tip">暂无数据....</p>
      </div>
      <div v-if="result" style="margin-top: 15px">
        你选择了: {{ result.title }}
      </div>
    </div>
    <!-- 外层mask 用来点击组件意外的区域时关闭组件 -->
    <div class="mask" @click="closeSelect"></div>
  </div>
</template>

<script>
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
  name: "HelloWorld",
  data() {
    return {
      groupList: [], // select的options
      isShowSelect: false, // 是否展示模拟弹框
      result: null, // 搜索结果
      searchValue: "", // 搜索关键词
      itemList: [],
      keyUpIndex: -1,
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
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
    initData() {
      this.groupList = this.cloneDeep(mockData);
    },
    // 搜索
    async search(e) {
      try {
        const target = e.target.value;
        if (target === "") {
          return this.initData();
        }
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
        this.cloneDeep(mockData).forEach((el) => {
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
    },
    // 点击item的回调
    confirm(item) {
      if (item.isDisabled) return false;

      this.result = item;
      this.closeSelect();
    },
    // 暂时模拟lodash 深拷贝
    cloneDeep(obj) {
      try {
        const jsonStr = JSON.stringify(obj);
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error);
      }
    },
    // 关闭select
    closeSelect() {
      this.isShowSelect = false;
      this.searchValue = "";
      this.keyUpIndex = -1;
      this.initData();
    },
    mouseenterHandler(e) {
      const animateCondition = 200 - 45;
      const width = e.target.clientWidth;

      if (width > animateCondition) {
        e.target.className = "transx";
      }
    },
    mouseleaveHandler(e) {
      e.target.className = "";
    },
    keyupHandler(e) {
      if (e.code === "ArrowDown") {
        this.arrowDown(e);
      }
      if (e.code === "ArrowUp") {
        this.arrowUp(e);
      }
    },
    // 键盘【上】事件
    arrowUp(e) {
      // 只有arrow down或者up的时候获取dom
      let itemListDom = document.getElementsByTagName("li");

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
      let itemListDom = document.getElementsByTagName("li");

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
.item.isChecked::before {
  position: absolute;
  content: "✔";
  top: -1px;
  left: 10px;
}
.item:hover {
  background: #656565;
}
.item.disabled {
  cursor: not-allowed;
}
.item.disabled:hover {
  background: none;
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
