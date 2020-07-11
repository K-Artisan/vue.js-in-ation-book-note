Vue.directive("clickoutside", {
    bind: function (el, binding, vnode) {
        function documentHandler(e) {
            if (el.contains(e.target)) { //第一个是判断点击的区域是否是指令所在的元素内部，
                return false;
            }
            if (binding.expression) {  //在该自定义指令中，表达式应该是一个函数
                binding.value(e); //binding.value()就是用来执行当前上下文 methods中指定的函数的
            }
        }

        //与Vue 1.x不同的是，在自定义指令中，不能再用this.xxx的形式在上下文中声明一个变量，
        //所以用了el.__vueClickOutside__引用了documentHandler，
        //这样就可以在unbind钩子里移除对document的click事件监听。如果不移除，当组件或元素销毁时，它仍然存在于内存中
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind: function (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
});