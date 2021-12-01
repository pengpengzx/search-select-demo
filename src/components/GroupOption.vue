<template>
  <div>
    <ul class="group" v-for="group in groupList" :key="group.key">
      <p class="group-title">{{ group.title }}</p>
      <li
        class="item"
        :class="{
          disabled: item.isDisabled,
          isChecked: isChecked(item),
          isFocus: item.index,
        }"
        v-for="item in group.itemList"
        :tabindex="0"
        :key="item.key"
        @click="confirm(item)"
        @keydown.enter="confirm(item)"
      >
        <p @mouseenter.stop="mouseenterHandler" @mouseleave="mouseleaveHandler">
          {{ item.title }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { cloneDeep } from './utils';
export default {
  data() {
    return {
      keyUpIndex: -1,
      result: null,
    };
  },
  props: {
    groupList: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Object,
      default: null,
    },
  },
  created() {
    this.result = this.cloneDeep(this.value);
  },
  methods: {
    cloneDeep,
    // 点击item的回调
    confirm(item) {
      if (item.isDisabled) return false;
      if (this.isChecked(item)) {
        return this.$emit("confirm", null);
      }
      this.result = item;
      this.$emit("confirm", this.result);
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
    // 是否选中
    isChecked(item) {
      return this.result && item.key === this.result.key
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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